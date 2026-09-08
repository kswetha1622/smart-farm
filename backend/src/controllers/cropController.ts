import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Field from '../models/Field';
import { successResponse, errorResponse } from '../utils/response';
import { getRecommendations } from '../services/cropRecommendationService';
import { getWeatherData } from '../services/weatherService';

export const getCropRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }

    const { fieldId, landAreaAcres, soilType, season, previousCrop, irrigation } = req.body;
    if (!soilType || !season || !irrigation) {
      errorResponse(res, 'MISSING_FIELDS', 'soilType, season, and irrigation are required.'); return;
    }

    let lat = 17.0; // Default to central India
    let lng = 78.0;

    if (fieldId) {
      const field = await Field.findById(fieldId);
      if (field && field.userId.toString() === (mongoUser._id as { toString(): string }).toString()) {
        lat = field.centroid.lat;
        lng = field.centroid.lng;
      }
    }

    let weatherData: Record<string, unknown> | undefined;
    try {
      const weather = await getWeatherData(lat, lng);
      weatherData = weather.current as Record<string, unknown>;
    } catch {
      // Weather is optional for recommendations — proceed without it
    }

    const recommendations = getRecommendations({
      lat,
      lng,
      landAreaAcres: Number(landAreaAcres) || 5,
      soilType,
      season,
      previousCrop,
      irrigation,
      weatherData,
    });

    successResponse(res, {
      recommendations,
      disclaimer: 'These are AI-based suggestions. Consult an agricultural expert for final decisions.',
    });
  } catch (err) {
    console.error('[Crop] getCropRecommendations error:', err);
    errorResponse(res, 'SERVER_ERROR', 'Could not generate recommendations.', 500);
  }
};

export const getCropHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const fields = await Field.find({ userId: mongoUser._id })
      .select('name previousCrop currentCrop areaAcres updatedAt');
    successResponse(res, { cropHistory: fields });
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve crop history.', 500);
  }
};
