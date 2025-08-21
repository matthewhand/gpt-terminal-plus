import { Request, Response, NextFunction } from 'express';

// TODO middleware: logs the mode of incoming requests
export function logMode(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/command/')) {
    const mode = req.path.replace('/command/', '');
    console.log(`[TODO] Incoming request → mode=${mode}`);
  } else if (req.path.startsWith('/file/')) {
    const mode = req.path.replace('/file/', '');
    console.log(`[TODO] Incoming request → mode=file:${mode}`);
  }
  next();
}
