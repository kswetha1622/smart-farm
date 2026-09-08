import { Router } from 'express';
import { getCurrentWeather, getForecast } from '../controllers/weatherController';

const router = Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);

export default router;
