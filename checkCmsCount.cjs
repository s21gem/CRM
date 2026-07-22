const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Services:', await prisma.serviceCard.count());
  console.log('Featured:', await prisma.featuredSolution.count());
  console.log('Enterprise:', await prisma.enterpriseSolution.count());
}

main().catch(console.error).finally(() => prisma.$disconnect());
