import { Request, Response, NextFunction } from 'express';
import { ServerHandler } from './handlers/ServerHandler';
import { ServerConfig } from './types';
// import config from 'config';

export async function ensureServerIsSet(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.app.locals.currentServerConfig) {
      return res.status(400).json({
        error: 'ServerNotConfigured',
        message: 'Server configuration is required. Please set the server before proceeding.'
      });
    }

    if (!req.serverHandler) {
      const currentServerConfig = req.app.locals.currentServerConfig as ServerConfig;
      req.serverHandler = await ServerHandler.getInstance(currentServerConfig.host);
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'ServerError',
      message: 'Error initializing server handler.'
    });
  }
}

// Middleware to check for API token
export function checkAuthToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // if there's no token

    if (token !== process.env.API_TOKEN) {
        return res.sendStatus(403); // if the token is wrong
    }

    next(); // if the token is correct
}

