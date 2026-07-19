import { Router } from 'express';
import authRoutes from './auth.route';
import leadsRoutes from './leads.route';
import crmRoutes from './crm.route';
import customersRoutes from './customers.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/crm', crmRoutes);
router.use('/customers', customersRoutes);

export default router;
