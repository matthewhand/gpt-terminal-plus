import { Request, Response, NextFunction } from 'express';

export interface GPTActionError {
  message: string;
  type: 'validation' | 'authentication' | 'authorization' | 'not_found' | 'server_error';
  details?: any;
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Normalize error
  const isErrorObject = err instanceof Error;
  const name = isErrorObject ? err.name : (err && (err.name as string)) || '';
  // For non-Error values (including strings), prefer a generic message
  const rawMessage = isErrorObject ? err.message : '';
  const message = rawMessage && rawMessage.trim().length > 0 ? rawMessage : 'Internal server error';

  const errorResponse: GPTActionError = {
    message,
    type: 'server_error'
  };

  if (name === 'ValidationError') {
    errorResponse.type = 'validation';
    (errorResponse as any).details = (err && (err as any).details) || undefined;
    return res.status(400).json(errorResponse);
  }
  if (name === 'UnauthorizedError') {
    errorResponse.type = 'authentication';
    return res.status(401).json(errorResponse);
  }
  if (name === 'ForbiddenError') {
    errorResponse.type = 'authorization';
    return res.status(403).json(errorResponse);
  }
  if (name === 'NotFoundError') {
    errorResponse.type = 'not_found';
    return res.status(404).json(errorResponse);
  }

  // Handle null/undefined
  if (!err) {
    return res.status(500).json({ message: 'Unknown error occurred', type: 'server_error' });
  }
  // For any non-Error (including string), do not echo the raw value back
  if (!isErrorObject) {
    return res.status(500).json({ message: 'Internal server error', type: 'server_error' });
  }

  return res.status(500).json(errorResponse);
};
