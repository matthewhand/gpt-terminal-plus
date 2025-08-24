import { getOrGenerateApiToken } from '../common/apiToken';
import { convictConfig } from '../config/convictConfig';
import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debug = Debug('app:checkAuthToken');

/**
 * Middleware to check the API token in request headers.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const checkAuthToken = (req: Request, res: Response, next: NextFunction): void => {
  debug('checkAuthToken middleware called.');

  // Skip auth for health check
  if (req.path === '/health') {
    return next();
  }

  // Check for overridden API token first, fallback to generated
  const cfg = convictConfig();
  const overriddenToken = cfg.get('security.apiToken');
  const apiToken = overriddenToken || getOrGenerateApiToken();

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    debug('No authorization token provided');
    res.sendStatus(401); // No token present
    return;
  }

  if (token !== apiToken) {
    debug('Authorization token mismatch');
    res.sendStatus(403); // Token mismatch
    return;
  }

  debug('API token validated successfully.');
  next();
};
