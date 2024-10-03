import express, { Request, Response } from 'express';
import Debug from 'debug';
import { setSelectedServer } from '../utils/GlobalStateHelper';
import { ServerManager } from '../managers/ServerManager';
import { getServerHandler } from '../utils/getServerHandler';
import { LocalServerHandler } from '../handlers/local/LocalServerHandler';

const debug = Debug('app:serverRoutes');
const router = express.Router();

/**
 * Endpoint to set the current server using global state helper
 */
router.post('/set', async (req: Request, res: Response) => {
  const { server, getSystemInfo = true } = req.body;
  debug('Received request to set server: ' + server, { requestBody: req.body });

  if (!server) {
    return res.status(400).json({ message: 'Invalid request. Missing "server" field.' });
  }

  try {
    const serverConfig = ServerManager.getServerConfig(server);
    if (!serverConfig) {
      debug('Server not found in predefined list.');
      return res.status(404).json({ message: 'Server not found in predefined list.' });
    }

    setSelectedServer(serverConfig.hostname || 'localhost');
    debug('Server set to ' + (serverConfig.hostname || 'localhost') + ' using global state helper.');

    const serverManager = new ServerManager(serverConfig.hostname || 'localhost');
    const handler = serverManager.createHandler();

    if (handler instanceof LocalServerHandler) {
      handler.setServerConfig(serverConfig);
    }

    let systemInfo = null;
    if (getSystemInfo) {
      try {
        systemInfo = await handler.getSystemInfo();
      } catch (error) {
        debug('Error fetching system info: ' + (error as Error).message);
        return res.status(500).json({ message: 'Error fetching system info.', error: (error as Error).message });
      }
    }

    res.status(200).json({ message: 'Server set to ' + (serverConfig.hostname || 'localhost'), systemInfo });
  } catch (error) {
    debug('Error in /server/set', {
      error,
      requestBody: req.body,
      detailedError: error instanceof Error ? error.message : 'Unknown Error',
    });

    if (error instanceof Error) {
      debug('Error setting server: ' + server + ', Error: ' + error.message);
      res.status(500).json({ message: 'Error setting server: ' + server, error: error.message });
    } else {
      debug('An unknown error occurred during set-server');
      res.status(500).send('An unknown error occurred');
    }
  }
});

export default router;
