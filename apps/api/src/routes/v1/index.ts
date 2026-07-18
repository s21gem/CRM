import { Router } from 'express';
import authRoutes from './auth.route';

const router = Router();

// Define v1 routes here
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

export default router;
