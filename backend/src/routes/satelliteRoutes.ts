import { Router } from 'express';
import { protect } from '../middleware/auth';
import { searchImages, getBeforeImage, getAfterImage, analyzeDamage } from '../controllers/satelliteController';

const router = Router();

// Allow public access to analyze-damage without Firebase Auth token (to enable easy demoing)
router.post('/analyze-damage', analyzeDamage);

// Protected routes below
router.use(protect);
router.post('/search', searchImages);
router.post('/before', getBeforeImage);
router.post('/after', getAfterImage);

export default router;
