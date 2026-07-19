import { Request, Response } from 'express';
import { PrismaClient, AuthEvent, RepairStatus } from '@prisma/client';
import { z } from 'zod';
import { RepairsService } from './repairs.service';

const prisma = new PrismaClient();

export class RepairsController {
  static async createRepair(req: Request, res: Response) {
    try {
      const schema = z.object({
        customerId: z.string(),
        deviceId: z.string(),
        problemDescription: z.string().min(1),
        customerComplaint: z.string().optional(),
        intakeCondition: z.string().optional(),
        accessoriesReceived: z.string().optional(),
        priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional()
      });

      const data = schema.parse(req.body);
      const user = (req as any).user;
      
      const repair = await RepairsService.createRepair(data, user?.userId, req.ip || '', req.headers['user-agent']);

      return res.status(201).json({ success: true, data: repair, message: 'Repair order created successfully' });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  static async getRepairs(req: Request, res: Response) {
    try {
      const { page = '1', limit = '50' } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const [repairs, total] = await prisma.$transaction([
        prisma.repairOrder.findMany({
          include: {
            customer: true,
            device: true,
            assignedTechnician: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.repairOrder.count()
      ]);

      return res.json({ success: true, data: { repairs, total, page: Number(page), limit: Number(limit) } });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }
  
  static async getRepairDashboard(req: Request, res: Response) {
    try {
      const repairs = await prisma.repairOrder.findMany({
        select: { status: true, assignedTechnicianId: true, priority: true }
      });
      const user = (req as any).user;
      
      const stats = {
        total: repairs.length,
        myRepairs: repairs.filter(r => r.assignedTechnicianId === user?.userId).length,
        waitingApproval: repairs.filter(r => r.status === 'WAITING_APPROVAL').length,
        waitingParts: repairs.filter(r => r.status === 'WAITING_PARTS').length,
        readyToday: repairs.filter(r => r.status === 'READY_FOR_PICKUP').length,
        inRepair: repairs.filter(r => r.status === 'IN_REPAIR').length
      };

      return res.json({ success: true, data: stats });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  static async getRepairById(req: Request, res: Response) {
    try {
      const repair = await prisma.repairOrder.findUnique({
        where: { id: req.params.id },
        include: {
          customer: true,
          device: true,
          assignedTechnician: true,
          diagnosis: true,
          checklist: true,
          notes: { include: { user: true }, orderBy: { createdAt: 'desc' } }
        }
      });
      
      if (!repair) return res.status(404).json({ success: false, message: 'Not found' });
      return res.json({ success: true, data: repair });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const schema = z.object({
        status: z.nativeEnum(RepairStatus)
      });
      
      const { status } = schema.parse(req.body);
      const repairId = req.params.id;
      const user = (req as any).user;

      const currentRepair = await prisma.repairOrder.findUnique({ where: { id: repairId } });
      if (!currentRepair) return res.status(404).json({ success: false, message: 'Not found' });

      if (!RepairsService.isValidTransition(currentRepair.status, status)) {
        return res.status(400).json({ success: false, message: `Invalid status transition from ${currentRepair.status} to ${status}` });
      }

      const updated = await RepairsService.updateStatus(repairId, status, user?.userId, req.ip || '', req.headers['user-agent']);

      return res.json({ success: true, data: updated });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  static async updateDiagnosis(req: Request, res: Response) {
    try {
      const schema = z.object({
        issueFound: z.string().optional(),
        rootCause: z.string().optional(),
        repairability: z.string().optional(),
        technicianNotes: z.string().optional(),
        recommendedParts: z.string().optional(),
        estimatedTime: z.string().optional(),
        estimatedCost: z.number().optional()
      });

      const data = schema.parse(req.body);
      const { estimatedCost, ...diagnosisData } = data;
      const user = (req as any).user;

      await RepairsService.updateDiagnosis(req.params.id, diagnosisData, estimatedCost, user?.userId, req.ip || '', req.headers['user-agent']);

      return res.json({ success: true, message: 'Diagnosis updated' });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  static async getTimeline(req: Request, res: Response) {
    try {
      const activities = await prisma.repairActivity.findMany({
        where: { repairOrderId: req.params.id },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      
      const statusHistory = await prisma.repairStatusHistory.findMany({
        where: { repairOrderId: req.params.id },
        orderBy: { createdAt: 'desc' }
      });
      
      // Merge timeline items
      const timeline = [
        ...activities.map(a => ({ type: 'ACTIVITY', data: a, date: a.createdAt })),
        ...statusHistory.map(s => ({ type: 'STATUS', data: s, date: s.createdAt }))
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      return res.json({ success: true, data: timeline });
    } catch (e: any) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}
