import { Request, Response, NextFunction } from 'express';
import { ServerHandler } from './handlers/ServerHandler';
import { ServerConfig } from './types';
import config from 'config';

export async function ensureServerIsSet(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.serverHandler) {
      const serverConfigs: ServerConfig[] = config.get('serverConfig');
      const serverConfig = serverConfigs[0]; // Default to the first configured server
      const host = serverConfig.host;
      req.serverHandler = await ServerHandler.getInstance(host);
    }
    next();
  } catch (error) {
    next(error); // Pass the error to the next error handling middleware
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

