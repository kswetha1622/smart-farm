import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { successResponse, errorResponse } from '../utils/response';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const user = await User.findOne({ firebaseUid: req.user.uid }).select('-__v');
    if (!user) { errorResponse(res, 'USER_NOT_FOUND', 'Profile not found.', 404); return; }
    successResponse(res, user);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not retrieve profile.', 500);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const allowed = ['name', 'phone', 'preferredLanguage', 'village', 'district', 'state', 'totalLandAcres'];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      updates,
      { new: true, runValidators: true }
    ).select('-__v');
    if (!user) { errorResponse(res, 'USER_NOT_FOUND', 'Profile not found.', 404); return; }
    successResponse(res, user);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not update profile.', 500);
  }
};
