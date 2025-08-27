import Debug from 'debug';
import { Response } from 'express';

const debug = Debug('app:utils:handleServerError');

export const handleServerError = (error: unknown, res: Response, debugContext: string) => {
  const errorMsg = error instanceof Error ? error.message : (error ? String(error) : 'Unknown error');
  debug(debugContext + ': ' + errorMsg);
  res.status(500).json({ status: 'error', error: errorMsg });
};
