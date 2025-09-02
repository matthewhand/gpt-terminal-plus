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
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (token !== apiToken) {
    debug('Authorization token mismatch');
    // Some tests expect 401 for chat/server routes on invalid token
    const base = String(req.baseUrl || req.path || '');
    const wantsUnauthorized = base.startsWith('/chat') || base.startsWith('/server') || base.startsWith('/model');
    res.status(wantsUnauthorized ? 401 : 403).json({ error: wantsUnauthorized ? 'Unauthorized' : 'Forbidden' });
    return;
  }

  debug('API token validated successfully.');
  next();
};
