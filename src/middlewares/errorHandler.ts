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
  void _next;
  try { if (process.env.NODE_ENV === 'test') { /* helpful during tests */ console.error('[errorHandler]', err); } } catch {}
  // Handle JSON/body parse errors from express.json/body-parser
  // body-parser sets err.type === 'entity.parse.failed' for malformed JSON
  if (err && (err instanceof SyntaxError || err.type === 'entity.parse.failed')) {
    return res.status(400).json({ message: 'Bad Request', type: 'validation' });
  }
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
    res.status(400).json(errorResponse);
    return;
  }
  if (name === 'UnauthorizedError') {
    errorResponse.type = 'authentication';
    res.status(401).json(errorResponse);
    return;
  }
  if (name === 'ForbiddenError') {
    errorResponse.type = 'authorization';
    res.status(403).json(errorResponse);
    return;
  }
  if (name === 'NotFoundError') {
    errorResponse.type = 'not_found';
    res.status(404).json(errorResponse);
    return;
  }

  // Handle null/undefined
  if (!err) {
    res.status(500).json({ message: 'Unknown error occurred', type: 'server_error' });
    return;
  }
  // For any non-Error (including string), do not echo the raw value back
  if (!isErrorObject) {
    res.status(500).json({ message: 'Internal server error', type: 'server_error' });
    return;
  }

  res.status(500).json(errorResponse);
  return;
};
