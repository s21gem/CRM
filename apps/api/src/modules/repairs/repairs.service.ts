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

  static async createRepair(data: any, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      const repairNumber = await this.generateRepairNumber();
      
      const newRepair = await tx.repairOrder.create({
        data: {
          ...data,
          repairNumber,
          status: 'NEW',
          receivedByUserId: userId
        }
      });

      await tx.repairActivity.create({
        data: {
          repairOrderId: newRepair.id,
          userId,
          action: 'REPAIR_CREATED',
          details: `Repair Order ${repairNumber} created.`
        }
      });

      await tx.repairStatusHistory.create({
        data: {
          repairOrderId: newRepair.id,
          status: 'NEW'
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.REPAIR_CREATED,
          ipAddress: ip,
          userAgent,
          details: `Created Repair Order: ${repairNumber}`
        }
      });

      return newRepair;
    });
  }

  static async updateStatus(repairId: string, status: RepairStatus, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      const rep = await tx.repairOrder.update({
        where: { id: repairId },
        data: { status }
      });

      await tx.repairActivity.create({
        data: {
          repairOrderId: rep.id,
          userId,
          action: 'REPAIR_STATUS_CHANGED',
          details: `Status changed to ${status}`
        }
      });

      await tx.repairStatusHistory.create({
        data: { repairOrderId: rep.id, status }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.REPAIR_STATUS_CHANGED,
          ipAddress: ip,
          userAgent,
          details: `Repair ${rep.repairNumber} status changed to ${status}`
        }
      });

      return rep;
    });
  }

  static async updateDiagnosis(repairId: string, diagnosisData: any, estimatedCost: number | undefined, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      await tx.diagnosis.upsert({
        where: { repairOrderId: repairId },
        create: { repairOrderId: repairId, ...diagnosisData },
        update: diagnosisData
      });

      if (estimatedCost !== undefined) {
        await tx.repairOrder.update({
          where: { id: repairId },
          data: { estimatedCost }
        });
      }
      
      await tx.repairActivity.create({
        data: {
          repairOrderId: repairId,
          userId,
          action: 'REPAIR_DIAGNOSED',
          details: `Diagnosis updated`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.REPAIR_DIAGNOSED,
          ipAddress: ip,
          userAgent,
          details: `Repair ${repairId} diagnosis updated`
        }
      });
    });
  }
}
