import { Router } from 'express';
import { CustomersController } from '../../modules/customers/customers.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Protect all CRM routes with authentication
router.use(authenticate);

// Granular RBAC definitions
const fullAccess = requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER]);
const viewAccess = requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES, Role.SUPPORT]);
const deviceAccess = requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT]);

// Customers
router.get('/', viewAccess, CustomersController.getCustomers);
router.get('/:id', viewAccess, CustomersController.getCustomerDetails);
router.post('/', fullAccess, CustomersController.createCustomer);
router.patch('/:id', fullAccess, CustomersController.updateCustomer);

// Devices
router.post('/:id/devices', deviceAccess, CustomersController.registerDevice);

// Timeline
router.get('/:id/timeline', viewAccess, CustomersController.getCustomerTimeline);

export default router;
