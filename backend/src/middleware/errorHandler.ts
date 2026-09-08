import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(err);
};

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred.'
          : err.message,
    },
  });
};
