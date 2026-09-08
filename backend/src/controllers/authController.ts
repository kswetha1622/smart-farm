import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import UserSettings from '../models/UserSettings';
import { successResponse, errorResponse } from '../utils/response';
import mongoose from 'mongoose';

// POST /api/auth/profile
// Creates or fetches user profile from Firebase UID
export const upsertProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const { uid, email } = req.user;
    const { name, phone, preferredLanguage, profileImage } = req.body;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      if (!name || !email) {
        errorResponse(res, 'MISSING_FIELDS', 'Name and email are required to create profile.');
        return;
      }
      user = await User.create({ firebaseUid: uid, name, email, phone, preferredLanguage: preferredLanguage || 'en', profileImage });
      // Create default settings
      await UserSettings.create({ userId: user._id });
    } else {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (profileImage) user.profileImage = profileImage;
      await user.save();
    }

    successResponse(res, user, 200);
  } catch (err) {
    console.error('[Auth] upsertProfile error:', err);
    errorResponse(res, 'SERVER_ERROR', 'Could not create or update profile.', 500);
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    const user = await User.findOne({ firebaseUid: req.user.uid }).select('-__v');
    if (!user) { errorResponse(res, 'USER_NOT_FOUND', 'User profile not found. Please create a profile first.', 404); return; }
    successResponse(res, user);
  } catch (err) {
    errorResponse(res, 'SERVER_ERROR', 'Could not fetch profile.', 500);
  }
};

// POST /api/auth/logout
export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  // Firebase token invalidation happens client-side
  // Backend just acknowledges logout
  successResponse(res, { message: 'Logged out successfully.' });
};
