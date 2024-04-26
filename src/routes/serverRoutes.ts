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

    // Attempt to retrieve system information without failing the request if it fails
    let systemInfo = {};
    try {
      systemInfo = await serverHandler.getSystemInfo();
      debug(`Retrieved system info for server: ${server}`, { systemInfo });
    } catch (error) {
      debug('Failed to retrieve system info, proceeding without it:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        server
      });
      // Optionally add this to the response if needed
      systemInfo = { error: 'Failed to retrieve system information, but server set successfully.' };
    }

    res.status(200).json({ output: `Server set to ${server}`, systemInfo });
  } catch (error: unknown) {
    debug('Error in /set-server during setup', {
      error,
      requestBody: req.body
    });

    if (error instanceof Error) {
      res.status(500).json({
        output: 'Error setting server',
        error: error.message
      });
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});

export default router;
