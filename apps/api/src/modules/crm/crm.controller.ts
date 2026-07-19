import { Request, Response } from 'express';
import { PrismaClient, AuthEvent, LeadStatus } from '@prisma/client';
import { z } from 'zod';

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

      res.json({ totalLeads, newLeads, convertedLeads, leadsBySource });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
  }

  static async getSalesPipeline(req: Request, res: Response) {
    try {
      const leads = await prisma.lead.findMany({
        where: {
          type: { in: ['QUOTE_REQUEST', 'BUSINESS_CONSULTATION'] }
        },
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true } },
          customer: true,
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(leads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch sales pipeline' });
    }
  }

  static async getServiceQueue(req: Request, res: Response) {
    try {
      const leads = await prisma.lead.findMany({
        where: {
          type: { in: ['REPAIR_REQUEST', 'GENERAL_INQUIRY'] }
        },
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true } },
          customer: true,
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(leads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch service queue' });
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
        return res.status(404).json({ error: 'Lead not found' });
      }
      
      res.json(lead);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch lead details' });
    }
  }

  static async changeLeadStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = (req as any).user;

      if (!Object.values(LeadStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const lead = await prisma.lead.update({
        where: { id },
        data: { status }
      });

      await prisma.leadActivity.create({
        data: {
          leadId: id,
          userId: user?.userId,
          action: 'STATUS_CHANGED',
          details: `Status changed to ${status}`
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: user?.userId,
          event: AuthEvent.LEAD_STATUS_CHANGED,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: `Lead ${id} status changed to ${status}`
        }
      });

      res.json(lead);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to change lead status' });
    }
  }

  static async assignLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { assigneeId } = req.body;
      const user = (req as any).user;

      const lead = await prisma.lead.update({
        where: { id },
        data: { assignedTo: assigneeId }
      });

      await prisma.leadActivity.create({
        data: {
          leadId: id,
          userId: user?.userId,
          action: 'ASSIGNED',
          details: `Assigned to user ${assigneeId}`
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: user?.userId,
          event: AuthEvent.LEAD_ASSIGNED,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: `Lead ${id} assigned to ${assigneeId}`
        }
      });

      res.json(lead);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to assign lead' });
    }
  }

  static async convertLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const lead = await prisma.lead.findUnique({ where: { id } });
      if (!lead) return res.status(404).json({ error: 'Lead not found' });

      // Transaction: create customer if it doesn't exist, update lead
      const result = await prisma.$transaction(async (tx) => {
        let customer;
        if (lead.customerId) {
          customer = await tx.customer.findUnique({ where: { id: lead.customerId } });
        } else {
          // In a real app we might link to an organization, but for now we create a Customer with a dummy org
          // Note: organization is required in schema for Customer, let's find or create a default organization.
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

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to convert lead' });
    }
  }

  static async addLeadNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = (req as any).user;

      if (!content) return res.status(400).json({ error: 'Content is required' });
      if (!user?.userId) return res.status(401).json({ error: 'Unauthorized' });

      const note = await prisma.leadNote.create({
        data: {
          leadId: id,
          userId: user.userId,
          content
        }
      });

      await prisma.leadActivity.create({
        data: {
          leadId: id,
          userId: user.userId,
          action: 'NOTE_ADDED',
          details: `Note added`
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: user.userId,
          event: AuthEvent.LEAD_NOTE_ADDED,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: `Note added to lead ${id}`
        }
      });

      res.json(note);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add note' });
    }
  }
}
