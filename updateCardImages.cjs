const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, 'server', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function main() {
  console.log('Copying specific images...');
  
  const artifactsDir = path.join('C:', 'Users', 'hp', '.gemini', 'antigravity-ide', 'brain', '1a2704ca-5536-4c1b-8e65-c111679a1bf9');
  
  // Find latest generated images for each category based on prefix
  const files = fs.readdirSync(artifactsDir);
  const findLatest = (prefix) => {
    const matches = files.filter(f => f.startsWith(prefix) && f.endsWith('.png'));
    matches.sort(); // Last one will be the latest generated
    return matches.length > 0 ? path.join(artifactsDir, matches[matches.length - 1]) : null;
  };

  const imgEPassport = findLatest('epassport_tech');
  const imgEmv = findLatest('emv_smartcard');
  const imgEvisa = findLatest('evisa_portal');
  const imgCyber = findLatest('cyber_command_center');

  const destEPassport = path.join(uploadDir, 'epassport_tech.png');
  const destEmv = path.join(uploadDir, 'emv_smartcard.png');
  const destEvisa = path.join(uploadDir, 'evisa_portal.png');
  const destCyber = path.join(uploadDir, 'cyber_command_center.png');

  if (imgEPassport) fs.copyFileSync(imgEPassport, destEPassport);
  if (imgEmv) fs.copyFileSync(imgEmv, destEmv);
  if (imgEvisa) fs.copyFileSync(imgEvisa, destEvisa);
  if (imgCyber) fs.copyFileSync(imgCyber, destCyber);

  const imageMap = {
    'Global E-Passports': '/uploads/epassport_tech.png',
    'High-Security EMV Payment Cards': '/uploads/emv_smartcard.png',
    'Global E-Visa Portals': '/uploads/evisa_portal.png',
    'Cybersecurity Infrastructure': '/uploads/cyber_command_center.png'
  };

  console.log('Updating Featured Solutions with mapped images...');
  const featured = await prisma.featuredSolution.findMany();
  for (const f of featured) {
    const newImage = imageMap[f.title];
    if (newImage) {
      await prisma.featuredSolution.update({
        where: { id: f.id },
        data: { imageUrl: newImage }
      });
      console.log(`Updated ${f.title} with ${newImage}`);
    } else {
      console.log(`No image mapped for ${f.title}`);
    }
  }

  console.log('CMS specific images fully updated.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
