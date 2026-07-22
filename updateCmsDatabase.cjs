const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function globalizeText(text) {
  if (!text) return text;
  return text
    .replace(/FoneBox Bangladesh/g, 'FoneBox Global')
    .replace(/Bangladeshi/g, 'Global')
    .replace(/Dhaka, Bangladesh/g, 'New York, USA')
    .replace(/Dhaka/g, 'New York');
}

async function main() {
  console.log('Updating Services...');
  const services = await prisma.service.findMany();
  for (const s of services) {
    await prisma.service.update({
      where: { id: s.id },
      data: {
        title: await globalizeText(s.title),
        description: await globalizeText(s.description)
      }
    });
  }

  console.log('Updating Featured Solutions...');
  const featured = await prisma.featuredSolution.findMany();
  for (const f of featured) {
    await prisma.featuredSolution.update({
      where: { id: f.id },
      data: {
        title: await globalizeText(f.title),
        desc: await globalizeText(f.desc)
      }
    });
  }

  console.log('Updating Enterprise Solutions...');
  const enterprise = await prisma.enterpriseSolution.findMany();
  for (const e of enterprise) {
    await prisma.enterpriseSolution.update({
      where: { id: e.id },
      data: {
        title: await globalizeText(e.title),
        desc: await globalizeText(e.desc),
        useCases: await globalizeText(e.useCases),
        benefits: await globalizeText(e.benefits),
        industries: await globalizeText(e.industries),
        flow: await globalizeText(e.flow)
      }
    });
  }

  console.log('CMS Database fully globalized.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
