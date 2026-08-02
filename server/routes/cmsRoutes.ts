import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'server', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// ==========================================
// SITE SETTINGS (Logo & Favicon)
// ==========================================
router.get('/settings', async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put(
  '/settings',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const logoFile = files['logo']?.[0];
      const faviconFile = files['favicon']?.[0];

      const updateData: any = {};
      if (logoFile) {
        updateData.logoUrl = `/uploads/${logoFile.filename}`;
      }
      if (faviconFile) {
        updateData.faviconUrl = `/uploads/${faviconFile.filename}`;
      }

      let settings = await prisma.siteSettings.findFirst();
      if (settings) {
        settings = await prisma.siteSettings.update({
          where: { id: settings.id },
          data: updateData,
        });
      } else {
        settings = await prisma.siteSettings.create({ data: updateData });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  }
);

// ==========================================
// SYSTEM SETTINGS (Social Links, etc.)
// ==========================================
router.get('/system-settings', async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findMany();
    // Convert to object { key: value }
    const settingsObj = settings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>
    );
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
});

router.put('/system-settings', async (req, res) => {
  try {
    const updates = req.body; // e.g. { linkedinUrl: '...', twitterUrl: '...' }

    // Process each key in the object and upsert
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string') {
        await prisma.systemSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update system settings' });
  }
});

// ==========================================
// SERVICE CARDS
// ==========================================
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.serviceCard.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/services', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const service = await prisma.serviceCard.create({
      data: {
        title,
        description,
        imageUrl,
      },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData: any = { title, description };
    if (imageUrl) updateData.imageUrl = imageUrl;

    const service = await prisma.serviceCard.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await prisma.serviceCard.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ==========================================
// TESTIMONIALS
// ==========================================
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const { author, role, quote, rating } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: {
        author,
        role,
        quote,
        rating: parseInt(rating) || 5,
      },
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const { author, role, quote, rating } = req.body;
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: {
        author,
        role,
        quote,
        rating: parseInt(rating) || 5,
      },
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ==========================================
// FEATURED SOLUTIONS (Homepage)
// ==========================================
router.get('/featured-solutions', async (req, res) => {
  try {
    const solutions = await (prisma as any).featuredSolution.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured solutions' });
  }
});

router.post('/featured-solutions', upload.single('image'), async (req, res) => {
  try {
    const { title, category, desc } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const solution = await (prisma as any).featuredSolution.create({
      data: {
        title,
        category,
        desc,
        imageUrl,
      },
    });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create featured solution' });
  }
});

router.put('/featured-solutions/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, category, desc } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData: any = { title, category, desc };
    if (imageUrl) updateData.imageUrl = imageUrl;

    const solution = await (prisma as any).featuredSolution.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update featured solution' });
  }
});

router.delete('/featured-solutions/:id', async (req, res) => {
  try {
    await (prisma as any).featuredSolution.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete featured solution' });
  }
});

// ==========================================
// ENTERPRISE SOLUTIONS (Solutions Page)
// ==========================================
router.get('/enterprise-solutions', async (req, res) => {
  try {
    const solutions = await (prisma as any).enterpriseSolution.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enterprise solutions' });
  }
});

router.post('/enterprise-solutions', async (req, res) => {
  try {
    const { title, category, desc, useCases, benefits, industries, flow } = req.body;
    const solution = await (prisma as any).enterpriseSolution.create({
      data: { title, category, desc, useCases, benefits, industries, flow },
    });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enterprise solution' });
  }
});

router.put('/enterprise-solutions/:id', async (req, res) => {
  try {
    const { title, category, desc, useCases, benefits, industries, flow } = req.body;
    const solution = await (prisma as any).enterpriseSolution.update({
      where: { id: req.params.id },
      data: { title, category, desc, useCases, benefits, industries, flow },
    });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enterprise solution' });
  }
});

router.delete('/enterprise-solutions/:id', async (req, res) => {
  try {
    await (prisma as any).enterpriseSolution.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enterprise solution' });
  }
});

export default router;
