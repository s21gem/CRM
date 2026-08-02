import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crmRoutes from './routes/crmRoutes';
import cmsRoutes from './routes/cmsRoutes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sendEmail } from './services/emailService';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/authRoutes';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

// Cache System
let redisClient: any = null;
const memoryCache = new Map<string, { value: any; expiry: number }>();

const initRedis = async () => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: false,
      },
    });
    client.on('error', (err) => {
      // Suppress spam if it hasn't connected
      if (!redisClient) return;
      console.warn('Redis error:', err.message);
    });
    await client.connect();
    redisClient = client;
    console.log('Redis connected successfully');
  } catch (err: any) {
    console.warn('Redis connection failed, falling back to memory cache.');
  }
};
initRedis();

export const cacheMiddleware = (durationSecs: number) => {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') return next();
    const key = `__express__${req.originalUrl || req.url}`;
    try {
      if (redisClient) {
        const cached = await redisClient.get(key);
        if (cached) return res.send(JSON.parse(cached));
      } else {
        const cached = memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) return res.send(cached.value);
      }

      const originalSend = res.send.bind(res);
      res.send = (body: any) => {
        if (redisClient) {
          redisClient.setEx(
            key,
            durationSecs,
            typeof body === 'string' ? body : JSON.stringify(body)
          );
        } else {
          memoryCache.set(key, { value: body, expiry: Date.now() + durationSecs * 1000 });
        }
        return originalSend(body);
      };
      next();
    } catch (e) {
      next();
    }
  };
};

export const authMiddleware = (req: any, res: any, next: any) => {
  // Check cookie first, fallback to Authorization header for backward compatibility
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Security and Rate Limiting
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later.' },
});

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
  : true;
app.use(cors({ origin: allowedOrigins, credentials: true })); // Enable cookies cross-origin
app.use(express.json());
app.use(cookieParser());
app.use(compression()); // Optimize API payloads

app.use('/api/', apiLimiter);
app.use('/api/crm', crmRoutes);
app.use('/api/cms', cacheMiddleware(60), cmsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'public', 'uploads')));

// Seed Admin and Demo Users
const seedUsers = async () => {
  const usersToSeed = [
    { email: 'admin', password: 'admin', role: 'SUPER_ADMIN', name: 'System Administrator' },
    { email: 'sales', password: 'sales', role: 'SALES_EXEC', name: 'Sales Executive' },
    { email: 'ops', password: 'ops', role: 'OPERATIONS_OFFICER', name: 'Operations Officer' },
    { email: 'client', password: 'client', role: 'CORPORATE_CLIENT', name: 'Corporate Client' },
  ];

  for (const user of usersToSeed) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: { ...user, password: hashedPassword, role: user.role as any },
      });
      console.log(`User seeded (${user.email}) - Role: ${user.role}`);
    }
  }
};

const seedFeaturedSolutions = async () => {
  try {
    const count = await (prisma as any).featuredSolution.count();
    if (count === 0) {
      const featuredSolutions = [
        {
          title: 'Bangladeshi E-Passports',
          category: 'Government & Sovereignty',
          desc: 'Full polycarbonate structure personalisations featuring high-resolution 1:N AFIS bio-search engines and country-signing cryptographic CAs.',
          imageUrl: '/images/bangladeshi_e_passport_1784515679087.png',
        },
        {
          title: 'High-Security EMV Payment Cards',
          category: 'FinTech & Banking',
          desc: 'PCI-DSS certified smartcard production line configurations, supporting custom metallic foils, security engraving, and dynamic CVV chips.',
          imageUrl: '/images/secure_bank_cards_1784515690421.png',
        },
        {
          title: 'Bangladeshi E-Visa Portals',
          category: 'Immigration & Borders',
          desc: 'Embassy-grade adjudication workflows with automated Interpol database vetting, generating cryptographically signed high-density QR-Codes.',
          imageUrl: '/images/e_visa_platform_1784515701024.png',
        },
        {
          title: 'Cybersecurity Infrastructure',
          category: 'Critical Protection',
          desc: 'Robust cyber security integration protecting critical infrastructures with Zero Trust gateway micro-segmentation.',
          imageUrl: '/images/cybersecurity_infrastructure_1784515711400.png',
        },
      ];
      await (prisma as any).featuredSolution.createMany({ data: featuredSolutions });
      console.log('Seeded Featured Solutions.');
    }
  } catch (e) {
    console.error('Seed error (featured solutions might not exist yet):', e);
  }
};

