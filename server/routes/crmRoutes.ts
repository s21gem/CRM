import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/emailService';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

// ==========================================
// USERS (Super Admin)
// ==========================================
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ 
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        clearance: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
        // Specifically excluding password
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', async (req: any, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch(e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Only SUPER_ADMIN can create users directly via this endpoint
    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Requires SUPER_ADMIN role' });
    }

    const { email, password, name, role, department, clearance, status, sendEmailCredentials } = req.body;

    // RULE 3: Block web UI creation of SUPER_ADMIN
    if (role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Super Admins can only be provisioned via secure terminal CLI.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CUSTOMER',
        department,
        clearance,
        status: status || 'Active'
      }
    });
    
    // Add audit log for user creation
    await prisma.systemAuditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        actor: req.user.email || 'System',
        action: 'USER_PROVISION',
        status: 'SUCCESS',
        payload: `Provisioned new user: ${email} with role ${role}`
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;

    // Send credentials email if requested
    if (sendEmailCredentials) {
      const emailHtml = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2>Welcome to Fonebox Sovereign Ecosystem</h2>
          <p>Dear ${name || 'Client'},</p>
          <p>Your secure Corporate Portal account has been provisioned.</p>
          <p><strong>Login URL:</strong> <a href="http://localhost:5173">http://localhost:5173</a></p>
          <p><strong>Username:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p>Please log in and update your security settings immediately.</p>
          <br/>
          <p>Best regards,<br/>Fonebox Operations Team</p>
        </div>
      `;
      try {
        await sendEmail(
          email,
          'Your Fonebox Portal Credentials',
          `Your login is ${email} and your temporary password is ${password}.`,
          emailHtml
        );
      } catch (emailErr) {
        console.error('Failed to send credentials email:', emailErr);
      }
    }

    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/users/me/credentials', async (req: any, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch(e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = (decoded as any).userId;
    const { email, password } = req.body;

    const dataToUpdate: any = {};
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    });

    res.json({ success: true, user: { id: updatedUser.id, email: updatedUser.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

router.delete('/users/:id', async (req: any, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch(e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Requires SUPER_ADMIN role' });
    }

    const { id } = req.params;
    
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent self-deletion if needed (optional safety measure)
    if (user.email === req.user.email) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // RULE 2: Horizontal Shield - Block deletion of fellow Super Admins
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Cannot revoke another Super Admin via the web interface.' });
    }

    await prisma.user.delete({ where: { id } });
    
    // Log the deletion
    await prisma.systemAuditLog.create({
      data: {
        timestamp: new Date().toISOString(),
        actor: req.user.email || 'System',
        action: 'USER_REVOCATION',
        status: 'SUCCESS',
        payload: `Revoked access and deleted user: ${user.email} (${id})`
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ==========================================
// ORGANIZATIONS
// ==========================================
router.get('/organizations', async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

router.post('/organizations', async (req, res) => {
  try {
    const org = await prisma.organization.create({ data: req.body });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

router.put('/organizations/:id', async (req, res) => {
  try {
    const org = await prisma.organization.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

router.delete('/organizations/:id', async (req, res) => {
  try {
    await prisma.organization.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

// ==========================================
// LEADS
// ==========================================
router.get('/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

router.post('/leads', async (req, res) => {
  try {
    const lead = await prisma.lead.create({ data: req.body });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

router.put('/leads/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// ==========================================
// OPPORTUNITIES
// ==========================================
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = await prisma.opportunity.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

router.post('/opportunities', async (req, res) => {
  try {
    const opportunity = await prisma.opportunity.create({ data: req.body });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
});

router.put('/opportunities/:id', async (req, res) => {
  try {
    const opportunity = await prisma.opportunity.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update opportunity' });
  }
});

router.delete('/opportunities/:id', async (req, res) => {
  try {
    await prisma.opportunity.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
});

// ==========================================
// MEETINGS
// ==========================================
router.get('/meetings', async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

router.post('/meetings', async (req, res) => {
  try {
    const meeting = await prisma.meeting.create({ data: req.body });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

router.put('/meetings/:id', async (req, res) => {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
});

router.delete('/meetings/:id', async (req, res) => {
  try {
    await prisma.meeting.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
});

// ==========================================
// SUPPORT CASES
// ==========================================
router.get('/cases', async (req, res) => {
  try {
    const cases = await prisma.supportCase.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

router.post('/cases', async (req, res) => {
  try {
    const newCase = await prisma.supportCase.create({ data: req.body });
    res.json(newCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create case' });
  }
});

router.put('/cases/:id', async (req, res) => {
  try {
    const updatedCase = await prisma.supportCase.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update case' });
  }
});

// ==========================================
// PROJECTS
// ==========================================
router.get('/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// ==========================================
// CONTACTS
// ==========================================
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.post('/contacts', async (req, res) => {
  try {
    const contact = await prisma.contact.create({ data: req.body });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

router.put('/contacts/:id', async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// ==========================================
// INVOICES
// ==========================================
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const { clientEmail, ...invoiceData } = req.body;
    const invoice = await prisma.invoice.create({ data: invoiceData });
    
    // Attempt to send email notification
    try {
      const emailHtml = `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2>New Invoice Issued: ${invoice.projectName || 'Enterprise ICT Service'}</h2>
          <p>Dear ${invoice.orgName || 'Client'},</p>
          <p>A new invoice for <strong>$${invoice.amount.toLocaleString()}</strong> has been issued to your organization.</p>
          <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
          <p>Please log in to the Fonebox Sovereign Ecosystem Client Portal to view the secure invoice and complete the payment.</p>
          <br/>
          <p>Best regards,<br/>Fonebox Finance Team</p>
        </div>
      `;
      // Send to a generic address for demonstration, or extract client email if stored
      await sendEmail(
        clientEmail || 'client@example.com', 
        `New Fonebox Invoice: ${invoice.projectName || 'Service Fees'}`, 
        `A new invoice for $${invoice.amount} has been issued. Due: ${invoice.dueDate}.`, 
        emailHtml
      );
    } catch (emailErr) {
      console.error('Failed to send invoice email:', emailErr);
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/invoices/:id', async (req, res) => {
  try {
    const { clientEmail, ...invoiceData } = req.body;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: invoiceData,
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  try {
    await prisma.invoice.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// ==========================================
// API KEYS
// ==========================================
router.get('/apikeys', async (req, res) => {
  try {
    const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

router.post('/apikeys', async (req, res) => {
  try {
    const key = await prisma.apiKey.create({ data: req.body });
    res.json(key);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

router.put('/apikeys/:id', async (req, res) => {
  try {
    const key = await prisma.apiKey.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(key);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update API key' });
  }
});

// ==========================================
// AUDIT LOGS
// ==========================================
router.get('/auditlogs', async (req, res) => {
  try {
    const logs = await prisma.systemAuditLog.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

router.post('/auditlogs', async (req, res) => {
  try {
    const log = await prisma.systemAuditLog.create({ data: req.body });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit log' });
  }
});

router.put('/auditlogs/:id', async (req, res) => {
  try {
    const log = await prisma.systemAuditLog.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update audit log' });
  }
});

// ==========================================
// ANNOUNCEMENTS
// ==========================================
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// ==========================================
// KNOWLEDGE BASE
// ==========================================
router.get('/knowledgebase', async (req, res) => {
  try {
    const articles = await prisma.knowledgeBaseArticle.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KB articles' });
  }
});

// ==========================================
// SUPPORT CASES & PAYMENTS (Production Ready)
// ==========================================
router.get('/support-cases', async (req, res) => {
  try {
    const cases = await prisma.supportCase.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch support cases' });
  }
});

router.post('/support-cases', async (req, res) => {
  try {
    const caseData = await prisma.supportCase.create({ data: req.body });
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create support case' });
  }
});

// ==========================================
// INVOICES & PAYMENTS
// ==========================================
router.post('/invoices/:id/pay', async (req, res) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { status: 'Paid' }
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// ==========================================
// PAYMENT GATEWAY SETTINGS
// ==========================================
router.get('/payment-settings', async (req, res) => {
  try {
    let settings = await prisma.paymentGatewaySettings.findFirst();
    if (!settings) {
      settings = await prisma.paymentGatewaySettings.create({
        data: {
          provider: 'stripe',
          publicKey: '',
          secretKey: '',
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment settings' });
  }
});

router.put('/payment-settings', async (req, res) => {
  try {
    const { id, provider, publicKey, secretKey, webhookSecret, isActive } = req.body;
    const settings = await prisma.paymentGatewaySettings.update({
      where: { id },
      data: { provider, publicKey, secretKey, webhookSecret, isActive }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment settings' });
  }
});

export default router;
