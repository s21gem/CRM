import { Router } from 'express';
import authRoutes from './auth.route';
import leadsRoutes from './leads.route';
import crmRoutes from './crm.route';

const router = Router();

// Define v1 routes here
router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/crm', crmRoutes);
// router.use('/users', userRoutes);

export default router;
