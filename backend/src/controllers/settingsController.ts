import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import UserSettings from '../models/UserSettings';
import { successResponse, errorResponse } from '../utils/response';

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    let settings = await UserSettings.findOne({ userId: mongoUser._id });
    if (!settings) settings = await UserSettings.create({ userId: mongoUser._id });
    successResponse(res, settings);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve settings.', 500);
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!mongoUser) { errorResponse(res, 'USER_NOT_FOUND', 'User not found.', 404); return; }
    const allowed = [
      'voiceOutput', 'autoRead', 'speechSpeed', 'weatherAlerts',
      'cropAlerts', 'diseaseAlerts', 'largeText', 'highContrast',
      'simpleMode', 'preferredLanguage',
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const settings = await UserSettings.findOneAndUpdate(
      { userId: mongoUser._id },
      updates,
      { new: true, upsert: true, runValidators: true }
    );
    successResponse(res, settings);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not update settings.', 500);
  }
};