const seedEnterpriseSolutions = async () => {
  try {
    const count = await (prisma as any).enterpriseSolution.count();
    if (count === 0) {
      const enterpriseSolutions = [
        {
          title: 'Electronic Passports (e-Passports)',
          category: 'Government Security',
          desc: 'National scale identity personalization and high-security chip programming conforming to ICAO Doc 9303 standards. Polycarbonate datasheets with Active & Passive chip authorization.',
          useCases: JSON.stringify([
            'Immigration checkpoints',
            'Airport security gates',
            'Diplomatic clearance',
            'Consulate applications',
          ]),
          benefits: JSON.stringify([
            '100% clone proof smart RFID chip configuration',
            'Under 3-second clearance timelines at secure e-Gates',
            'Polycarbonate fusing prevents physical counterfeits',
          ]),
          industries: JSON.stringify(['Government', 'Immigration', 'Defense']),
          flow: JSON.stringify([
            {
              title: 'Biometric Enrollment',
              desc: 'Face & fingerprints captured via ISO/IEC 19794 compliance scanners.',
            },
            {
              title: 'Deduplication Vetting',
              desc: '1:N biometric search inside secure central civilian databases.',
            },
            {
              title: 'LDS Cryptography signing',
              desc: 'Logical Data Structure signed with CSCA Country Root Key in FIPS 140-3 HSM.',
            },
            {
              title: 'Polycarbonate Laser Flash',
              desc: 'Laser engrave data-page & flash Smart chip simultaneously.',
            },
          ]),
        },
        {
          title: 'Secure EMV Payment Cards',
          category: 'FinTech Customization',
          desc: 'High-speed payment card (EMV) customization pipelines. Features secure derived key exchange, contactless chip programming, and physical custom design personalizations.',
          useCases: JSON.stringify([
            'Retail customer banking',
            'Central bank reserves',
            'Corporate high-balance cards',
            'Government funding disbursals',
          ]),
          benefits: JSON.stringify([
            'Derived EMV master keys (MDK, UDK) secure injection',
            'PCI-DSS 4.0 certified localized vaults',
            'Contactless smartcard dual-interface security',
          ]),
          industries: JSON.stringify(['Banking', 'Finance', 'Enterprise']),
          flow: JSON.stringify([
            {
              title: 'PGP Encrypted ingest',
              desc: 'Bank cardholder parameters ingested over dedicated secure IPSec tunnel.',
            },
            {
              title: 'Key derivation',
              desc: 'NIST derived master parameters mapped via dedicated HSM engines.',
            },
            {
              title: 'Electrical injection',
              desc: 'Chip applets configured & EMV keys injected into smart processor.',
            },
            {
              title: 'Visual customization',
              desc: 'Laser emboss metallic safety numbers and apply branding foils.',
            },
          ]),
        },
        {
          title: 'Electronic Visa Systems (e-Visa)',
          category: 'Borders & Consular',
          desc: 'Sovereign end-to-end digital visa application, adjudication workflow, and immediate border integration. Generates digitally signed QR Codes.',
          useCases: JSON.stringify([
            'Consulate adjudication dashboards',
            'Border verification API gateways',
            'Consular visa registries',
          ]),
          benefits: JSON.stringify([
            'Consular officers process requests in under 60 seconds',
            'Automated watchlist vetting against local and Interpol systems',
            'Digital signed tokens cannot be modified or forged',
          ]),
          industries: JSON.stringify(['Government', 'Borders', 'Immigration']),
          flow: JSON.stringify([
            {
              title: 'Application submission',
              desc: 'Sovereign portal ingests identity documentation and biodata.',
            },
            {
              title: 'Watchlist vetting',
              desc: 'Queries security databases within milliseconds over secure bus.',
            },
            {
              title: 'Adjudication audit',
              desc: 'Consular team reviews parameters and records final decision on log.',
            },
            {
              title: 'Secure token issuance',
              desc: 'Generates digitally signed high-density JWS QR-code.',
            },
          ]),
        },
      ];
      await (prisma as any).enterpriseSolution.createMany({ data: enterpriseSolutions });
      console.log('Seeded Enterprise Solutions.');
    }
  } catch (e) {
    console.error('Seed error (enterprise solutions might not exist yet):', e);
  }
};

