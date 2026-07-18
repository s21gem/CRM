import { Router } from 'express';
import { AuthController } from '../../modules/auth/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
