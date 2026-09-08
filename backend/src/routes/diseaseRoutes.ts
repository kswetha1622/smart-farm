import { Router } from 'express';
import { protect } from '../middleware/auth';
import { analyzeDiseaseImage, getDiseaseHistory } from '../controllers/diseaseController';
import { diseaseUpload } from '../middleware/uploadMiddleware';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// Allow public access to analyze without auth
router.post('/analyze', uploadLimiter, diseaseUpload.single('image'), analyzeDiseaseImage);

// Protected routes
router.use(protect);
router.get('/history', getDiseaseHistory);

export default router;
