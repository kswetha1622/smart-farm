import { Router } from 'express';
import { successResponse } from '../utils/response';

const router = Router();

router.get('/', (_req, res) => {
  successResponse(res, {
    status: 'ok',
    service: 'Smart Farm AI Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
