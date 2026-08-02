import { PrismaClient } from '@prisma/client';
import {
  ORGANIZATIONS,
  CONTACTS,
  LEADS,
  OPPORTUNITIES,
  CRM_MEETINGS,
  PROJECTS,
  SUPPORT_CASES,
  INVOICES,
  API_KEYS,
  INITIAL_AUDIT_LOGS,
  ANNOUNCEMENTS,
  KNOWLEDGE_BASE_ARTICLES,
} from '../src/components/portals/portalData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CRM Data...');

  // Organizations
  for (const org of ORGANIZATIONS) {
    await prisma.organization.create({
      data: {
        id: org.id,
        name: org.name,
        sector: org.sector,
        country: org.country,
        securityClearance: org.securityClearance,
        status: org.status,
        assignedManager: org.assignedManager,
        contactCount: org.contactCount,
        totalDealValue: org.totalDealValue,
      },
    });
  }
  console.log('Organizations seeded');

  // Contacts
  for (const contact of CONTACTS) {
    await prisma.contact.create({
      data: {
        id: contact.id,
        name: contact.name,
        title: contact.title,
        organizationId: contact.organizationId,
        orgName: contact.orgName,
        email: contact.email,
        phone: contact.phone,
        clearanceLevel: contact.clearanceLevel,
        status: contact.status,
      },
    });
  }
  console.log('Contacts seeded');

  // Leads
  for (const lead of LEADS) {
    await prisma.lead.create({
      data: {
        id: lead.id,
        companyName: lead.companyName,
        sector: lead.sector,
        country: lead.country,
        contactPerson: lead.contactPerson,
        email: lead.email,
        value: lead.value,
        status: lead.status,
        confidence: lead.confidence,
        source: lead.source,
        createdDate: lead.createdDate,
      },
    });
  }
  console.log('Leads seeded');

  // Opportunities
  for (const opp of OPPORTUNITIES) {
    await prisma.opportunity.create({
      data: {
        id: opp.id,
        title: opp.title,
        orgId: opp.orgId,
        orgName: opp.orgName,
        value: opp.value,
        stage: opp.stage,
        probability: opp.probability,
        closeDate: opp.closeDate,
        leadSource: opp.leadSource,
        lastUpdated: opp.lastUpdated,
      },
    });
  }
  console.log('Opportunities seeded');

  // Meetings
  for (const meeting of CRM_MEETINGS) {
    await prisma.meeting.create({
      data: {
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        orgName: meeting.orgName,
        location: meeting.location,
        status: meeting.status,
        attendees: meeting.attendees.join(', '),
      },
    });
  }
  console.log('Meetings seeded');

  // Projects
  for (const project of PROJECTS) {
    await prisma.project.create({
      data: {
        id: project.id,
        name: project.name,
        orgId: project.orgId,
        orgName: project.orgName,
        category: project.category,
        status: project.status,
        budget: project.budget,
        spent: project.spent,
        startDate: project.startDate,
        targetDate: project.targetDate,
        completionPercentage: project.completionPercentage,
        securityLevel: project.securityLevel,
        milestones: JSON.stringify(project.milestones),
      },
    });
  }
  console.log('Projects seeded');

  // Support Cases
  for (const c of SUPPORT_CASES) {
    await prisma.supportCase.create({
      data: {
        id: c.id,
        title: c.title,
        orgName: c.orgName,
        severity: c.severity,
        status: c.status,
        assignedTo: c.assignedTo,
        category: c.category,
        createdDate: c.createdDate,
        updatedDate: c.updatedDate,
      },
    });
  }
  console.log('Support Cases seeded');

  // Invoices
  for (const inv of INVOICES) {
    await prisma.invoice.create({
      data: {
        id: inv.id,
        orgName: inv.orgName,
        projectName: inv.projectName,
        amount: inv.amount,
        issuedDate: inv.issuedDate,
        dueDate: inv.dueDate,
        status: inv.status,
        paymentMethod: inv.paymentMethod,
        transactionHash: inv.transactionHash,
      },
    });
  }
  console.log('Invoices seeded');

  // API Keys
  for (const key of API_KEYS) {
    await prisma.apiKey.create({
      data: {
        id: key.id,
        name: key.name,
        tokenPreview: key.tokenPreview,
        role: key.role,
        status: key.status,
        createdDate: key.createdDate,
        expiryDate: key.expiryDate,
        callsCount: key.callsCount,
      },
    });
  }
  console.log('API Keys seeded');

  // Audit Logs
  for (const log of INITIAL_AUDIT_LOGS) {
    await prisma.systemAuditLog.create({
      data: {
        id: log.id,
        timestamp: log.timestamp,
        actor: log.actor,
        action: log.action,
        status: log.status,
        payload: log.payload,
      },
    });
  }
  console.log('Audit Logs seeded');

  // Announcements
  for (const ann of ANNOUNCEMENTS) {
    await prisma.announcement.create({
      data: {
        id: ann.id,
        title: ann.title,
        date: ann.date,
        category: ann.category,
        content: ann.content,
      },
    });
  }
  console.log('Announcements seeded');

  // Knowledge Base
  for (const kb of KNOWLEDGE_BASE_ARTICLES) {
    await prisma.knowledgeBaseArticle.create({
      data: {
        id: kb.id,
        title: kb.title,
        category: kb.category,
        rating: kb.rating,
        views: kb.views,
      },
    });
  }
  console.log('Knowledge Base seeded');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
