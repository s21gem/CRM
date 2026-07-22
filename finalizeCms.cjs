const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, 'server', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function globalizeText(text) {
  if (!text) return text;
  return text
    .replace(/FoneBox Bangladesh/g, 'FoneBox Global')
    .replace(/Bangladeshi/g, 'Global')
    .replace(/Dhaka, Bangladesh/g, 'New York, USA')
    .replace(/Dhaka/g, 'New York');
}

async function main() {
  console.log('Copying images...');
  
  // Hardcoded paths to generated images from artifacts
  const artifactsDir = path.join('C:', 'Users', 'hp', '.gemini', 'antigravity-ide', 'brain', '1a2704ca-5536-4c1b-8e65-c111679a1bf9');
  const img1 = path.join(artifactsDir, 'global_datacenter_1784666623961.png');
  const img2 = path.join(artifactsDir, 'biometric_security_1784666638468.png');
  const img3 = path.join(artifactsDir, 'cyber_command_center_1784666653840.png');
  
  const dest1 = path.join(uploadDir, 'global_datacenter.png');
  const dest2 = path.join(uploadDir, 'biometric_security.png');
  const dest3 = path.join(uploadDir, 'cyber_command_center.png');

  if (fs.existsSync(img1)) fs.copyFileSync(img1, dest1);
  if (fs.existsSync(img2)) fs.copyFileSync(img2, dest2);
  if (fs.existsSync(img3)) fs.copyFileSync(img3, dest3);

  const images = [
    '/uploads/global_datacenter.png',
    '/uploads/biometric_security.png',
    '/uploads/cyber_command_center.png'
  ];

  console.log('Updating Featured Solutions...');
  const featured = await prisma.featuredSolution.findMany({ orderBy: { createdAt: 'asc' } });
  for (let i = 0; i < featured.length; i++) {
    const f = featured[i];
    await prisma.featuredSolution.update({
      where: { id: f.id },
      data: {
        title: await globalizeText(f.title),
        desc: await globalizeText(f.desc),
        imageUrl: images[i] || f.imageUrl // Apply images to first 3
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

  console.log('CMS Database fully globalized and images attached.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
