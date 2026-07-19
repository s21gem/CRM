import { PrismaClient, Prisma } from '@prisma/client';
import { generateSequenceNumber } from '../../utils/sequence';

const prisma = new PrismaClient();

export class CustomersService {
  /**
   * Retrieves a single customer by ID or Email/Phone
   */
  static async findCustomer(identifier: { id?: string; email?: string; phone?: string }) {
    if (identifier.id) {
      return prisma.customer.findUnique({ where: { id: identifier.id } });
    }
    if (identifier.email) {
      return prisma.customer.findUnique({ where: { email: identifier.email } });
    }
    if (identifier.phone) {
      return prisma.customer.findFirst({ where: { phone: identifier.phone } });
    }
    return null;
  }

  static async createCustomer(data: any, userId: string, ip: string, userAgent: string | undefined) {
    const customerNumber = await generateSequenceNumber(prisma, 'CUSTOMER', 'FBXC');
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          ...data,
          customerNumber
        }
      });

      await tx.customerActivity.create({
        data: {
          customerId: customer.id,
          userId,
          action: 'CREATED',
          description: 'Customer created manually'
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: 'CUSTOMER_CREATED',
          ipAddress: ip,
          userAgent,
          details: `Customer ${customer.id} created`
        }
      });

      return customer;
    });
  }

  static async updateCustomer(id: string, data: any, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.update({
        where: { id },
        data
      });

      await tx.customerActivity.create({
        data: {
          customerId: id,
          userId,
          action: 'UPDATED',
          description: 'Customer details updated'
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: 'CUSTOMER_UPDATED',
          ipAddress: ip,
          userAgent,
          details: `Customer ${id} updated`
        }
      });

      return customer;
    });
  }

  static async registerDevice(customerId: string, data: any, userId: string, ip: string, userAgent: string | undefined) {
    const deviceNumber = await generateSequenceNumber(prisma, 'DEVICE', 'FBXD');
    return prisma.$transaction(async (tx) => {
      const device = await tx.device.create({
        data: {
          ...data,
          deviceNumber,
          customerId
        }
      });

      await tx.customerActivity.create({
        data: {
          customerId,
          userId,
          action: 'DEVICE_REGISTERED',
          description: `Device ${device.brand} ${device.model} registered`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: 'DEVICE_ADDED',
          ipAddress: ip,
          userAgent,
          details: `Device ${device.id} registered for Customer ${customerId}`
        }
      });

      return device;
    });
  }
}
