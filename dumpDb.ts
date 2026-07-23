import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data: any = {};
  
  const models = [
    'user', 'consultationRequest', 'supportCase', 'organization', 'contact',
    'lead', 'opportunity', 'meeting', 'project', 'invoice', 'apiKey',
    'systemAuditLog', 'announcement', 'knowledgeBaseArticle', 'siteSettings',
    'serviceCard', 'testimonial', 'featuredSolution', 'enterpriseSolution', 'systemSettings'
  ];

  for (const model of models) {
    try {
      data[model] = await (prisma as any)[model].findMany();
      console.log(`Dumped ${data[model].length} records from ${model}`);
    } catch (e) {
      console.log(`Failed to dump model: ${model} - ${e.message}`);
    }
  }
  
  fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
  console.log('Database dumped successfully to db_dump.json');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
