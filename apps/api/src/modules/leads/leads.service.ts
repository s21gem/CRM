import { PrismaClient, Lead, LeadType } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const leadSchema = z.object({
  type: z.nativeEnum(LeadType),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().min(5),
  email: z.string().email(),
  deviceType: z.string().optional(),
  serviceRequested: z.string().optional(),
  message: z.string().optional(),
  consentAccepted: z.boolean().default(false),
  source: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export class LeadsService {
  /**
   * Concurrency-safe generation of reference numbers (FBX-YYYY-000001)
   */
  private static async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const sequenceKey = `LEAD_${year}`;

    // Upsert atomic increment
    const sequence = await prisma.sequence.upsert({
      where: { id: sequenceKey },
      update: { value: { increment: 1 } },
      create: { id: sequenceKey, value: 1 },
    });

    const paddedNumber = sequence.value.toString().padStart(6, '0');
    return `FBX-${year}-${paddedNumber}`;
  }

  static async createLead(data: z.infer<typeof leadSchema>): Promise<Lead> {
    const referenceNumber = await this.generateReferenceNumber();

    const consentAcceptedAt = data.consentAccepted ? new Date() : null;

    return prisma.lead.create({
      data: {
        referenceNumber,
        type: data.type,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        phone: data.phone,
        email: data.email,
        deviceType: data.deviceType,
        serviceRequested: data.serviceRequested,
        message: data.message,
        consentAccepted: data.consentAccepted,
        consentAcceptedAt,
        referrer: data.referrer,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
    });
  }
}
