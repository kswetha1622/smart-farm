import { Request, Response } from 'express';
import { getWeatherData } from '../services/weatherService';
import { successResponse, errorResponse } from '../utils/response';
import { getLocalizedMessage } from '../utils/i18n';

export const getCurrentWeather = async (req: Request, res: Response): Promise<void> => {
  const lang = (req.query.lang as string) || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    if (isNaN(lat) || isNaN(lng)) {
      errorResponse(res, 'INVALID_COORDS', 'Please provide valid lat and lng query parameters.');
      return;
    }
    const data = await getWeatherData(lat, lng);
    successResponse(res, {
      current: data.current,
      fromCache: data.fromCache,
      updatedAt: data.cachedAt,
    });
  } catch (err) {
    console.error('[Weather] currentWeather error:', err);
    errorResponse(res, 'WEATHER_ERROR', getLocalizedMessage('WEATHER_UNAVAILABLE', lang), 503);
  }
};

export const getForecast = async (req: Request, res: Response): Promise<void> => {
  const lang = (req.query.lang as string) || 'en';
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    if (isNaN(lat) || isNaN(lng)) {
      errorResponse(res, 'INVALID_COORDS', 'Please provide valid lat and lng query parameters.');
      return;
    }
    const data = await getWeatherData(lat, lng);
    successResponse(res, {
      forecast: data.forecast,
      fromCache: data.fromCache,
      updatedAt: data.cachedAt,
    });
  } catch (err) {
    errorResponse(res, 'WEATHER_ERROR', getLocalizedMessage('WEATHER_UNAVAILABLE', lang), 503);
  }
};
