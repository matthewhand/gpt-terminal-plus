import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './securityLogger';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
}

export function validateRequest(rules: ValidationRule[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];
    const body = req.body || {};

    for (const rule of rules) {
      const value = body[rule.field];

      // Required field check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      // Skip further validation if field is not present and not required
      if (value === undefined || value === null) continue;

      // Type validation
      if (rule.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rule.type) {
          errors.push(`${rule.field} must be of type ${rule.type}`);
          continue;
        }
      }

      // String validations
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${rule.field} format is invalid`);
        }

        // Sanitization
        if (rule.sanitize) {
          body[rule.field] = sanitizeString(value);
        }
      }
    }

    if (errors.length > 0) {
      logSecurityEvent(req, 'VALIDATION_FAILED', { errors });
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }

    next();
  };
}

function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// Common validation patterns
export const commonValidations = {
  filePath: {
    field: 'filePath',
    required: true,
    type: 'string' as const,
    maxLength: 1000,
    pattern: /^[^<>:"|?*\x00-\x1f]+$/,
    sanitize: true
  },
  command: {
    field: 'command',
    required: true,
    type: 'string' as const,
    maxLength: 10000,
    sanitize: true
  },
  content: {
    field: 'content',
    type: 'string' as const,
    maxLength: 1000000,
    sanitize: true
  }
};