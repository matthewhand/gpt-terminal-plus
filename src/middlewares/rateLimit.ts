import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import Debug from 'debug';

const debug = Debug('app:rateLimit');

/**
 * General API rate limiter - applies to most endpoints
 * Limits: 100 requests per 15 minutes per IP
 */
export const generalRateLimit = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1000 : 15 * 60 * 1000, // 1 second for tests, 15 minutes for production
  max: process.env.NODE_ENV === 'test' ? 1000 : 100, // 1000 requests per second for tests, 100 for production
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((15 * 60 * 1000) / 1000) // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    debug('Rate limit exceeded for IP: %s, path: %s', req.ip, req.path);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil((15 * 60 * 1000) / 1000)
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks and during tests
    return req.path === '/health' || req.path === '/' || process.env.NODE_ENV === 'test' || Boolean(req.headers['user-agent']?.includes('supertest')) || req.path.startsWith('/file/');
  }
});

/**
 * Strict rate limiter for sensitive operations
 * Limits: 10 requests per 5 minutes per IP
 */
export const strictRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many sensitive requests from this IP, please try again later.',
    retryAfter: Math.ceil((5 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    debug('Strict rate limit exceeded for IP: %s, path: %s', req.ip, req.path);
    res.status(429).json({
      error: 'Too many sensitive requests from this IP, please try again later.',
      retryAfter: Math.ceil((5 * 60 * 1000) / 1000)
    });
  }
});

/**
 * Chat API rate limiter - more permissive for conversational use
 * Limits: 50 requests per 10 minutes per IP
 */
export const chatRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many chat requests from this IP, please try again later.',
    retryAfter: Math.ceil((10 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    debug('Chat rate limit exceeded for IP: %s, path: %s', req.ip, req.path);
    res.status(429).json({
      error: 'Too many chat requests from this IP, please try again later.',
      retryAfter: Math.ceil((10 * 60 * 1000) / 1000)
    });
  }
});

/**
 * File operation rate limiter - moderate limits for file operations
 * Limits: 20 requests per 5 minutes per IP
 */
export const fileRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many file operations from this IP, please try again later.',
    retryAfter: Math.ceil((5 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    debug('File rate limit exceeded for IP: %s, path: %s', req.ip, req.path);
    res.status(429).json({
      error: 'Too many file operations from this IP, please try again later.',
      retryAfter: Math.ceil((5 * 60 * 1000) / 1000)
    });
  }
});