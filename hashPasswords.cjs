const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (!user.password.startsWith('$2a$')) { // not hashed
      console.log(`Hashing password for ${user.email}`);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { email: user.email },
        data: { password: hashedPassword }
      });
    }
  }
  console.log("All passwords hashed.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
