import { Request, Response, NextFunction } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper';
import ServerManager from '../managers/ServerManager';
import { ServerHandler } from '../types/ServerHandler';

export const initializeServerHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const selectedServer = getSelectedServer();
    console.log('Selected server:', selectedServer);  // Enhanced debug statement
    const serverConfig = ServerManager.getServerConfig(selectedServer);
    console.log('Server configuration:', serverConfig);  // Enhanced debug statement
    if (!serverConfig) {
      throw new Error(`Server configuration for host ${selectedServer} not found`);
    }
    const serverManager = new ServerManager(serverConfig);
    const handler = serverManager.createHandler();
    req.serverHandler = handler as ServerHandler;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize server handler', details: (error as Error).message });
  }
};
