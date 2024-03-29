import { Request, Response, NextFunction } from 'express';
import { setSelectedServer } from '../utils/GlobalStateHelper';

export const setSelectedServerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const server = req.body.server;
  if (!server) {
    return res.status(400).send('Server not specified');
  }

  try {
    setSelectedServer(server);
    next();
  } catch (error) {
    res.status(500).send('Failed to set the selected server');
  }
};
