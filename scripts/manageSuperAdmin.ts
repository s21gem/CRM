import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const prisma = new PrismaClient();

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .command('create', 'Create a new SUPER_ADMIN user', {
      email: { describe: 'User email', type: 'string', demandOption: true },
      password: { describe: 'User password', type: 'string', demandOption: true },
      name: { describe: 'User full name', type: 'string', demandOption: true },
      department: { describe: 'User department', type: 'string', default: 'Global Infrastructure' },
    })
    .command('delete', 'Delete a SUPER_ADMIN user', {
      email: { describe: 'User email to delete', type: 'string', demandOption: true }
    })
    .demandCommand(1, 'You must specify either "create" or "delete"')
    .help()
    .argv;

  const command = argv._[0];

  try {
    if (command === 'create') {
      const existing = await prisma.user.findUnique({ where: { email: argv.email as string } });
      if (existing) {
        console.error(`❌ User with email ${argv.email} already exists.`);
        process.exit(1);
      }

      const hashedPassword = await bcrypt.hash(argv.password as string, 10);
      const user = await prisma.user.create({
        data: {
          email: argv.email as string,
          password: hashedPassword,
          name: argv.name as string,
          role: 'SUPER_ADMIN',
          department: argv.department as string,
          clearance: 'Top Secret',
          status: 'Active'
        }
      });
      console.log(`✅ Successfully created SUPER_ADMIN: ${user.email}`);

    } else if (command === 'delete') {
      const existing = await prisma.user.findUnique({ where: { email: argv.email as string } });
      if (!existing) {
        console.error(`❌ User with email ${argv.email} not found.`);
        process.exit(1);
      }
      if (existing.role !== 'SUPER_ADMIN') {
        console.error(`❌ User is not a SUPER_ADMIN. Use the web dashboard for other roles.`);
        process.exit(1);
      }
      
      await prisma.user.delete({ where: { email: argv.email as string } });
      console.log(`✅ Successfully deleted SUPER_ADMIN: ${existing.email}`);
    }
  } catch (err) {
    console.error('❌ An error occurred:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
