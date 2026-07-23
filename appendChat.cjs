const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

const models = `
model ChatSession {
  id        String   @id @default(uuid())
  guestName String?
  email     String?
  status    String   @default("OPEN") // OPEN, CLOSED
  messages  ChatMessage[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ChatMessage {
  id         String   @id @default(uuid())
  sessionId  String
  session    ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  senderType String   // GUEST, OPS_AGENT
  content    String
  timestamp  String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@index([sessionId])
}
`;

if (!content.includes('model ChatSession')) {
  fs.writeFileSync(schemaPath, content + '\n' + models);
  console.log('Chat models appended.');
} else {
  console.log('Chat models already exist.');
}
