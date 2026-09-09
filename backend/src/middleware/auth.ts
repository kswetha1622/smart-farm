import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { errorResponse } from '../utils/response';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    mongoId?: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    errorResponse(res, 'UNAUTHORIZED', 'No authentication token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    let decoded;
    try {
      // Attempt strict verification using Firebase Admin SDK
      decoded = await getAuth().verifyIdToken(token);
    } catch (firebaseErr) {
      // Fallback for local dev environments where Admin SDK keys (.env) are missing
      if (!process.env.FIREBASE_PROJECT_ID && process.env.NODE_ENV !== 'production') {
        const payloadStr = Buffer.from(token.split('.')[1], 'base64').toString('utf8');
        decoded = JSON.parse(payloadStr);
        console.warn(`[Auth Warning] Bypassed Firebase signature verification for user ${decoded.email} because Admin SDK keys are missing in local dev.`);
        if (!decoded || !decoded.user_id) throw new Error('Invalid token structure');
        decoded.uid = decoded.user_id; // Normalize UID
      } else {
        throw firebaseErr; // Re-throw in production or if keys are present
      }
    }

    req.user = { uid: decoded.uid || decoded.user_id, email: decoded.email };

    // Optionally attach MongoDB user ID
    const mongoUser = await User.findOne({ firebaseUid: req.user.uid }).select('_id');
    if (mongoUser) {
      req.user.mongoId = (mongoUser._id as { toString(): string }).toString();
    }

    next();
  } catch (err) {
    console.error('[Auth Error]', err);
    errorResponse(res, 'INVALID_TOKEN', 'Authentication token is invalid or expired.', 401);
  }
};
