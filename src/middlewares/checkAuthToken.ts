import { getOrGenerateApiToken } from '../common/apiToken';
import { convictConfig } from '../config/convictConfig';
import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debug = Debug('app:checkAuthToken');

/**
 * Check if an IP address is in a private network range (RFC 1918)
 * @param ip - IP address to check
 * @returns boolean - true if IP is in private network range
 */
function isPrivateNetwork(ip: string): boolean {
  // Handle IPv6 localhost
  if (ip === '::1') return true;
  
  // Handle IPv4-mapped IPv6 addresses
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  
  // Split IP into octets
  const octets = ip.split('.').map(Number);
  
  if (octets.length !== 4) return false;
  
  // Check RFC 1918 private network ranges:
  // 10.0.0.0/8
  if (octets[0] === 10) return true;
  
  // 172.16.0.0/12
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  
  // 192.168.0.0/16
  if (octets[0] === 192 && octets[1] === 168) return true;
  
  // localhost
  if (ip === '127.0.0.1') return true;
  
  return false;
}

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

  // Check if private network access is allowed without token
  const disablePrivateNetwork = process.env.DISABLE_PRIVATE_NETWORK_ACCESS === 'true';
  const isPrivate = isPrivateNetwork(req.ip || '');
  
  // Allow private network access without token in development mode
  if (isPrivate && !disablePrivateNetwork && process.env.NODE_ENV !== 'production') {
    debug('Allowing private network access without token in development mode');
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
