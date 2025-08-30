import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debug = Debug('app:security');

interface SecurityEvent {
  timestamp: string;
  ip: string;
  userAgent?: string;
  method: string;
  path: string;
  event: string;
  details?: any;
}

const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 1000;

export function logSecurityEvent(req: Request, event: string, details?: any) {
  const securityEvent: SecurityEvent = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent'),
    method: req.method,
    path: req.path,
    event,
    details
  };

  securityEvents.push(securityEvent);
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.shift();
  }

  debug(`Security event: ${event}`, securityEvent);
}

export function securityLogger(req: Request, res: Response, next: NextFunction) {
  // Log authentication attempts
  const authHeader = req.get('Authorization');
  if (authHeader) {
    if (!authHeader.startsWith('Bearer ')) {
      logSecurityEvent(req, 'INVALID_AUTH_FORMAT');
    }
  }

  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /exec\(/i,  // Code injection
    /eval\(/i   // Code injection
  ];

  const fullUrl = req.originalUrl || req.url;
  const body = JSON.stringify(req.body || {});
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullUrl) || pattern.test(body)) {
      logSecurityEvent(req, 'SUSPICIOUS_PATTERN', { pattern: pattern.source });
      break;
    }
  }

  // Log failed requests
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      logSecurityEvent(req, 'ERROR_RESPONSE', { statusCode: res.statusCode });
    }
    return originalSend.call(this, data);
  };

  next();
}

export function getSecurityEvents(): SecurityEvent[] {
  return [...securityEvents];
}