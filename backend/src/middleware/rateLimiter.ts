import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (use Redis in production for multi-instance deployments)
const store = new Map<string, { count: number; resetTime: number }>();

export const createRateLimiter = (windowMs: number, max: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetTime) {
      store.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    entry.count++;
    if (entry.count > max) {
      res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMIT', message: 'Too many requests. Please try again later.' },
      });
      return;
    }

    next();
  };
};

export const generalLimiter = createRateLimiter(15 * 60 * 1000, 200); // 200 requests/15 min
export const authLimiter = createRateLimiter(15 * 60 * 1000, 20); // 20 requests/15 min
export const uploadLimiter = createRateLimiter(60 * 1000, 10); // 10 uploads/min
