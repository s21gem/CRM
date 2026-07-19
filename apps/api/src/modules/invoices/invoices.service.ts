import { PrismaClient, Prisma, InvoiceStatus, SourceType, InvoiceItemType, Currency } from '@prisma/client';

const prisma = new PrismaClient();

export class InvoicesService {
  /**
   * Helper to generate FBXI-000001
   */
  static async generateSequenceNumber(tx: Prisma.TransactionClient): Promise<string> {
    const sequenceId = 'INVOICE_SEQ';
    let seq = await tx.sequence.findUnique({ where: { id: sequenceId } });
    if (!seq) {
      seq = await tx.sequence.create({ data: { id: sequenceId, value: 1 } });
    } else {
      seq = await tx.sequence.update({
        where: { id: sequenceId },
        data: { value: { increment: 1 } },
      });
    }
    return `FBXI-${seq.value.toString().padStart(6, '0')}`;
  }

  /**
   * Recalculates totals. Called before saving invoice.
   */
  static calculateTotals(items: any[]) {
    let subtotal = 0;
    let laborTotal = 0;
    let partsTotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    for (const item of items) {
      const lineTotal = (item.unitPrice * item.quantity) - item.discountAmount + item.taxAmount;
      subtotal += lineTotal;
      discountTotal += item.discountAmount;
      taxTotal += item.taxAmount;

      if (item.type === InvoiceItemType.LABOR) {
        laborTotal += lineTotal;
      } else if (item.type === InvoiceItemType.PART) {
        partsTotal += lineTotal;
      }
    }

    const grandTotal = subtotal;

    return {
      subtotal,
      laborTotal,
      partsTotal,
      discountTotal,
      taxTotal,
      grandTotal,
    };
  }

