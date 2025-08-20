import { Request, Response, NextFunction } from 'express';
import { setSelectedServer } from '../utils/GlobalStateHelper';
import Debug from 'debug';

const debug = Debug('app:setSelectedServerMiddleware');

/**
 * Middleware to set the selected server from the request body.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const setSelectedServerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const server = req.body.server;

  // Validate the server
  if (!server || typeof server !== 'string') {
    const errorMessage = 'Server must be specified and must be a string';
    debug(errorMessage);
    return res.status(400).send(errorMessage);
  }

  try {
    debug('Setting selected server to: ' + server);
    setSelectedServer(server);
    next();
  } catch (error) {
    const errorMessage = 'Failed to set the selected server: ' + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    res.status(500).send(errorMessage);
  }
};