seedUsers();
seedFeaturedSolutions();
seedEnterpriseSolutions();

// Auth routes have been refactored to server/routes/authRoutes.ts

// CRM Consultations
app.post('/api/crm/consultations', async (req, res) => {
  try {
    const { name, email, org, tier } = req.body;
    const consultation = await prisma.consultationRequest.create({
      data: { name, email, org, tier },
    });

    // Convert consultation into a sales lead
    await prisma.lead.create({
      data: {
        companyName: org || 'Unknown',
        sector: tier,
        country: 'Global',
        contactPerson: name,
        email: email,
        value: 0,
        status: 'New',
      },
    });

    // Send confirmation email
    try {
      await sendEmail(
        email,
        'Your Fonebox Consultation Briefing Request',
        'Your executive consultation ticket has been registered. A representative will contact you shortly.',
        `<div style="font-family: sans-serif; color: #1e293b;">
          <h2>Consultation Ticket Registered</h2>
          <p>Dear ${name},</p>
          <p>Your executive consultation ticket for <strong>${tier}</strong> has been registered successfully.</p>
          <p>A regional security architect or director of custom integrations will contact you within 12 hours via an encrypted channel.</p>
          <br/>
          <p>Best regards,<br/>Fonebox Operations Team</p>
        </div>`
      );
    } catch (emailErr) {
      console.error('Failed to send consultation email:', emailErr);
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create consultation' });
  }
});

app.get('/api/crm/consultations', authMiddleware, async (req, res) => {
  try {
    const consultations = await prisma.consultationRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// Production Ready Features Endpoints
app.post('/api/crm/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const sub = await (prisma as any).newsletterSubscriber.create({ data: { email } });
    res.json(sub);
  } catch (e) {
    res.status(500).json({ error: 'Subscription failed' });
  }
});

app.post('/api/crm/demo-request', async (req, res) => {
  try {
    const { email, solution, name, org } = req.body;
    const demo = await (prisma as any).demoRequest.create({
      data: { email: email || 'unknown', solution },
    });

    // Convert demo request into a sales lead
    await prisma.lead.create({
      data: {
        companyName: org || 'Demo Requester',
        sector: solution,
        country: 'Global',
        contactPerson: name || 'Pending',
        email: email,
        value: 0,
        status: 'New',
      },
    });

    // Send email notification
    try {
      await sendEmail(
        email,
        'FoneBox Demo Request Confirmation',
        `Thank you for requesting a demo of ${solution}. Our engineering team will contact you shortly.`,
        `<div style="font-family: sans-serif; color: #1e293b;">
          <h2>Demo Request Confirmation</h2>
          <p>Dear ${name || 'Valued Client'},</p>
          <p>Thank you for requesting a technical demo of <strong>${solution}</strong>.</p>
          <p>Our executive engineering board has received your request. A regional solutions architect will establish contact with you shortly via this secure email channel to schedule the session.</p>
          <br/>
          <p>Best regards,<br/>Fonebox Engineering Team</p>
        </div>`
      );
    } catch (emailErr) {
      console.error('Failed to send demo email:', emailErr);
    }

    res.json(demo);
  } catch (e) {
    res.status(500).json({ error: 'Demo request failed' });
  }
});

app.post('/api/crm/security-vetting', async (req, res) => {
  try {
    const { name, company, email } = req.body;
    const vetting = await (prisma as any).securityVettingRequest.create({
      data: { company: company || 'unknown', email: email || 'unknown' },
    });

    // Convert vetting request into a sales lead
    await prisma.lead.create({
      data: {
        companyName: company || 'Security Vetting Requester',
        sector: 'Security Audit',
        country: 'Global',
        contactPerson: name || 'Pending',
        email: email || 'unknown',
        value: 0,
        status: 'New',
      },
    });

    // Send email notification
    try {
      await sendEmail(
        email,
        'FoneBox Security Audit Vetting Request',
        `Thank you for requesting a Security Audit Vetting. Our operations team will contact you shortly.`,
        `<div style="font-family: sans-serif; color: #1e293b;">
          <h2>Security Vetting Request Confirmation</h2>
          <p>Dear ${name || 'Valued Client'},</p>
          <p>Thank you for requesting a sovereign vulnerability vetting for <strong>${company}</strong>.</p>
          <p>Our security operations center (SOC) has logged your request. A security architect will establish contact via an encrypted channel shortly to outline the next steps.</p>
          <br/>
          <p>Best regards,<br/>Fonebox Security Operations</p>
        </div>`
      );
    } catch (emailErr) {
      console.error('Failed to send vetting email:', emailErr);
    }

    res.json(vetting);
  } catch (e) {
    res.status(500).json({ error: 'Vetting request failed' });
  }
});

import multer from 'multer';
const uploadResume = multer({
  dest: path.join(process.cwd(), 'server', 'public', 'uploads', 'resumes'),
});
app.post('/api/crm/job-application', uploadResume.single('resume'), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : '';
    const application = await (prisma as any).jobApplication.create({
      data: { name, email, role, resumeUrl },
    });

    // Send email notification
    await sendEmail(
      email,
      'FoneBox Application Received',
      `Dear ${name},\n\nWe have received your application for the ${role} position. Your resume has been securely stored. Our HR command will review and contact you.`
    );

    res.json(application);
  } catch (e) {
    res.status(500).json({ error: 'Application failed' });
  }
});

