import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debug = Debug('app:middleware:logMode');

/**
 * Middleware to handle log mode functionality
 */
export function logMode(req: Request, res: Response, next: NextFunction): void {
  // Add any log mode specific logic here
  debug(`${req.method} ${req.path}`);
  next();
}