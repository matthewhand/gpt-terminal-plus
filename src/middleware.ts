import { Request, Response, NextFunction } from 'express';

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'An unexpected error occurred';
  res.status(statusCode).json({ error: errorMessage });
};

// Not found handler middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
};
