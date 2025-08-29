import { Request, Response, NextFunction } from 'express';

const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    
    const record = requests.get(ip);
    if (!record || now > record.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }
    
    record.count++;
    next();
  };
}