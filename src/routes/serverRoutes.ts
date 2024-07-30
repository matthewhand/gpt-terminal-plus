import express, { Request, Response } from 'express';
import { ServerConfigUtils } from '../utils/ServerConfigUtils';
import Debug from 'debug';
import { setSelectedServer, getSelectedServer } from '../utils/GlobalStateHelper';

const debug = Debug('app:serverRoutes');
const router = express.Router();

/**
 * Endpoint to list available servers
 */
router.get('/list-servers', async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = ServerConfigUtils.listAvailableServers();
    debug('Listing available servers', { servers: servers.map((server: any) => server.host) });
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

/**
 * Endpoint to set the current server using global state helper
 */
router.post('/set-server', async (req: Request, res: Response) => {
  const { server } = req.body;
  debug(`Received request to set server: ${server}`, { requestBody: req.body });

  try {
    // Validate the server before setting it
    const serverConfig = ServerConfigUtils.getServerConfig(server);
    if (!serverConfig) {
      throw new Error('Server not in predefined list.');
    }

    // Validate that the protocol is defined
    if (!serverConfig.protocol) {
      throw new Error('Unsupported protocol: undefined');
    }

    // Set the selected server using the global state helper
    setSelectedServer(server);
    debug(`Server set to ${server} using global state helper.`);

    // Fetch the server handler instance using the updated server
    const serverHandler = await ServerConfigUtils.getInstance(getSelectedServer());
    debug(`ServerHandler instance successfully retrieved for server: ${server}`);

    // Attempt to retrieve system info for the updated server
    const systemInfo = await serverHandler.getSystemInfo();
    debug(`Successfully retrieved system info for server: ${server}`, { systemInfo });

    res.status(200).json({ message: `Server set to ${server}`, systemInfo });
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
