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
    const decoded = await getAuth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };

    // Optionally attach MongoDB user ID
    const mongoUser = await User.findOne({ firebaseUid: decoded.uid }).select('_id');
    if (mongoUser) {
      req.user.mongoId = (mongoUser._id as { toString(): string }).toString();
    }

    next();
  } catch (err) {
    errorResponse(res, 'INVALID_TOKEN', 'Authentication token is invalid or expired.', 401);
  }
};
