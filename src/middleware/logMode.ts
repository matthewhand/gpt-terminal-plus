import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const defaultLogger = Debug('app:logMode');

export function createLogMode(logger: debug.Debugger = defaultLogger) {
  return function logMode(req: Request, res: Response, next: NextFunction) {
    let mode: string | undefined;
    let type: string | undefined;

    const path = req.path.split('?')[0];

    if (path.startsWith('/command/')) {
      type = 'command';
      mode = path.split('/')[2];
    } else if (path.startsWith('/file/')) {
      type = 'file';
      mode = path.split('/')[2];
    }

    if (type && mode) {
      logger(JSON.stringify({ type, mode, path: req.path }));
    }
    
    next();
  };
}

export const logMode = createLogMode();
