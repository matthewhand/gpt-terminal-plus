import { Request, Response } from 'express';
import { ServerManager } from '../../managers/ServerManager';
import Debug from 'debug';

const debug = Debug('app:setServer');

/**
 * Sets the server using ServerManager and handles the request/response.
 */
export const setServer = (req: Request, res: Response): void => {
  const { hostname } = req.body;

  if (!hostname || typeof hostname !== 'string') {
    res.status(400).json({ message: 'Invalid hostname provided.' });
    return;
  }

  try {
    const serverManager = ServerManager.getInstance();
    const serverConfig = serverManager.getServerConfig(hostname);
    if (!serverConfig) {
      res.status(404).json({ message: `Server not found: ${hostname}` });
      return;
    }
    debug('Server set to:', hostname);
    res.status(200).json({ message: `Server set to: ${hostname}` });
  } catch (error) {
    debug('Error setting server:', error);
    res.status(500).json({ message: 'Failed to set server.', error: (error as Error).message });
  }
};
