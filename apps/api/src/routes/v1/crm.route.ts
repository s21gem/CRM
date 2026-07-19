import { Router } from 'express';
import { CRMController } from '../../modules/crm/crm.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all CRM routes
router.use(authenticate);
router.use(requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES, Role.SUPPORT]));

// Dashboard
router.get('/dashboard', CRMController.getDashboardMetrics);

// Workflows
router.get('/sales-pipeline', CRMController.getSalesPipeline);
router.get('/service-queue', CRMController.getServiceQueue);

// Lead Operations
router.get('/leads/:id', CRMController.getLeadDetails);
router.patch('/leads/:id/status', CRMController.changeLeadStatus);
router.patch('/leads/:id/assign', CRMController.assignLead);
router.post('/leads/:id/convert', CRMController.convertLead);
router.post('/leads/:id/notes', CRMController.addLeadNote);

export default router;
