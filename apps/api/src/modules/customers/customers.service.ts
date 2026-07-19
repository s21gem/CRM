import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomersService {
  /**
   * Generates a unique sequential number like FBXC-000001
   */
  static async generateSequenceNumber(type: 'CUSTOMER' | 'DEVICE'): Promise<string> {
    const prefix = type === 'CUSTOMER' ? 'FBXC' : 'FBXD';
    const sequenceId = `${type}_SEQ`;

    return await prisma.$transaction(async (tx) => {
      let seq = await tx.sequence.findUnique({ where: { id: sequenceId } });
      
      if (!seq) {
        seq = await tx.sequence.create({ data: { id: sequenceId, value: 1 } });
      } else {
        seq = await tx.sequence.update({
          where: { id: sequenceId },
          data: { value: { increment: 1 } }
        });
      }

      return `${prefix}-${seq.value.toString().padStart(6, '0')}`;
    });
  }

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
}
