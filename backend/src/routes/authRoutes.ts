import { Router } from 'express';
import { protect } from '../middleware/auth';
import { upsertProfile, getMe, logout } from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/profile', authLimiter, protect, upsertProfile);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
