import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/userController';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