  /**
   * Create a Draft Invoice
   */
  static async createDraft(repairOrderId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Verify RepairOrder exists and doesn't already have an active invoice
      const repairOrder = await tx.repairOrder.findUnique({
        where: { id: repairOrderId },
        include: {
          invoices: {
            where: { status: { not: InvoiceStatus.VOID } }
          },
          reservations: {
            where: { status: 'CONSUMED' },
            include: { item: true }
          }
        }
      });

      if (!repairOrder) throw new Error('Repair Order not found');
      if (repairOrder.invoices.length > 0) {
        throw new Error('An active invoice already exists for this repair order');
      }

      // 2. Generate Invoice Number
      const invoiceNumber = await this.generateSequenceNumber(tx as Prisma.TransactionClient);

      // 3. Create initial Draft
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          repairOrderId,
          customerId: repairOrder.customerId,
          status: InvoiceStatus.DRAFT,
          createdById: userId,
        },
      });

      // 4. Import Consumed Parts
      const itemsToCreate = [];
      let displayOrder = 1;
      
      for (const res of repairOrder.reservations) {
        itemsToCreate.push({
          invoiceId: invoice.id,
          type: InvoiceItemType.PART,
          sourceType: SourceType.INVENTORY,
          sourceId: res.id,
          description: res.item.name,
          quantity: res.quantity,
          unitPrice: res.unitPriceSnapshot, // use the immutable price snapshot
          partNumberSnapshot: res.item.partNumber,
          skuSnapshot: res.item.sku,
          itemNameSnapshot: res.item.name,
          unitSnapshot: res.item.unit,
          lineTotal: res.unitPriceSnapshot * res.quantity,
          displayOrder: displayOrder++,
        });
      }

      if (itemsToCreate.length > 0) {
        await tx.invoiceItem.createMany({ data: itemsToCreate });
      }

      // 5. Recalculate Totals
      const createdItems = await tx.invoiceItem.findMany({ where: { invoiceId: invoice.id } });
      const totals = this.calculateTotals(createdItems);

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          ...totals,
          balanceDue: totals.grandTotal, // initially balance == grandTotal
        },
        include: { items: true },
      });

      // 6. Audit & Activity
      await tx.invoiceActivity.create({
        data: { invoiceId: invoice.id, userId, action: 'DRAFT_CREATED', details: 'Invoice draft created and parts imported' }
      });
      await tx.invoiceStatusHistory.create({
        data: { invoiceId: invoice.id, status: InvoiceStatus.DRAFT, userId }
      });

      return updatedInvoice;
    });
  }

  /**
   * Add Labor Charge
   */
  static async addLaborCharge(invoiceId: string, data: { description: string; quantity: number; unitPrice: number; discountAmount?: number; taxAmount?: number }, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId }, include: { items: true } });
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.PENDING_REVIEW) {
        throw new Error('Cannot modify invoice in current status');
      }

      if (data.quantity < 0 || data.unitPrice < 0) throw new Error('Negative values not allowed');

      const discount = data.discountAmount || 0;
      const tax = data.taxAmount || 0;
      const lineTotal = (data.unitPrice * data.quantity) - discount + tax;

      await tx.invoiceItem.create({
        data: {
          invoiceId,
          type: InvoiceItemType.LABOR,
          sourceType: SourceType.LABOR,
          description: data.description,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          discountAmount: discount,
          taxAmount: tax,
          lineTotal,
          displayOrder: invoice.items.length + 1,
        }
      });

      const allItems = await tx.invoiceItem.findMany({ where: { invoiceId } });
      const totals = this.calculateTotals(allItems);

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: { ...totals, balanceDue: totals.grandTotal - invoice.paidAmount },
        include: { items: true }
      });

      await tx.invoiceActivity.create({
        data: { invoiceId, userId, action: 'LABOR_ADDED', details: `Added labor charge: ${data.description}` }
      });

      return updatedInvoice;
    });
  }

  /**
   * Refresh Parts (resyncs consumed parts)
   */
  static async refreshParts(invoiceId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.PENDING_REVIEW) {
        throw new Error('Cannot refresh parts on an approved/issued invoice');
      }

      const repairOrder = await tx.repairOrder.findUnique({
        where: { id: invoice.repairOrderId },
        include: {
          reservations: {
            where: { status: 'CONSUMED' },
            include: { item: true }
          }
        }
      });

      // Delete existing INVENTORY items
      await tx.invoiceItem.deleteMany({
        where: { invoiceId, sourceType: SourceType.INVENTORY }
      });

      const itemsToCreate = [];
      let displayOrder = 1;
      for (const res of repairOrder!.reservations) {
        itemsToCreate.push({
          invoiceId,
          type: InvoiceItemType.PART,
          sourceType: SourceType.INVENTORY,
          sourceId: res.id,
          description: res.item.name,
          quantity: res.quantity,
          unitPrice: res.unitPriceSnapshot,
          partNumberSnapshot: res.item.partNumber,
          skuSnapshot: res.item.sku,
          itemNameSnapshot: res.item.name,
          unitSnapshot: res.item.unit,
          lineTotal: res.unitPriceSnapshot * res.quantity,
          displayOrder: displayOrder++,
        });
      }

      if (itemsToCreate.length > 0) {
        await tx.invoiceItem.createMany({ data: itemsToCreate });
      }

      const allItems = await tx.invoiceItem.findMany({ where: { invoiceId } });
      const totals = this.calculateTotals(allItems);

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: { ...totals, balanceDue: totals.grandTotal - invoice.paidAmount },
        include: { items: true }
      });

      await tx.invoiceActivity.create({
        data: { invoiceId, userId, action: 'PARTS_REFRESHED', details: 'Synchronized consumed parts from Repair Order' }
      });

      return updatedInvoice;
    });
  }

  /**
   * Approve Invoice
   */
  static async approveInvoice(invoiceId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.PENDING_REVIEW) {
        throw new Error('Invalid status transition to APPROVED');
      }

      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: InvoiceStatus.APPROVED,
          approvedById: userId,
          approvedAt: new Date(),
        }
      });

      await tx.invoiceStatusHistory.create({
        data: { invoiceId, status: InvoiceStatus.APPROVED, userId }
      });
      await tx.invoiceActivity.create({
        data: { invoiceId, userId, action: 'STATUS_CHANGED', details: 'Invoice Approved' }
      });

      return updated;
    });
  }

  /**
   * Issue Invoice
   */
  static async issueInvoice(invoiceId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status !== InvoiceStatus.APPROVED) {
        throw new Error('Invoice must be APPROVED before ISSUING');
      }

      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: InvoiceStatus.ISSUED,
          issueDate: new Date(),
        }
      });

      await tx.invoiceStatusHistory.create({
        data: { invoiceId, status: InvoiceStatus.ISSUED, userId }
      });
      await tx.invoiceActivity.create({
        data: { invoiceId, userId, action: 'STATUS_CHANGED', details: 'Invoice Issued' }
      });

      return updated;
    });
  }

  /**
   * Void Invoice
   */
  static async voidInvoice(invoiceId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.PARTIALLY_PAID) {
        throw new Error('Cannot void an invoice with payments');
      }

      const updated = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: InvoiceStatus.VOID,
          balanceDue: 0,
        }
      });

      await tx.invoiceStatusHistory.create({
        data: { invoiceId, status: InvoiceStatus.VOID, userId }
      });
      await tx.invoiceActivity.create({
        data: { invoiceId, userId, action: 'STATUS_CHANGED', details: 'Invoice Voided' }
      });

      return updated;
    });
  }

  /**
   * Generate PDF Abstraction (Reserved for future)
   */
  static async generatePdf(invoiceId: string): Promise<Buffer> {
    // PDF generation logic goes here
    return Buffer.from('PDF_PLACEHOLDER');
  }

  /**
   * Get Invoices (List)
   */
  static async getInvoices(filters: any, page: number = 1, limit: number = 20) {
    const where: Prisma.InvoiceWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { invoiceNumber: { contains: filters.search, mode: 'insensitive' } },
        ]
      })
    };

    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { customer: true, repairOrder: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.invoice.count({ where })
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  /**
   * Get Invoice By ID
   */
  static async getInvoiceById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        repairOrder: { include: { device: true } },
        items: true,
        invoiceNotes: { include: { user: true } },
        statusHistory: { include: { user: true } },
        activities: { include: { user: true } },
        createdBy: true,
        approvedBy: true,
      }
    });
  }

  /**
   * Dashboard Metrics
   */
  static async getDashboardMetrics() {
    const [draft, pending, issued, overdue, paid, outstandingBalance] = await Promise.all([
      prisma.invoice.count({ where: { status: InvoiceStatus.DRAFT } }),
      prisma.invoice.count({ where: { status: InvoiceStatus.PENDING_REVIEW } }),
      prisma.invoice.count({ where: { status: InvoiceStatus.ISSUED } }),
      prisma.invoice.count({ where: { status: InvoiceStatus.ISSUED, dueDate: { lt: new Date() } } }),
      prisma.invoice.count({ where: { status: InvoiceStatus.PAID } }),
      prisma.invoice.aggregate({
        _sum: { balanceDue: true },
        where: { status: { in: [InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID] } }
      })
    ]);

    return {
      draft,
      pending,
      issued,
      overdue,
      paid,
      outstandingBalance: outstandingBalance._sum.balanceDue || 0
    };
  }
}
