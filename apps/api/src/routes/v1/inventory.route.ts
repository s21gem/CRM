import { Router } from 'express';
import { InventoryController } from '../../modules/inventory/inventory.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// RBAC
const viewerRoles = [Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT, Role.SALES, Role.ENGINEER];
const managerRoles = [Role.ADMIN, Role.CRM_MANAGER];
const technicianRoles = [Role.ADMIN, Role.CRM_MANAGER, Role.ENGINEER];

// Dashboard (Dedicated Endpoint)
router.get('/dashboard', requireRole(managerRoles), InventoryController.getDashboard);

// Items list & Details
router.get('/', requireRole(viewerRoles), InventoryController.getItems);
router.get('/:id', requireRole(viewerRoles), InventoryController.getItem);

// Item Management
router.post('/', requireRole(managerRoles), InventoryController.createItem);
router.patch('/:id', requireRole(managerRoles), InventoryController.updateItem);

// Stock Adjustments
router.post('/adjust', requireRole(managerRoles), InventoryController.adjustStock);

// Reservations & Consumption
router.post('/reserve', requireRole(technicianRoles), InventoryController.reserveParts);
router.post('/reservations/:id/release', requireRole(technicianRoles), InventoryController.releaseReservation);
router.post('/reservations/:id/consume', requireRole(technicianRoles), InventoryController.consumeReservation);

export default router;
