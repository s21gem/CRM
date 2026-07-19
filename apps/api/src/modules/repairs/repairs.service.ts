import { PrismaClient, RepairStatus, AuthEvent } from '@prisma/client';

const prisma = new PrismaClient();

export class RepairsService {
  static async generateRepairNumber(): Promise<string> {
    const sequence = await prisma.sequence.upsert({
      where: { id: 'repair_number' },
      update: { value: { increment: 1 } },
      create: { id: 'repair_number', value: 1 },
    });
    return `FBXR-${String(sequence.value).padStart(6, '0')}`;
  }

  static getValidNextStatuses(currentStatus: RepairStatus): RepairStatus[] {
    const validTransitions: Record<RepairStatus, RepairStatus[]> = {
      NEW: ['INSPECTING', 'CANCELLED'],
      INSPECTING: ['DIAGNOSING', 'CANCELLED'],
      DIAGNOSING: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED'],
      WAITING_APPROVAL: ['APPROVED', 'CANCELLED'],
      APPROVED: ['WAITING_PARTS', 'IN_REPAIR'],
      WAITING_PARTS: ['IN_REPAIR', 'CANCELLED'],
      IN_REPAIR: ['ON_HOLD', 'QUALITY_CHECK'],
      ON_HOLD: ['IN_REPAIR', 'CANCELLED'],
      QUALITY_CHECK: ['IN_REPAIR', 'READY_FOR_PICKUP'],
      READY_FOR_PICKUP: ['DELIVERED'],
      DELIVERED: ['CLOSED'],
      CANCELLED: [],
      CLOSED: []
    };
    return validTransitions[currentStatus] || [];
  }

  static isValidTransition(current: RepairStatus, next: RepairStatus): boolean {
    if (current === next) return true; // allow same status update
    return this.getValidNextStatuses(current).includes(next);
  }
}
