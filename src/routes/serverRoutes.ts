import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerConfigManager from './ServerConfigManager';
import Debug from 'debug';

const debug = Debug('app:serverRoutes');
const router = express.Router();

// Endpoint to list available servers
router.get('/list-servers', async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = await ServerHandler.listAvailableServers();
    debug('Listing available servers', { servers });
    res.json({ servers });
  } catch (error: unknown) {
    debug('Error in /list-servers', {
      error,
      requestBody: req.body,
      queryParams: req.query
    });

    if (error instanceof Error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});

// Endpoint to set the current server
router.post('/set-server', async (req: Request, res: Response) => {
  const { server } = req.body;
  debug(`Received request to set server: ${server}`, { requestBody: req.body });

  try {
    const serverHandler = await ServerHandler.getInstance(server);
    debug(`ServerHandler instance created for server: ${server}`);

    const configManager = ServerConfigManager.getInstance();
    configManager.setServerConfig(server);

    const systemInfo = await serverHandler.getSystemInfo();
    debug(`Retrieved system info for server: ${server}`, { systemInfo });

    res.status(200).json({ output: `Server set to ${server}`, systemInfo });
  } catch (error: unknown) {
    debug('Error in /set-server', {
      error,
      requestBody: req.body
    });

    if (error instanceof Error) {
      res.status(500).json({
        output: 'Error retrieving system info',
        error: error.message
      });
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});

export default router;
