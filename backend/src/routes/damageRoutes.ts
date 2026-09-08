import { Router } from 'express';
import { protect } from '../middleware/auth';
import { startAnalysis, getAnalysis, getAnalysisHistory } from '../controllers/damageController';

const router = Router();

router.use(protect);

router.post('/analyze', startAnalysis);
router.get('/history', getAnalysisHistory);
router.get('/:analysisId', getAnalysis);

export default router;
