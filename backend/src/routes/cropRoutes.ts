import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getCropRecommendations, getCropHistory } from '../controllers/cropController';

const router = Router();

router.use(protect);

router.post('/recommend', getCropRecommendations);
router.get('/history', getCropHistory);

export default router;
