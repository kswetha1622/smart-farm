import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getSettings, updateSettings } from '../controllers/settingsController';

const router = Router();

router.use(protect);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
