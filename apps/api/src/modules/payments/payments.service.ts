import { PrismaClient, PaymentMethod, PaymentStatus, AuthEvent, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentsService {
  /**
   * Helper to generate FBXP-000001
   */
  static async generateSequenceNumber(tx: Prisma.TransactionClient, sequenceId: string, prefix: string): Promise<string> {
    let seq = await tx.sequence.findUnique({ where: { id: sequenceId } });
    if (!seq) {
      seq = await tx.sequence.create({ data: { id: sequenceId, value: 1 } });
    } else {
      seq = await tx.sequence.update({
        where: { id: sequenceId },
        data: { value: { increment: 1 } },
      });
    }
    return `${prefix}-${seq.value.toString().padStart(6, '0')}`;
  }

  /**
   * Generates dashboard KPIs for payments
   */
  static async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayCollection, outstanding, partial, failed, refunded] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: 'CONFIRMED',
          paymentDate: { gte: today }
        },
        _sum: { amountReceived: true }
      }),
      prisma.invoice.aggregate({
        where: { status: { in: ['ISSUED', 'PARTIALLY_PAID'] } },
        _sum: { balanceDue: true }
      }),
      prisma.invoice.count({
        where: { status: 'PARTIALLY_PAID' }
      }),
      prisma.payment.count({
        where: { status: 'FAILED' }
      }),
      prisma.payment.count({
        where: { status: 'REFUNDED' }
      })
    ]);

    return {
      todayCollection: todayCollection._sum.amountReceived || 0,
      outstandingBalance: outstanding._sum.balanceDue || 0,
      partialPayments: partial,
      failedPayments: failed,
      refundedPayments: refunded
    };
  }

  static async getPayments(filters: any) {
    return prisma.payment.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        receivedBy: true
      }
    });
  }

  static async getPaymentById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        customer: true,
        receivedBy: true,
        allocations: {
          include: {
            invoice: true
          }
        },
        receipts: true,
        statusHistory: true,
        activities: true
      }
    });
  }

  /**
   * Receive a new payment (PENDING state)
   */
  static async receivePayment(data: {
    customerId: string;
    amountReceived: number;
    method: PaymentMethod;
    currency?: 'USD' | 'BDT';
    referenceNumber?: string;
    transactionId?: string;
    methodMetadata?: any;
    notes?: string;
  }, userId: string) {
    if (data.amountReceived <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }

    return prisma.$transaction(async (tx) => {
      const paymentNumber = await this.generateSequenceNumber(tx as Prisma.TransactionClient, 'PAYMENT', 'FBXP');
      
      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          customerId: data.customerId,
          amountReceived: data.amountReceived,
          unallocatedAmount: data.amountReceived,
          method: data.method,
          currency: data.currency || 'USD',
          referenceNumber: data.referenceNumber,
          transactionId: data.transactionId,
          methodMetadata: data.methodMetadata,
          notes: data.notes,
          receivedById: userId,
          status: 'PENDING'
        }
      });

      await tx.paymentActivity.create({
        data: {
          paymentId: payment.id,
          userId,
          action: 'RECEIVE_PAYMENT',
          details: `Received payment of ${payment.amountReceived}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.PAYMENT_RECEIVED,
          details: `Payment received: ${paymentNumber}`
        }
      });

      return payment;
    });
  }

  /**
   * Confirm Payment (Makes it available for allocation)
   */
  static async confirmPayment(paymentId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new Error('Payment not found');
      if (payment.status !== 'PENDING') throw new Error('Only PENDING payments can be confirmed');

      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'CONFIRMED' }
      });

      await tx.paymentStatusHistory.create({
        data: {
          paymentId,
          status: 'CONFIRMED',
          userId,
          notes: 'Payment confirmed'
        }
      });

      await tx.paymentActivity.create({
        data: {
          paymentId,
          userId,
          action: 'CONFIRM_PAYMENT',
          details: 'Payment confirmed successfully'
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.PAYMENT_CONFIRMED,
          details: `Payment confirmed: ${payment.paymentNumber}`
        }
      });

      return updated;
    });
  }

  /**
   * Allocate Payment to an Invoice
   */
  static async allocatePayment(paymentId: string, invoiceId: string, amount: number, userId: string) {
    if (amount <= 0) throw new Error('Allocation amount must be greater than zero');

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });

      if (!payment) throw new Error('Payment not found');
      if (!invoice) throw new Error('Invoice not found');

      if (payment.status !== 'CONFIRMED') throw new Error('Only CONFIRMED payments can be allocated');
      if (payment.unallocatedAmount < amount) throw new Error(`Insufficient unallocated funds. Available: ${payment.unallocatedAmount}`);
      if (invoice.balanceDue < amount) throw new Error(`Allocation exceeds invoice balance due. Due: ${invoice.balanceDue}`);
      if (invoice.status === 'VOID') throw new Error('Cannot allocate to VOID invoice');

      // 1. Create Immutable Allocation Record
      const allocation = await tx.paymentAllocation.create({
        data: {
          paymentId,
          invoiceId,
          allocatedAmount: amount
        }
      });

      // 2. Update Payment Balances
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          amountAllocated: { increment: amount },
          unallocatedAmount: { decrement: amount }
        }
      });

      // 3. Update Invoice Balances & Status
      const newPaidAmount = invoice.paidAmount + amount;
      const newBalanceDue = invoice.balanceDue - amount;
      
      let newStatus = invoice.status;
      if (newBalanceDue === 0) {
        newStatus = 'PAID';
      } else if (newPaidAmount > 0) {
        newStatus = 'PARTIALLY_PAID';
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus
        }
      });

      // 4. Activity Logs
      await tx.paymentActivity.create({
        data: {
          paymentId,
          userId,
          action: 'ALLOCATE_PAYMENT',
          details: `Allocated ${amount} to Invoice ${invoice.invoiceNumber}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.PAYMENT_ALLOCATED,
          details: `Allocated ${amount} from ${payment.paymentNumber} to ${invoice.invoiceNumber}`
        }
      });

      return allocation;
    });
  }

  /**
   * Generate Receipt
   */
  static async generateReceipt(paymentId: string, remarks: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ 
        where: { id: paymentId },
        include: {
          customer: true,
          allocations: { include: { invoice: true } }
        }
      });
      if (!payment) throw new Error('Payment not found');
      if (payment.status !== 'CONFIRMED') throw new Error('Only CONFIRMED payments can generate receipts');
      
      const receiptNumber = await this.generateSequenceNumber(tx as Prisma.TransactionClient, 'RECEIPT', 'FBXR');
      
      const invoiceNumbers = payment.allocations.map(a => a.invoice.invoiceNumber).join(', ');

      const receipt = await tx.paymentReceipt.create({
        data: {
          receiptNumber,
          paymentId,
          customerNameSnapshot: `${payment.customer.firstName} ${payment.customer.lastName}`,
          invoiceNumbersSnapshot: invoiceNumbers || 'Unallocated',
          amountSnapshot: payment.amountReceived,
          currencySnapshot: payment.currency,
          paymentMethodSnapshot: payment.method,
          issuedById: userId,
          remarks
        }
      });

      await tx.paymentActivity.create({
        data: {
          paymentId,
          userId,
          action: 'GENERATE_RECEIPT',
          details: `Generated receipt ${receiptNumber}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.PAYMENT_RECEIPT_GENERATED,
          details: `Receipt ${receiptNumber} generated for ${payment.paymentNumber}`
        }
      });

      return receipt;
    });
  }

  /**
   * Cancel Payment (Only for PENDING)
   */
  static async cancelPayment(paymentId: string, notes: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new Error('Payment not found');
      if (payment.status !== 'PENDING') throw new Error('Only PENDING payments can be cancelled');

      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'CANCELLED' }
      });

      await tx.paymentStatusHistory.create({
        data: { paymentId, status: 'CANCELLED', userId, notes }
      });

      await tx.paymentActivity.create({
        data: { paymentId, userId, action: 'CANCEL_PAYMENT', details: notes }
      });

      await tx.auditLog.create({
        data: { userId, event: AuthEvent.PAYMENT_CANCELLED, details: notes }
      });

      return updated;
    });
  }

  /**
   * Refund Payment (Must be CONFIRMED, creates standalone financial event)
   */
  static async refundPayment(paymentId: string, notes: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new Error('Payment not found');
      if (payment.status !== 'CONFIRMED') throw new Error('Only CONFIRMED payments can be refunded');

      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: { status: 'REFUNDED' }
      });

      await tx.paymentStatusHistory.create({
        data: { paymentId, status: 'REFUNDED', userId, notes }
      });

      await tx.paymentActivity.create({
        data: { paymentId, userId, action: 'REFUND_PAYMENT', details: notes }
      });

      await tx.auditLog.create({
        data: { userId, event: AuthEvent.PAYMENT_REFUNDED, details: notes }
      });

      return updated;
    });
  }
}
