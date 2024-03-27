import express, { Request, Response } from 'express';
import { ServerConfigUtils } from '../utils/ServerConfigUtils';
import Debug from 'debug';
import { setSelectedServer as setSelectedServerMiddleware } from '../middlewares';

const debug = Debug('app:serverRoutes');
const router = express.Router();

// Endpoint to list available servers
router.get('/list-servers', async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = ServerConfigUtils.listAvailableServers();
    debug('Listing available servers', { servers: servers.map(server => server.host) });
    res.json({ servers });
  } catch (error) {
    debug('Error in /list-servers', {
      error,
      requestBody: req.body,
      queryParams: req.query,
    });

    if (error instanceof Error) {
      debug(`Internal Server Error: ${error.message}`);
      res.status(500).send('Internal Server Error');
    } else {
      debug('An unknown error occurred during list-servers');
      res.status(500).send('An unknown error occurred');
    }
  }
});

// Endpoint to set the current server
router.post('/set-server', async (req: Request, res: Response) => {
  const { server } = req.body;
  debug(`Received request to set server: ${server}`, { requestBody: req.body });

  try {
    setSelectedServerMiddleware(req, res, async () => {
      debug(`Attempting to get server handler instance for server: ${server}`);
      const serverHandler = await ServerConfigUtils.getInstance(server);
      debug(`ServerHandler instance successfully created for server: ${server}`);

      debug(`Attempting to retrieve system info for server: ${server}`);
      const systemInfo = await serverHandler.getSystemInfo();
      debug(`Successfully retrieved system info for server: ${server}`, { systemInfo });

      res.status(200).json({ message: `Server set to ${server}`, systemInfo });
    });
  } catch (error) {
    debug('Error in /set-server', {
      error,
      requestBody: req.body,
      detailedError: error instanceof Error ? error.message : 'Unknown Error',
    });

    if (error instanceof Error) {
      debug(`Error retrieving system info for server: ${server}, Error: ${error.message}`);
      res.status(500).json({
        message: `Error retrieving system info for server: ${server}`,
        error: error.message,
      });
    } else {
      debug('An unknown error occurred during set-server');
      res.status(500).send('An unknown error occurred');
    }
  }
});

export default router;
