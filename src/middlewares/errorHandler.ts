import { Request, Response, NextFunction } from 'express';

export interface GPTActionError {
  message: string;
  type: 'validation' | 'authentication' | 'authorization' | 'not_found' | 'server_error';
  details?: any;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // GPT Actions expect specific error format
  const msg = err && (err.message || String(err)) || 'Internal server error';
  const errorResponse: GPTActionError = {
    message: msg,
    type: 'server_error'
  };

  if (err.name === 'ValidationError') {
    errorResponse.type = 'validation';
    errorResponse.details = err.details;
    res.status(400).json(errorResponse);
  } else if (err.name === 'UnauthorizedError') {
    errorResponse.type = 'authentication';
    res.status(401).json(errorResponse);
  } else if (err.name === 'ForbiddenError') {
    errorResponse.type = 'authorization';
    res.status(403).json(errorResponse);
  } else if (err.name === 'NotFoundError') {
    errorResponse.type = 'not_found';
    res.status(404).json(errorResponse);
  } else {
    res.status(500).json(errorResponse);
  }
};
