import { Request, Response } from 'express';
import Debug from 'debug';
import { setSelectedServer as setServerHelper } from '../../utils/GlobalStateHelper';
import { ServerManager } from '../../managers/ServerManager';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:server:setSelectedServer');

/**
 * Function to set the selected server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The response object.
 */
export const setServer = async (req: Request, res: Response) => {
  const { server } = req.body;
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
    setServerHelper(server);
    debug('Server set to ' + server + ' using global state helper.');

    // Create an instance of ServerManager
    const serverManager = new ServerManager(serverConfig);

    // Fetch the server handler instance using the updated server
    const ServerHandler = serverManager.createHandler();
    ServerHandler.setServerConfig(serverConfig); // Set the server config
    debug('ServerHandler instance successfully retrieved for server: ' + server);

    res.status(200).json({ message: 'Server set to ' + server });
  } catch (error) {
    debug('Error in /server/set', {
      error,
      requestBody: req.body,
      detailedError: error instanceof Error ? error.message : 'Unknown Error',
    });
    handleServerError(error, res, 'Error in /server/set');
  }
};
