import { Router } from 'express';
import authRoutes from './auth.route';
import leadsRoutes from './leads.route';

const router = Router();

// Define v1 routes here
router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
// router.use('/users', userRoutes);

export default router;
