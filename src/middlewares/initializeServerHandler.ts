import { Request, Response, NextFunction } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper';
import ServerManager from '../managers/ServerManager';
import { ServerHandler } from '../types/ServerHandler';
import Debug from 'debug';

const debug = Debug('app:middlewares:initializeServerHandler');

export const initializeServerHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    debug('Initializing server handler');
    const selectedServer = getSelectedServer();
    debug('Selected server:', selectedServer);
    const serverConfig = ServerManager.getServerConfig(selectedServer);
    debug('Server configuration:', serverConfig);
    if (!serverConfig) {
      throw new Error(`Server configuration for host ${selectedServer} not found`);
    }
    const serverManager = new ServerManager(serverConfig);
    const handler = serverManager.createHandler();
    req.server = handler as ServerHandler;
    debug('Server handler initialized');
    next();
  } catch (error) {
    debug('Error initializing server handler:', error);
    res.status(500).json({ error: 'Failed to initialize server handler', details: (error as Error).message });
  }
};
