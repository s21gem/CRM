const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'index.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const seedLogic = `
const seedEnterpriseSolutions = async () => {
  try {
    const count = await (prisma as any).enterpriseSolution.count();
    if (count === 0) {
      const enterpriseSolutions = [
        {
          title: 'Electronic Passports (e-Passports)',
          category: 'Government Security',
          desc: 'National scale identity personalization and high-security chip programming conforming to ICAO Doc 9303 standards. Polycarbonate datasheets with Active & Passive chip authorization.',
          useCases: JSON.stringify(['Immigration checkpoints', 'Airport security gates', 'Diplomatic clearance', 'Consulate applications']),
          benefits: JSON.stringify(['100% clone proof smart RFID chip configuration', 'Under 3-second clearance timelines at secure e-Gates', 'Polycarbonate fusing prevents physical counterfeits']),
          industries: JSON.stringify(['Government', 'Immigration', 'Defense']),
          flow: JSON.stringify([
            { title: 'Biometric Enrollment', desc: 'Face & fingerprints captured via ISO/IEC 19794 compliance scanners.' },
            { title: 'Deduplication Vetting', desc: '1:N biometric search inside secure central civilian databases.' },
            { title: 'LDS Cryptography signing', desc: 'Logical Data Structure signed with CSCA Country Root Key in FIPS 140-3 HSM.' },
            { title: 'Polycarbonate Laser Flash', desc: 'Laser engrave data-page & flash Smart chip simultaneously.' }
          ])
        },
        {
          title: 'Secure EMV Payment Cards',
          category: 'FinTech Customization',
          desc: 'High-speed payment card (EMV) customization pipelines. Features secure derived key exchange, contactless chip programming, and physical custom design personalizations.',
          useCases: JSON.stringify(['Retail customer banking', 'Central bank reserves', 'Corporate high-balance cards', 'Government funding disbursals']),
          benefits: JSON.stringify(['Derived EMV master keys (MDK, UDK) secure injection', 'PCI-DSS 4.0 certified localized vaults', 'Contactless smartcard dual-interface security']),
          industries: JSON.stringify(['Banking', 'Finance', 'Enterprise']),
          flow: JSON.stringify([
            { title: 'PGP Encrypted ingest', desc: 'Bank cardholder parameters ingested over dedicated secure IPSec tunnel.' },
            { title: 'Key derivation', desc: 'NIST derived master parameters mapped via dedicated HSM engines.' },
            { title: 'Electrical injection', desc: 'Chip applets configured & EMV keys injected into smart processor.' },
            { title: 'Visual customization', desc: 'Laser emboss metallic safety numbers and apply branding foils.' }
          ])
        },
        {
          title: 'Electronic Visa Systems (e-Visa)',
          category: 'Borders & Consular',
          desc: 'Sovereign end-to-end digital visa application, adjudication workflow, and immediate border integration. Generates digitally signed QR Codes.',
          useCases: JSON.stringify(['Consulate adjudication dashboards', 'Border verification API gateways', 'Consular visa registries']),
          benefits: JSON.stringify(['Consular officers process requests in under 60 seconds', 'Automated watchlist vetting against local and Interpol systems', 'Digital signed tokens cannot be modified or forged']),
          industries: JSON.stringify(['Government', 'Borders', 'Immigration']),
          flow: JSON.stringify([
            { title: 'Application submission', desc: 'Sovereign portal ingests identity documentation and biodata.' },
            { title: 'Watchlist vetting', desc: 'Queries security databases within milliseconds over secure bus.' },
            { title: 'Adjudication audit', desc: 'Consular team reviews parameters and records final decision on log.' },
            { title: 'Secure token issuance', desc: 'Generates digitally signed high-density JWS QR-code.' }
          ])
        }
      ];
      await (prisma as any).enterpriseSolution.createMany({ data: enterpriseSolutions });
      console.log('Seeded Enterprise Solutions.');
    }
  } catch(e) {
    console.error("Seed error (enterprise solutions might not exist yet):", e);
  }
};
`;

content = content.replace("seedUsers();\nseedFeaturedSolutions();", seedLogic + "\nseedUsers();\nseedFeaturedSolutions();\nseedEnterpriseSolutions();");
fs.writeFileSync(filePath, content);
console.log("Seeded backend.");
