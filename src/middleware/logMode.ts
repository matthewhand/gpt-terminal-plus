import { Request, Response, NextFunction } from 'express';
import Debug from 'debug';

const debug = Debug('app:logMode');

export function logMode(req: Request, res: Response, next: NextFunction) {
  let mode: string | undefined;
  let type: string | undefined;

  if (req.path.startsWith('/command/')) {
    type = 'command';
    mode = req.path.replace('/command/', '');
  } else if (req.path.startsWith('/file/')) {
    type = 'file';
    mode = req.path.replace('/file/', '');
  }

  if (type && mode) {
    debug({ type, mode, path: req.path });
  }
  
  next();
}
