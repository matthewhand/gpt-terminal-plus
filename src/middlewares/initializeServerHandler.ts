import { Request, Response, NextFunction } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper';
import ServerManager from '../managers/ServerManager';
import { ServerHandler } from '../types/ServerHandler';
import Debug from 'debug';

const debug = Debug('app:middlewares:initializeServerHandler');

export const initializeServerHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Start the server handler initialization process
    debug('Initializing server handler');
    
    // Retrieve the selected server from global state
    const selectedServer = getSelectedServer();
    debug(`Selected server: ${selectedServer}`);

    // Guard clause: Ensure selectedServer is not undefined or null
    if (!selectedServer) {
      debug('No server selected. Cannot proceed with server initialization.');
      res.status(400).json({ error: 'No server selected' });
      return;  // Ensure the function exits here
    }

    // Attempt to retrieve the server configuration based on the selected server
    let serverConfig = ServerManager.getServerConfig(selectedServer);
    debug('Server configuration:', serverConfig);

    // If server configuration is not found, load the default localhost configuration
    if (!serverConfig) {
      debug(`Server configuration for host ${selectedServer} not found. Loading default localhost configuration.`);
      serverConfig = ServerManager.getDefaultConfig(selectedServer);
    }

    // Guard clause: Ensure serverConfig is defined before proceeding
    if (!serverConfig) {
      debug('Failed to load both the specified and default server configurations.');
      res.status(500).json({ error: 'Server configuration is undefined' });
      return;  // Ensure the function exits here
    }

    // Initialize the ServerManager with the resolved configuration
    debug(`Initializing ServerManager with the following configuration: ${JSON.stringify(serverConfig)}`);
    const serverManager = new ServerManager(serverConfig);

    // Create the appropriate server handler based on the server configuration
    const handler = serverManager.createHandler();
    req.server = handler as ServerHandler;

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
