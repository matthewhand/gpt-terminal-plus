import { Request, Response, NextFunction } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper';
import ServerManager from '../managers/ServerManager';
import { ServerHandler } from '../types/ServerHandler';

export const initializeServerHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const selectedServer = getSelectedServer();
    console.log(`Selected server: ${selectedServer}`); // Log selected server
    const serverManager = new ServerManager(selectedServer);
    const handler = serverManager.createHandler();
    req.serverHandler = handler as ServerHandler;
    next();
  } catch (error) {
    console.error('Error initializing server handler:', error); // Log the error
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to initialize server handler', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to initialize server handler', details: String(error) });
    }
  }
};
