import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seedAll = async () => {
  console.log("Seeding database...");
  
  // Seed Users
  const usersToSeed = [
    { email: 'admin', password: 'admin', role: 'SUPER_ADMIN', name: 'System Administrator' },
    { email: 'sales', password: 'sales', role: 'SALES_EXEC', name: 'Sales Executive' },
    { email: 'ops', password: 'ops', role: 'OPERATIONS_OFFICER', name: 'Operations Officer' },
    { email: 'client', password: 'client', role: 'CORPORATE_CLIENT', name: 'Corporate Client' }
  ];

  for (const user of usersToSeed) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({ data: { ...user, password: hashedPassword, role: user.role as any } });
      console.log(`User seeded (${user.email})`);
    }
  }

  // Seed Featured Solutions
  const fsCount = await prisma.featuredSolution.count();
  if (fsCount === 0) {
    const featuredSolutions = [
      { title: 'Bangladeshi E-Passports', category: 'Government & Sovereignty', desc: 'Full polycarbonate structure personalisations featuring high-resolution 1:N AFIS bio-search engines and country-signing cryptographic CAs.', imageUrl: '/images/bangladeshi_e_passport_1784515679087.png' },
      { title: 'High-Security EMV Payment Cards', category: 'FinTech & Banking', desc: 'PCI-DSS certified smartcard production line configurations, supporting custom metallic foils, security engraving, and dynamic CVV chips.', imageUrl: '/images/secure_bank_cards_1784515690421.png' },
      { title: 'Bangladeshi E-Visa Portals', category: 'Immigration & Borders', desc: 'Embassy-grade adjudication workflows with automated Interpol database vetting, generating cryptographically signed high-density QR-Codes.', imageUrl: '/images/e_visa_platform_1784515701024.png' },
      { title: 'Cybersecurity Infrastructure', category: 'Critical Protection', desc: 'Robust cyber security integration protecting critical infrastructures with Zero Trust gateway micro-segmentation.', imageUrl: '/images/cybersecurity_infrastructure_1784515711400.png' }
    ];
    await prisma.featuredSolution.createMany({ data: featuredSolutions });
    console.log('Seeded Featured Solutions.');
  }

  // Seed Enterprise Solutions
  const esCount = await prisma.enterpriseSolution.count();
  if (esCount === 0) {
    const enterpriseSolutions = [
      { title: 'Electronic Passports (e-Passports)', category: 'Government Security', desc: 'National scale identity personalization.', useCases: JSON.stringify(['Immigration checkpoints']), benefits: JSON.stringify(['100% clone proof']), industries: JSON.stringify(['Government']), flow: JSON.stringify([{title: 'Biometric Enrollment', desc: 'Face & fingerprints'}]) },
      { title: 'Secure EMV Payment Cards', category: 'FinTech Customization', desc: 'High-speed payment card customization.', useCases: JSON.stringify(['Retail customer banking']), benefits: JSON.stringify(['Derived EMV master keys']), industries: JSON.stringify(['Banking']), flow: JSON.stringify([{title: 'PGP Encrypted ingest', desc: 'Bank cardholder parameters'}]) }
    ];
    await prisma.enterpriseSolution.createMany({ data: enterpriseSolutions });
    console.log('Seeded Enterprise Solutions.');
  }

  console.log("Done seeding!");
};

seedAll().catch(console.error).finally(() => prisma.$disconnect());
