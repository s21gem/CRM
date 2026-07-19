import { Router } from 'express';
import { CRMController } from '../../modules/crm/crm.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all CRM routes with authentication
router.use(authenticate);

// Granular RBAC definitions
const anyCrmRole = requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES, Role.SUPPORT]);
const salesRole = requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES]);
const supportRole = requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT]);

// Dashboard (Available to any CRM user)
router.get('/dashboard', anyCrmRole, CRMController.getDashboardMetrics);

// Workflows
router.get('/sales-pipeline', salesRole, CRMController.getSalesPipeline);
router.get('/service-queue', supportRole, CRMController.getServiceQueue);

// Lead Operations
router.get('/leads/:id', anyCrmRole, CRMController.getLeadDetails);
router.patch('/leads/:id/status', anyCrmRole, CRMController.changeLeadStatus);
router.patch('/leads/:id/assign', anyCrmRole, CRMController.assignLead);
router.post('/leads/:id/convert', salesRole, CRMController.convertLead);
router.post('/leads/:id/notes', anyCrmRole, CRMController.addLeadNote);

export default router;
