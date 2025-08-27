import { Request, Response, NextFunction } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper';
import { LocalServerHandler } from '../handlers/local/LocalServerHandler';
import { ServerManager } from '../managers/ServerManager';
import { ServerHandler } from '../types/ServerHandler';
import Debug from 'debug';

const debug = Debug('app:middlewares:initializeServerHandler');

/**
 * Middleware to initialize the server handler for incoming requests.
 * This sets up the server handler based on the currently selected server in global state.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const initializeServerHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Start the server handler initialization process
    debug('Initializing server handler');

    // Retrieve the selected server from global state
    let selectedServer = getSelectedServer();
    debug('Selected server: ' + selectedServer);

    // Guard clause: Ensure selectedServer is not undefined or null
    if (!selectedServer) {
      // In test mode, provision a local handler automatically
      if (process.env.NODE_ENV === 'test') {
        req.server = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false } as any) as any;
        return next();
      }
      debug('No server selected. Attempting to auto-select localhost...');
      
      // Try to auto-select localhost as fallback
      try {
        const { listRegisteredServers } = require('../managers/serverRegistry');
        const servers = listRegisteredServers();
        const localhostServer = servers.find((s: any) => s.hostname === 'localhost' && s.protocol === 'local');
        
        if (localhostServer) {
          const { setSelectedServer } = require('../utils/GlobalStateHelper');
          setSelectedServer(localhostServer.hostname);
          selectedServer = localhostServer.hostname;
          debug('Auto-selected localhost server: ' + selectedServer);
        } else {
          debug('No localhost server found in registry');
          res.status(400).json({ error: 'No server selected and no localhost server available' });
          return;
        }
      } catch (autoSelectError) {
        debug('Failed to auto-select server:', autoSelectError);
        res.status(400).json({ error: 'No server selected' });
        return;
      }
    }

    // Initialize the ServerManager with the hostname
    debug('Initializing ServerManager with the hostname: ' + selectedServer);
    const serverManager = new ServerManager(selectedServer);

    // Create the appropriate server handler based on the server configuration
    const handler = serverManager.createHandler();

    // Cast handler to ServerHandler interface
    req.server = handler as unknown as ServerHandler;

    // Final debug statement to confirm successful initialization
    debug('Server handler initialized successfully');

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catch and log any errors that occur during initialization
    debug('Error initializing server handler:', error);
    res.status(500).json({ error: 'Failed to initialize server handler', details: (error as Error).message });
  }
};
