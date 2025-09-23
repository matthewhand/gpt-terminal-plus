import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const logModeDebug = Debug('app:middleware:logMode');

/**
 * Middleware to handle log mode functionality
 */
export function logMode(req: Request, res: Response, next: NextFunction): void {
  // Log command or file mode based on path
  const path = req.path;
  let type = '';
  let mode = '';
  if (path.startsWith('/command')) {
    type = 'command';
    // Extract mode from route, e.g., /command/executeShell -> executeShell
    const parts = path.split('/').filter(Boolean);
    mode = parts[parts.length - 1]; // Last segment as mode
  } else if (path.startsWith('/file')) {
    type = 'file';
    // Extract mode from route, e.g., /file/read -> read
    const parts = path.split('/').filter(Boolean);
    mode = parts[parts.length - 1]; // Last segment as mode
  }
  if (type) {
    logModeDebug(JSON.stringify({ type, mode }));
  }
  next();
}