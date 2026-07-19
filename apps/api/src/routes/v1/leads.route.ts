import { Router } from 'express';
import { LeadsController } from '../../modules/leads/leads.controller';

const router = Router();

router.post('/inquiry', LeadsController.submitInquiry);
router.post('/quote', LeadsController.submitQuote);
router.post('/repair', LeadsController.submitRepair);
router.post('/business', LeadsController.submitBusiness);

export default router;
