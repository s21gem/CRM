import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('db_dump.json', 'utf8'));
  
  const models = [
    'user', 'consultationRequest', 'supportCase', 'organization', 'contact',
    'lead', 'opportunity', 'meeting', 'project', 'invoice', 'apiKey',
    'systemAuditLog', 'announcement', 'knowledgeBaseArticle', 'siteSettings',
    'serviceCard', 'testimonial', 'featuredSolution', 'enterpriseSolution', 'systemSettings'
  ];

  for (const model of models) {
    if (data[model] && data[model].length > 0) {
      try {
        await (prisma as any)[model].createMany({ data: data[model], skipDuplicates: true });
        console.log(`Restored ${data[model].length} records to ${model}`);
      } catch (e) {
        console.log(`Failed to restore model: ${model} - ${e.message}`);
      }
    }
  }
  console.log('Database restored successfully from db_dump.json');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
