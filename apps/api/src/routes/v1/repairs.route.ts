import { Router } from 'express';
import { RepairsController } from '../../modules/repairs/repairs.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// View and Manage roles
const viewerRoles = [Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT, Role.SALES, Role.TECHNICIAN];
const managerRoles = [Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT];
const technicianRoles = [Role.ADMIN, Role.CRM_MANAGER, Role.TECHNICIAN];

router.get('/dashboard', requireRole(technicianRoles), RepairsController.getRepairDashboard);
router.get('/', requireRole(viewerRoles), RepairsController.getRepairs);
router.get('/:id', requireRole(viewerRoles), RepairsController.getRepairById);
router.get('/:id/timeline', requireRole(viewerRoles), RepairsController.getTimeline);

router.post('/', requireRole(managerRoles), RepairsController.createRepair);
router.patch('/:id/status', requireRole(technicianRoles), RepairsController.updateStatus);
router.patch('/:id/diagnosis', requireRole(technicianRoles), RepairsController.updateDiagnosis);

export const repairsRoutes = router;
