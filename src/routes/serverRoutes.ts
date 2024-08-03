import express, { Request, Response } from 'express';
import Debug from 'debug';
import { setSelectedServer } from '../utils/GlobalStateHelper';
import { ServerManager } from '../managers/ServerManager'; // Updated import path
import { ServerHandler } from '../types/ServerHandler'; // Import ServerHandler

const debug = Debug('app:serverRoutes');
const router = express.Router();

/**
 * Endpoint to list available servers
 */
router.get('/list', async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = ServerManager.listAvailableServers();
    debug('Listing available servers', { servers: servers.map(server => server.host) });
    res.json({ servers });
  } catch (error) {
    debug('Error in /list-servers', {
      error,
      requestBody: req.body,
      queryParams: req.query,
    });

    if (error instanceof Error) {
      debug('Internal Server Error: ' + error.message);
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
router.post('/set', async (req: Request, res: Response) => {
  const { server, getSystemInfo = true } = req.body;
  debug('Received request to set server: ' + server, { requestBody: req.body });

  try {
    // Validate the server before setting it
    const serverConfig = ServerManager.getServerConfig(server);
    if (!serverConfig) {
      throw new Error('Server not in predefined list.');
    }

    // Validate that the protocol is defined
    if (!serverConfig.protocol) {
      throw new Error('Unsupported protocol: undefined');
    }

    // Set the selected server using the global state helper
    setSelectedServer(server);
    debug('Server set to ' + server + ' using global state helper.');

    // Create an instance of ServerManager
    const serverManager = new ServerManager(serverConfig);

    // Fetch the server handler instance using the updated server
    const serverHandler = serverManager.createHandler();
    serverHandler.setServerConfig(serverConfig); // Set the server config
    debug('ServerHandler instance successfully retrieved for server: ' + server);

    let systemInfo = null;
    if (getSystemInfo) {
      systemInfo = await serverHandler.getSystemInfo();
    }

    res.status(200).json({ message: 'Server set to ' + server, systemInfo });
  } catch (error) {
    debug('Error in /server/set', {
      error,
      requestBody: req.body,
      detailedError: error instanceof Error ? error.message : 'Unknown Error',
    });

    if (error instanceof Error) {
      debug('Error setting server: ' + server + ', Error: ' + error.message);
      res.status(500).json({
        message: 'Error setting server: ' + server,
        error: error.message,
      });
    } else {
      debug('An unknown error occurred during set-server');
      res.status(500).send('An unknown error occurred');
    }
  }
});

/**
 * Endpoint to get system info for the current server
 */
router.get('/system-info', async (req: Request, res: Response) => {
  try {
    const serverHandler = getServerHandler(req);
    const systemInfo = await serverHandler.getSystemInfo();
    res.status(200).json(systemInfo);
  } catch (error) {
    const errorMessage = 'Error retrieving system info: ' + (error instanceof Error ? error.message : 'Unknown error');
    debug(errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

/**
 * Safely gets the server handler from the request.
 * @param {Request} req - The request object.
 * @returns {ServerHandler} - The server handler.
 * @throws {Error} - If the server handler is not found.
 */
const getServerHandler = (req: Request): ServerHandler => {
  const serverHandler = req.serverHandler as ServerHandler | undefined;
  if (!serverHandler) {
    throw new Error('Server handler not found on request object');
  }
  return serverHandler;
};

export default router;

// OpenAPI Specification
const openAPISpec = `
openapi: 3.1.0
info:
  title: Server Routes API
  version: 1.0.0
paths:
  /server/list:
    get:
      summary: List available servers
      responses:
        '200':
          description: A list of servers
  /server/set:
    post:
      summary: Set the current server
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                server:
                  type: string
                getSystemInfo:
                  type: boolean
              required:
                - server
      responses:
        '200':
          description: Server set successfully
  /server/system-info:
    get:
      summary: Get system info for the current server
      responses:
        '200':
          description: System info retrieved successfully
`;

console.debug('OpenAPI Specification:', openAPISpec);
