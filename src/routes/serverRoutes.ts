/**
 * Server Routes Module
 * ====================
 * 
 * Overview:
 * ---------
 * This module defines the HTTP endpoints for server-related operations within the application,
 * including listing available servers and setting the current server for subsequent operations.
 * It leverages express.js for routing and integrates with a Server Configuration Utility to manage
 * server configurations and state. A significant aspect of this module is its use of a global state
 * helper to set and retrieve the currently selected server, ensuring a consistent server context
 * across different parts of the application.
 * 
 * ----------
 * 1. GET /list-servers
 *    Lists all available servers configured in the application. It retrieves server information from the
 *    ServerConfigUtils module and returns it in a structured JSON format.
 * 
 * 2. POST /set-server
 *    Sets the currently active server for the application. It accepts a server identifier in the request body,
 *    updates the global state accordingly, retrieves the server handler for the specified server, and attempts to
 *    fetch system information for the newly selected server. This endpoint is crucial for operations that require
 *    context about the current server, such as executing commands or retrieving system information.
 * 
 */

import express, { Request, Response } from 'express';
import { ServerConfigUtils } from '../utils/ServerConfigUtils';
import Debug from 'debug';
// Import the global state helper functions
import { setSelectedServer, getSelectedServer } from '../utils/GlobalStateHelper';

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

// Updated Endpoint to set the current server using global state helper
router.post('/set-server', async (req: Request, res: Response) => {
  const { server } = req.body;
  debug(`Received request to set server: ${server}`, { requestBody: req.body });

  try {
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
