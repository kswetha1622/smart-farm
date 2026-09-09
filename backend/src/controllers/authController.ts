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
      user = await User.create({ 
        firebaseUid: uid, 
        name, 
        email, 
        phone, 
        preferredLanguage: preferredLanguage || 'en', 
        profileImage,
        lastLoginAt: new Date()
      });
      // Create default settings
      await UserSettings.create({ userId: user._id });
    } else {
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (profileImage) user.profileImage = profileImage;
      user.lastLoginAt = new Date(); // Track login time
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

import { sendEmail } from '../services/emailService';

// POST /api/auth/notify-login
export const sendLoginNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { errorResponse(res, 'UNAUTHORIZED', 'Not authenticated.', 401); return; }
    
    const { method = 'Email/Password' } = req.body;
    const { email } = req.user;
    const loginTime = new Date().toLocaleString();
    
    const subject = `New login to Smart Farm AI`;
    const text = `Hello,\n\nYour account was successfully signed in to Smart Farm AI.\n\nLogin time: ${loginTime}\nLogin method: ${method}\n\nIf this was you, no action is required.\nIf you do not recognize this login, please secure your account and change your password.\n\nThank you,\nSmart Farm AI Team`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello,</h2>
        <p>Your account was successfully signed in to <strong>Smart Farm AI</strong>.</p>
        <ul>
          <li><strong>Login time:</strong> ${loginTime}</li>
          <li><strong>Login method:</strong> ${method}</li>
        </ul>
        <p>If this was you, no action is required.</p>
        <p>If you do not recognize this login, please secure your account and change your password immediately.</p>
        <br/>
        <p>Thank you,<br/>Smart Farm AI Team</p>
      </div>
    `;

    if (email) {
      await sendEmail(email, subject, text, html);
    }
    
    successResponse(res, { message: 'Notification triggered successfully.' });
  } catch (err) {
    console.error('[Auth] sendLoginNotification error:', err);
    errorResponse(res, 'SERVER_ERROR', 'Could not send notification.', 500);
  }
};
