import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Field from '../models/Field';
import SatelliteAnalysis from '../models/SatelliteAnalysis';
import { searchSentinel2, getBestImage } from '../services/satelliteService';
import { successResponse, errorResponse } from '../utils/response';
import { analyzeCropDamageSTAC } from '../services/satelliteDamageService';

// POST /api/satellite/search
export const searchImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }

    const { fieldId, dateFrom, dateTo, maxCloudCover = 20 } = req.body;
    if (!fieldId || !dateFrom || !dateTo) {
      errorResponse(res, 'MISSING_FIELDS', 'fieldId, dateFrom, and dateTo are required.'); return;
    }

    const field = await Field.findById(fieldId);
    if (!field) { errorResponse(res, 'FIELD_NOT_FOUND', 'Field not found.', 404); return; }
    if (field.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'Not authorized to access this field.', 403); return;
    }

    const products = await searchSentinel2({
      field,
      dateFrom,
      dateTo,
      maxCloudCover: Number(maxCloudCover),
    });

    successResponse(res, { fieldId, count: products.length, images: products });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Satellite search failed.';
    errorResponse(res, 'SATELLITE_ERROR', msg, 503);
  }
};

// POST /api/satellite/before
export const getBeforeImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }

    const { fieldId, dateFrom, dateTo, maxCloudCover = 20 } = req.body;
    if (!fieldId || !dateFrom || !dateTo) {
      errorResponse(res, 'MISSING_FIELDS', 'fieldId, dateFrom, and dateTo are required.'); return;
    }

    const field = await Field.findById(fieldId);
    if (!field) { errorResponse(res, 'FIELD_NOT_FOUND', 'Field not found.', 404); return; }
    if (field.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'Not authorized.', 403); return;
    }

    const best = await getBestImage({ field, dateFrom, dateTo, maxCloudCover: Number(maxCloudCover) });

    if (!best) {
      errorResponse(res, 'NO_IMAGE_FOUND', 'No suitable satellite image found for the specified date range and cloud cover. Try widening the date range or increasing cloud cover tolerance.', 404);
      return;
    }

    successResponse(res, { fieldId, image: best });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Satellite search failed.';
    errorResponse(res, 'SATELLITE_ERROR', msg, 503);
  }
};

// POST /api/satellite/after
export const getAfterImage = async (req: AuthRequest, res: Response): Promise<void> => {
  // Same logic as before — just for a different date range (post-disaster)
  return getBeforeImage(req, res);
};

// POST /api/satellite/analyze-damage
export const analyzeDamage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lat, lon, beforeDate, afterDate, maxCloudCover = 20 } = req.body;
    
    if (!lat || !lon || !beforeDate || !afterDate) {
      errorResponse(res, 'MISSING_FIELDS', 'lat, lon, beforeDate, and afterDate are required.');
      return;
    }

    const result = await analyzeCropDamageSTAC(Number(lat), Number(lon), beforeDate, afterDate, Number(maxCloudCover));
    
    successResponse(res, result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Satellite analysis failed.';
    // Specifically catch the insufficient data error
    if (msg.includes('Insufficient satellite data')) {
      errorResponse(res, 'INSUFFICIENT_DATA', msg, 404);
    } else {
      errorResponse(res, 'SATELLITE_ERROR', msg, 503);
    }
  }
};