// Portals data
app.get('/api/portals/stats', async (req, res) => {
  try {
    const totalConsultations = await prisma.consultationRequest.count();
    const pendingConsultations = await prisma.consultationRequest.count({
      where: { status: 'PENDING' },
    });
    const totalUsers = await prisma.user.count();

    res.json({
      totalConsultations,
      pendingConsultations,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health Check for Load Balancers (Traefik/Nginx)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`[SYS] Server running on port ${PORT}`);
});

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('[SOCKET] Client connected:', socket.id);

  socket.on('join_session', (sessionId) => {
    socket.join(sessionId);
    console.log(`[SOCKET] ${socket.id} joined session ${sessionId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { sessionId, content, senderType } = data;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const message = await prisma.chatMessage.create({
        data: {
          sessionId,
          content,
          senderType,
          timestamp,
        },
      });

      // Broadcast to room
      io.to(sessionId).emit('receive_message', message);

      // Also notify operations team globally if they are in the 'operations_room'
      io.to('operations_room').emit('new_chat_message', { sessionId, message });
    } catch (e) {
      console.error('[SOCKET] Error sending message:', e);
    }
  });

  socket.on('join_ops_room', () => {
    socket.join('operations_room');
    console.log(`[SOCKET] Ops agent ${socket.id} joined operations_room`);
  });

  socket.on('disconnect', () => {
    console.log('[SOCKET] Client disconnected:', socket.id);
  });
});

// Graceful Shutdown Handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[SYS] Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('[SYS] HTTP server closed.');
    await prisma.$disconnect();
    console.log('[SYS] Prisma database connections closed.');
    if (redisClient) {
      await redisClient.quit();
      console.log('[SYS] Redis connection closed.');
    }
    console.log('[SYS] Shutdown complete.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
