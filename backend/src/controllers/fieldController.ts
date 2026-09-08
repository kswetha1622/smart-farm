import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Field from '../models/Field';
import { successResponse, errorResponse } from '../utils/response';
import { getLocalizedMessage, getLangFromRequest } from '../utils/i18n';
import {
  validatePolygon,
  calculatePolygonArea,
  squareMetersToAcres,
  calculateCentroid,
  toGeoJSONPolygon,
  Coordinate,
} from '../utils/geoUtils';

// POST /api/fields
export const createField = async (req: AuthRequest, res: Response): Promise<void> => {
  const lang = getLangFromRequest(req as Parameters<typeof getLangFromRequest>[0]);
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', getLocalizedMessage('UNAUTHORIZED', lang), 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User profile not found.', 404); return; }

    const { name, coordinates, location, soilType, previousCrop, currentCrop } = req.body;

    if (!name) { errorResponse(res, 'MISSING_NAME', 'Field name is required.'); return; }
    if (!coordinates || !Array.isArray(coordinates)) { errorResponse(res, 'MISSING_COORDS', 'Field coordinates are required.'); return; }

    const validation = validatePolygon(coordinates as Coordinate[]);
    if (!validation.valid) { errorResponse(res, 'INVALID_POLYGON', validation.reason || 'Invalid field polygon.'); return; }

    // Always recalculate area on the backend - never trust frontend values
    const areaSquareMeters = calculatePolygonArea(coordinates as Coordinate[]);
    const areaAcres = squareMetersToAcres(areaSquareMeters);
    const centroid = calculateCentroid(coordinates as Coordinate[]);
    const geoJsonPolygon = toGeoJSONPolygon(coordinates as Coordinate[]);

    const field = await Field.create({
      userId: mongoUser._id,
      name,
      geoJsonPolygon,
      centroid,
      areaSquareMeters: Math.round(areaSquareMeters),
      areaAcres: parseFloat(areaAcres.toFixed(4)),
      village: location?.village,
      district: location?.district,
      state: location?.state,
      country: location?.country || 'India',
      soilType,
      previousCrop,
      currentCrop,
    });

    successResponse(res, {
      fieldId: field._id,
      name: field.name,
      areaAcres: field.areaAcres,
      areaSquareMeters: field.areaSquareMeters,
      centroid: field.centroid,
      boundary: coordinates,
      message: getLocalizedMessage('FIELD_SAVED', lang),
    }, 201);
  } catch (err) {
    console.error('[Field] createField error:', err);
    errorResponse(res, 'SERVER_ERROR', 'Could not save field.', 500);
  }
};

// GET /api/fields
export const getFields = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const fields = await Field.find({ userId: mongoUser._id }).select('-geoJsonPolygon -__v').sort({ createdAt: -1 });
    successResponse(res, { count: fields.length, fields });
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not fetch fields.', 500);
  }
};

// GET /api/fields/:id
export const getFieldById = async (req: AuthRequest, res: Response): Promise<void> => {
  const lang = getLangFromRequest(req as Parameters<typeof getLangFromRequest>[0]);
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', getLocalizedMessage('UNAUTHORIZED', lang), 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const field = await Field.findById(req.params.id);
    if (!field) { errorResponse(res, 'FIELD_NOT_FOUND', getLocalizedMessage('FIELD_NOT_FOUND', lang), 404); return; }
    // Authorization check - user can only see their own fields
    if (field.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'You are not authorized to access this field.', 403);
      return;
    }
    successResponse(res, field);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve field.', 500);
  }
};

// PUT /api/fields/:id
export const updateField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const field = await Field.findById(req.params.id);
    if (!field) { errorResponse(res, 'FIELD_NOT_FOUND', 'Field not found.', 404); return; }
    if (field.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'Not authorized.', 403); return;
    }
    const allowed = ['name', 'soilType', 'previousCrop', 'currentCrop', 'irrigationAvailable'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (field as any)[key] = req.body[key];
      }
    }
    await field.save();
    successResponse(res, field);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not update field.', 500);
  }
};

// DELETE /api/fields/:id
export const deleteField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const field = await Field.findById(req.params.id);
    if (!field) { errorResponse(res, 'FIELD_NOT_FOUND', 'Field not found.', 404); return; }
    if (field.userId.toString() !== (mongoUser._id as { toString(): string }).toString()) {
      errorResponse(res, 'FORBIDDEN', 'Not authorized.', 403); return;
    }
    await field.deleteOne();
    successResponse(res, { message: 'Field deleted successfully.' });
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not delete field.', 500);
  }
};
