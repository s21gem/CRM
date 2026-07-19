import { Router } from 'express';
import { InvoicesController } from '../../modules/invoices/invoices.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const router = Router();

// Dashboard (Any logged in CRM user, ENGINEER and above)
router.get('/dashboard', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ENGINEER']), InvoicesController.getDashboard);

// List/View
router.get('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ENGINEER']), InvoicesController.getInvoices);
router.get('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ENGINEER']), InvoicesController.getInvoice);

// Creation/Modification (CRM Manager and above)
router.post('/draft', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), InvoicesController.createDraft);
router.post('/:id/labor', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), InvoicesController.addLaborCharge);
router.post('/:id/refresh-parts', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), InvoicesController.refreshParts);

// Status Transitions
router.post('/:id/approve', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), InvoicesController.approveInvoice);
router.post('/:id/issue', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), InvoicesController.issueInvoice);
router.post('/:id/void', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), InvoicesController.voidInvoice);

export const invoicesRoutes = router;
