import { Router } from 'express';
import authRoutes from './auth.route';
import leadsRoutes from './leads.route';
import crmRoutes from './crm.route';
import customersRoutes from './customers.route';
import repairsRoutes from './repairs.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/crm', crmRoutes);
router.use('/customers', customersRoutes);
router.use('/repairs', repairsRoutes);

export default router;
