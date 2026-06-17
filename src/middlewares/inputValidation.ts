import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debug = Debug('app:inputValidation');

/**
 * Common validation patterns
 */
export const validationPatterns = {
  // File and path validation
  safePath: /^[\w\-./]+$/,
  fileName: /^[\w\-\.]+$/,
  directoryPath: /^[\w\-./]+$/,

  // Command validation
  safeCommand: /^[a-zA-Z0-9_\-.\s]+$/,
  shellCommand: /^[a-zA-Z0-9_\-.\s'"|&;()]+$/,

  // Code validation
  codeIdentifier: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
  safeCode: /^[a-zA-Z0-9_\-+*/=<>!&|^%()\[\]{}.,\s'"`]+$/,

  // General validation
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,

  // Numeric validation
  positiveInteger: /^[1-9]\d*$/,
  integer: /^-?\d+$/,
  float: /^-?\d+(\.\d+)?$/,
  port: /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,

  // UUID validation
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

/**
 * Sanitization functions
 */
export const sanitizers = {
  /**
   * Remove potentially dangerous characters from strings
   */
  sanitizeString: (input: string, maxLength: number = 1000): string => {
    if (typeof input !== 'string') return '';

    // Remove null bytes and other dangerous characters
    let sanitized = input
      .replace(/\0/g, '') // Remove null bytes
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .trim();

    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  },

  /**
   * Sanitize file paths to prevent directory traversal
   */
  sanitizePath: (input: string): string => {
    if (typeof input !== 'string') return '';

    let sanitized = input
      .replace(/\.\./g, '') // Remove directory traversal
      .replace(/[/\\]+/g, '/') // Normalize path separators
      .replace(/^\/+/, '') // Remove leading slashes
      .trim();

    return sanitized;
  },

  /**
   * Sanitize command strings
   */
  sanitizeCommand: (input: string): string => {
    if (typeof input !== 'string') return '';

    // Remove dangerous command injection patterns
    let sanitized = input
      .replace(/[;&|`$()]/g, '') // Remove shell metacharacters
      .replace(/\.\./g, '') // Remove directory traversal
      .trim();

    return sanitized;
  }
};

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

/**
 * Validate input against a pattern
 */
export function validateInput(
  value: any,
  pattern: RegExp,
  fieldName: string = 'input'
): ValidationResult {
  const errors: string[] = [];

  if (value === null || value === undefined) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (typeof value !== 'string') {
    value = String(value);
  }

  if (!pattern.test(value)) {
    errors.push(`${fieldName} contains invalid characters or format`);
    return { isValid: false, errors };
  }

  return { isValid: true, errors, sanitizedValue: value };
}

/**
 * Comprehensive input validation middleware
 */
export function validateRequestBody(
  requiredFields: string[] = [],
  fieldValidators: Record<string, RegExp> = {},
  options: {
    maxBodySize?: number;
    sanitize?: boolean;
  } = {}
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Check body size
    if (options.maxBodySize && JSON.stringify(req.body).length > options.maxBodySize) {
      errors.push(`Request body too large (max ${options.maxBodySize} bytes)`);
    }

    // Check required fields
    for (const field of requiredFields) {
      if (!req.body || req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate field patterns
    if (req.body && typeof req.body === 'object') {
      for (const [field, pattern] of Object.entries(fieldValidators)) {
        if (req.body[field] !== undefined) {
          const result = validateInput(req.body[field], pattern, field);
          if (!result.isValid) {
            errors.push(...result.errors);
          } else if (options.sanitize && result.sanitizedValue !== undefined) {
            req.body[field] = result.sanitizedValue;
          }
        }
      }
    }

    if (errors.length > 0) {
      debug('Validation failed:', errors);
      res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
      return;
    }

    next();
  };
}

/**
 * File operation validation middleware
 */
export const validateFileOperation = validateRequestBody(
  ['filePath'],
  {
    filePath: validationPatterns.safePath,
    content: /.*/ // Allow any content but will be sanitized
  },
  { sanitize: true }
);

/**
 * Command execution validation middleware
 */
export const validateCommandExecution = validateRequestBody(
  ['command'],
  {
    command: validationPatterns.shellCommand,
    shell: validationPatterns.safePath
  },
  { sanitize: true, maxBodySize: 10000 }
);

/**
 * Code execution validation middleware
 */
export const validateCodeExecution = validateRequestBody(
  ['code'],
  {
    code: validationPatterns.safeCode,
    language: validationPatterns.alphanumeric
  },
  { sanitize: true, maxBodySize: 50000 }
);

/**
 * Generic input sanitization middleware
 */
export function sanitizeInput(fields: string[] = []) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.body && typeof req.body === 'object') {
      for (const field of fields) {
        if (typeof req.body[field] === 'string') {
          req.body[field] = sanitizers.sanitizeString(req.body[field]);
        }
      }
    }

    // Sanitize query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          (req.query as any)[key] = sanitizers.sanitizeString(value);
        }
      }
    }

    next();
  };
}

/**
 * SQL injection prevention middleware
 */
export function preventSQLInjection(fields: string[] = []) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(-{2}|\/\*|\*\/)/,
      /('|(\\x27)|(\\x2D))/i
    ];

    const checkField = (value: string, fieldName: string): boolean => {
      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          debug(`Potential SQL injection detected in ${fieldName}: ${value}`);
          return false;
        }
      }
      return true;
    };

    if (req.body && typeof req.body === 'object') {
      for (const field of fields) {
        if (typeof req.body[field] === 'string' && !checkField(req.body[field], field)) {
          res.status(400).json({
            error: 'Invalid input detected',
            message: 'Input contains potentially dangerous patterns'
          });
          return;
        }
      }
    }

    next();
  };
}