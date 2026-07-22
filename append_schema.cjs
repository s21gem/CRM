const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');

const modelsToAppend = `
model Organization {
  id                String   @id @default(uuid())
  name              String
  sector            String
  country           String
  securityClearance String
  status            String
  assignedManager   String
  contactCount      Int
  totalDealValue    Float
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Contact {
  id             String   @id @default(uuid())
  name           String
  title          String
  organizationId String
  orgName        String
  email          String
  phone          String
  clearanceLevel String
  status         String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Lead {
  id            String   @id @default(uuid())
  companyName   String
  sector        String
  country       String
  contactPerson String
  email         String
  value         Float
  status        String
  confidence    Float
  source        String
  createdDate   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Opportunity {
  id          String   @id @default(uuid())
  title       String
  orgId       String
  orgName     String
  value       Float
  stage       String
  probability Float
  closeDate   String
  leadSource  String
  lastUpdated String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Meeting {
  id        String   @id @default(uuid())
  title     String
  date      String
  time      String
  orgName   String
  location  String
  status    String
  attendees String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

fs.appendFileSync(schemaPath, modelsToAppend);
console.log('Appended models to schema.prisma');
