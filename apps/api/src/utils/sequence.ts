import { PrismaClient, Prisma } from '@prisma/client';

const defaultPrisma = new PrismaClient();

/**
 * Shared sequence architecture to generate business identifiers (e.g., FBXL, FBXC)
 * safely and atomically.
 * 
 * @param tx - The Prisma transaction client (or standard client if outside a transaction)
 * @param sequenceId - Unique identifier for the sequence (e.g., 'LEAD', 'CUSTOMER')
 * @param prefix - The prefix to prepend (e.g., 'FBXL')
 * @returns The generated sequence number (e.g., 'FBXL-000001')
 */
export async function generateSequenceNumber(
  tx: Prisma.TransactionClient | PrismaClient = defaultPrisma,
  sequenceId: string,
  prefix: string
): Promise<string> {
  const sequence = await tx.sequence.upsert({
    where: { id: sequenceId },
    update: { value: { increment: 1 } },
    create: { id: sequenceId, value: 1 },
  });
  return `${prefix}-${String(sequence.value).padStart(6, '0')}`;
}
