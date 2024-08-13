import { Request, Response } from 'express';
import Debug from 'debug';
import { setSelectedServer as setServerHelper } from '../../utils/GlobalStateHelper';
import { ServerManager } from '../../managers/ServerManager';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:server:setSelectedServer');

export const setServer = async (req: Request, res: Response) => {
  const { server } = req.body;
  debug('Received request to set server: ' + server, { requestBody: req.body });

  try {
    const serverConfig = ServerManager.getServerConfig(server);
    if (!serverConfig) {
      throw new Error('Server not in predefined list.');
    }

    if (!serverConfig.protocol) {
      throw new Error('Unsupported protocol: undefined');
    }

    setServerHelper(serverConfig.hostname);
    debug('Server set to ' + serverConfig.hostname + ' using global state helper.');

    const serverManager = new ServerManager(serverConfig.hostname);

    const ServerHandler = serverManager.createHandler();
    ServerHandler.setServerConfig(serverConfig);
    debug('ServerHandler instance successfully retrieved for server: ' + serverConfig.hostname);

    res.status(200).json({ message: 'Server set to ' + serverConfig.hostname });
  } catch (error) {
    debug('Error in /server/set', {
      error,
      requestBody: req.body,
      detailedError: error instanceof Error ? error.message : 'Unknown Error',
    });
    handleServerError(error, res, 'Error in /server/set');
  }
};
