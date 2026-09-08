import { Router } from 'express';
import { protect } from '../middleware/auth';
import { handleVoiceQuery } from '../controllers/voiceController';

const router = Router();

router.post('/query', handleVoiceQuery);

export default router;
