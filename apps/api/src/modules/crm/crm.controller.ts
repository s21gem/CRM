import { Request, Response } from 'express';
import { PrismaClient, AuthEvent, LeadStatus, Prisma } from '@prisma/client';
import { ApiResponse } from '@fonebox/types';

const prisma = new PrismaClient();

export class CRMController {
  
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const totalLeads = await prisma.lead.count();
      const newLeads = await prisma.lead.count({ where: { status: 'NEW' } });
      const convertedLeads = await prisma.lead.count({ where: { status: 'CONVERTED' } });
      
      const leadsBySource = await prisma.lead.groupBy({
        by: ['source'],
        _count: { source: true }
      });

      const response: ApiResponse = {
        success: true,
        data: { totalLeads, newLeads, convertedLeads, leadsBySource }
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
    }
  }

  static async getSalesPipeline(req: Request, res: Response) {
    try {
      const { page = '1', limit = '50', search, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: Prisma.LeadWhereInput = {
        type: { in: ['QUOTE_REQUEST', 'BUSINESS_CONSULTATION'] },
      };

      if (status) {
        where.status = status as LeadStatus;
      }

      if (search) {
        const searchStr = String(search);
        where.OR = [
          { firstName: { contains: searchStr, mode: 'insensitive' } },
          { lastName: { contains: searchStr, mode: 'insensitive' } },
          { email: { contains: searchStr, mode: 'insensitive' } },
          { referenceNumber: { contains: searchStr, mode: 'insensitive' } }
        ];
      }

      const [leads, total] = await prisma.$transaction([
        prisma.lead.findMany({
          where,
          include: {
            assignee: { select: { id: true, firstName: true, lastName: true } },
            customer: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.lead.count({ where })
      ]);

      const response: ApiResponse = {
        success: true,
        data: { leads, total, page: Number(page), limit: Number(limit) }
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch sales pipeline' });
    }
  }

  static async getServiceQueue(req: Request, res: Response) {
    try {
      const { page = '1', limit = '50', search, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: Prisma.LeadWhereInput = {
        type: { in: ['REPAIR_REQUEST', 'GENERAL_INQUIRY'] },
      };

      if (status) {
        where.status = status as LeadStatus;
      }

      if (search) {
        const searchStr = String(search);
        where.OR = [
          { firstName: { contains: searchStr, mode: 'insensitive' } },
          { lastName: { contains: searchStr, mode: 'insensitive' } },
          { email: { contains: searchStr, mode: 'insensitive' } },
          { referenceNumber: { contains: searchStr, mode: 'insensitive' } }
        ];
      }

      const [leads, total] = await prisma.$transaction([
        prisma.lead.findMany({
          where,
          include: {
            assignee: { select: { id: true, firstName: true, lastName: true } },
            customer: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        }),
        prisma.lead.count({ where })
      ]);

      const response: ApiResponse = {
        success: true,
        data: { leads, total, page: Number(page), limit: Number(limit) }
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch service queue' });
    }
  }

  static async getLeadDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true } },
          customer: true,
          activities: {
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } }
          },
          notes: {
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } }
          }
        }
      });
      
      if (!lead) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }
      
      const response: ApiResponse = { success: true, data: lead };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to fetch lead details' });
    }
  }

  static async changeLeadStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = (req as any).user;

      if (!Object.values(LeadStatus).includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const result = await prisma.$transaction(async (tx) => {
        const lead = await tx.lead.update({
          where: { id },
          data: { status }
        });

        await tx.leadActivity.create({
          data: {
            leadId: id,
            userId: user?.userId,
            action: 'STATUS_CHANGED',
            details: `Status changed to ${status}`
          }
        });

        await tx.auditLog.create({
          data: {
            userId: user?.userId,
            event: AuthEvent.LEAD_STATUS_CHANGED,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: `Lead ${id} status changed to ${status}`
          }
        });

        return lead;
      });

      const response: ApiResponse = { success: true, data: result };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to change lead status' });
    }
  }

  static async assignLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { assigneeId } = req.body;
      const user = (req as any).user;

      const result = await prisma.$transaction(async (tx) => {
        const lead = await tx.lead.update({
          where: { id },
          data: { assignedTo: assigneeId }
        });

        await tx.leadActivity.create({
          data: {
            leadId: id,
            userId: user?.userId,
            action: 'ASSIGNED',
            details: `Assigned to user ${assigneeId}`
          }
        });

        await tx.auditLog.create({
          data: {
            userId: user?.userId,
            event: AuthEvent.LEAD_ASSIGNED,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: `Lead ${id} assigned to ${assigneeId}`
          }
        });

        return lead;
      });

      const response: ApiResponse = { success: true, data: result };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to assign lead' });
    }
  }

  static async convertLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const lead = await prisma.lead.findUnique({ where: { id } });
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

      const result = await prisma.$transaction(async (tx) => {
        let customer;
        if (lead.customerId) {
          customer = await tx.customer.findUnique({ where: { id: lead.customerId } });
        } else {
          let org = await tx.organization.findFirst();
          if (!org) {
             org = await tx.organization.create({ data: { name: 'Default Organization' } });
          }
          customer = await tx.customer.create({
            data: {
              organizationId: org.id,
              name: `${lead.firstName} ${lead.lastName}`,
              email: lead.email,
              phone: lead.phone,
            }
          });
        }

        const updatedLead = await tx.lead.update({
          where: { id },
          data: {
            status: LeadStatus.CONVERTED,
            customerId: customer?.id
          }
        });

        await tx.leadActivity.create({
          data: {
            leadId: id,
            userId: user?.userId,
            action: 'CONVERTED',
            details: `Lead converted to customer ${customer?.id}`
          }
        });

        await tx.auditLog.create({
          data: {
            userId: user?.userId,
            event: AuthEvent.LEAD_CONVERTED,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: `Lead ${id} converted to customer ${customer?.id}`
          }
        });

        return updatedLead;
      });

      const response: ApiResponse = { success: true, data: result };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to convert lead' });
    }
  }

  static async addLeadNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = (req as any).user;

      if (!content) return res.status(400).json({ success: false, message: 'Content is required' });
      if (!user?.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const result = await prisma.$transaction(async (tx) => {
        const note = await tx.leadNote.create({
          data: {
            leadId: id,
            userId: user.userId,
            content
          }
        });

        await tx.leadActivity.create({
          data: {
            leadId: id,
            userId: user.userId,
            action: 'NOTE_ADDED',
            details: `Note added`
          }
        });

        await tx.auditLog.create({
          data: {
            userId: user.userId,
            event: AuthEvent.LEAD_NOTE_ADDED,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: `Note added to lead ${id}`
          }
        });
        return note;
      });

      const response: ApiResponse = { success: true, data: result };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to add note' });
    }
  }
}
