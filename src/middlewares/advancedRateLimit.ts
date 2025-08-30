import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './securityLogger';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function advancedRateLimit(config: RateLimitConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = config.keyGenerator ? config.keyGenerator(req) : req.ip || 'unknown';
    const now = Date.now();
    
    // Clean expired entries
    for (const [k, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(k);
      }
    }

    let entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      };
      rateLimitStore.set(key, entry);
    }

    // Check if request should be counted
    const shouldCount = !config.skipSuccessfulRequests && !config.skipFailedRequests;
    
    if (shouldCount) {
      entry.count++;
    }

    if (entry.count > config.maxRequests) {
      logSecurityEvent(req, 'RATE_LIMIT_EXCEEDED', { 
        key, 
        count: entry.count, 
        limit: config.maxRequests 
      });
      
      return res.status(429).json({
        error: 'Too Many Requests',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      });
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.maxRequests - entry.count).toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
    });

    next();
  };
}

// Predefined rate limiters
export const rateLimiters = {
  strict: advancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  }),
  
  moderate: advancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 500
  }),
  
  lenient: advancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000
  }),
  
  perUser: (maxRequests: number = 100) => advancedRateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests,
    keyGenerator: (req) => {
      const authHeader = req.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        return `user:${authHeader.slice(7, 20)}`; // Use first part of token as key
      }
      return req.ip || 'unknown';
    }
  })
};