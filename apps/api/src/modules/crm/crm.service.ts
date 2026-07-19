import { PrismaClient, AuthEvent, LeadStatus, CustomerType } from '@prisma/client';
import { CustomersService } from '../customers/customers.service';

const prisma = new PrismaClient();

export class CrmService {
  static async changeLeadStatus(id: string, status: LeadStatus, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({
        where: { id },
        data: { status }
      });

      await tx.leadActivity.create({
        data: {
          leadId: id,
          userId,
          action: 'STATUS_CHANGED',
          details: `Status changed to ${status}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.LEAD_STATUS_CHANGED,
          ipAddress: ip,
          userAgent,
          details: `Lead ${id} status changed to ${status}`
        }
      });

      return lead;
    });
  }

  static async assignLead(id: string, assigneeId: string, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({
        where: { id },
        data: { assignedTo: assigneeId }
      });

      await tx.leadActivity.create({
        data: {
          leadId: id,
          userId,
          action: 'ASSIGNED',
          details: `Assigned to user ${assigneeId}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.LEAD_ASSIGNED,
          ipAddress: ip,
          userAgent,
          details: `Lead ${id} assigned to ${assigneeId}`
        }
      });

      return lead;
    });
  }

  static async convertLead(id: string, userId: string, ip: string, userAgent: string | undefined) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new Error('Lead not found');

    return prisma.$transaction(async (tx) => {
      let customer;
      if (lead.customerId) {
        customer = await tx.customer.findUnique({ where: { id: lead.customerId } });
      } else {
        customer = await tx.customer.findFirst({
          where: {
            OR: [
              { email: lead.email },
              { phone: lead.phone }
            ]
          }
        });
      }

      if (!customer) {
        // Use standardized sequence generation
        const sequenceId = 'CUSTOMER';
        let seq = await tx.sequence.findUnique({ where: { id: sequenceId } });
        if (!seq) {
          seq = await tx.sequence.create({ data: { id: sequenceId, value: 1 } });
        } else {
          seq = await tx.sequence.update({
            where: { id: sequenceId },
            data: { value: { increment: 1 } }
          });
        }
        const customerNumber = `FBXC-${seq.value.toString().padStart(6, '0')}`;

        customer = await tx.customer.create({
          data: {
            customerNumber,
            type: lead.type === 'BUSINESS_CONSULTATION' ? CustomerType.BUSINESS : CustomerType.INDIVIDUAL,
            firstName: lead.firstName,
            lastName: lead.lastName,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
          }
        });

        await tx.customerActivity.create({
          data: {
            customerId: customer.id,
            userId,
            action: 'CREATED',
            description: 'Customer created from Lead conversion'
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
          userId,
          action: 'CONVERTED',
          details: `Lead converted to customer ${customer?.id}`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.LEAD_CONVERTED,
          ipAddress: ip,
          userAgent,
          details: `Lead ${id} converted to customer ${customer?.id}`
        }
      });

      return updatedLead;
    });
  }

  static async addLeadNote(id: string, content: string, userId: string, ip: string, userAgent: string | undefined) {
    return prisma.$transaction(async (tx) => {
      const note = await tx.leadNote.create({
        data: {
          leadId: id,
          userId,
          content
        }
      });

      await tx.leadActivity.create({
        data: {
          leadId: id,
          userId,
          action: 'NOTE_ADDED',
          details: `Note added`
        }
      });

      await tx.auditLog.create({
        data: {
          userId,
          event: AuthEvent.LEAD_NOTE_ADDED,
          ipAddress: ip,
          userAgent,
          details: `Note added to lead ${id}`
        }
      });
      return note;
    });
  }
}
