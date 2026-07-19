import { Router } from 'express';
import { PaymentsController } from '../../modules/payments/payments.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const router = Router();

// Dashboard (Any CRM logged-in user, ENGINEER+)
router.get('/dashboard', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ENGINEER']), PaymentsController.getDashboard);

// List/View Payments
router.get('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ENGINEER']), PaymentsController.getPayments);
router.get('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER', 'ENGINEER']), PaymentsController.getPayment);

// Business Actions (CRM Manager and above)
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), PaymentsController.receivePayment);
router.post('/:id/allocate', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), PaymentsController.allocatePayment);
router.post('/:id/confirm', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), PaymentsController.confirmPayment);
router.post('/:id/cancel', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), PaymentsController.cancelPayment);
router.post('/:id/refund', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), PaymentsController.refundPayment);
router.post('/:id/receipt', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER']), PaymentsController.generateReceipt);

export default router;
