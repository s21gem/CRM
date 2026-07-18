import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');

  // Roles are defined in the Prisma Enum (SUPER_ADMIN, ADMIN, etc.)
  
  // Seed permissions
  const permissions = [
    { action: 'read', resource: 'crm' },
    { action: 'create', resource: 'crm' },
    { action: 'update', resource: 'crm' },
    { action: 'delete', resource: 'crm' },
    { action: 'read', resource: 'customer' },
    { action: 'update', resource: 'customer' },
    { action: 'read', resource: 'project' },
    { action: 'update', resource: 'project' },
    { action: 'manage', resource: 'admin' },
    { action: 'manage', resource: 'user' },
    { action: 'manage', resource: 'settings' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { id: `${p.action}-${p.resource}` },
      update: {},
      create: {
        id: `${p.action}-${p.resource}`,
        action: p.action,
        resource: p.resource,
        description: `Can ${p.action} ${p.resource}`
      }
    });
  }

  // Seed users
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUsers = [
    { email: 'superadmin@fonebox.local', firstName: 'Super', lastName: 'Admin', role: Role.SUPER_ADMIN },
    { email: 'admin@fonebox.local', firstName: 'System', lastName: 'Admin', role: Role.ADMIN },
    { email: 'crm@fonebox.local', firstName: 'CRM', lastName: 'Manager', role: Role.CRM_MANAGER },
    { email: 'sales@fonebox.local', firstName: 'Sales', lastName: 'Rep', role: Role.SALES },
    { email: 'support@fonebox.local', firstName: 'Support', lastName: 'Agent', role: Role.SUPPORT },
    { email: 'engineer@fonebox.local', firstName: 'Systems', lastName: 'Engineer', role: Role.ENGINEER },
    { email: 'customer@fonebox.local', firstName: 'Valued', lastName: 'Customer', role: Role.CUSTOMER },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash, role: u.role },
      create: {
        email: u.email,
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        isActive: true,
      }
    });
  }

  console.log('Seeding complete! Default password for all users is: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
