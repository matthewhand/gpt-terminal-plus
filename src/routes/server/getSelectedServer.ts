import { Request, Response } from 'express';
import Debug from 'debug';
import { ServerManager } from '../../managers/ServerManager';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:server:getSelectedServer');

/**
 * Function to get the currently selected server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The response object.
 */
export const getSelectedServer = async (req: Request, res: Response) => {
  debug('Received request to get the selected server', { method: req.method, path: req.path });

  try {
    const servers = ServerManager.listAvailableServers();
    const selectedServer = servers.find(server => server.selected);

    if (selectedServer) {
      debug('Selected server found', { selectedServer });
      res.json({ selectedServer });
    } else {
      debug('No selected server found');
      res.status(404).json({ message: 'No selected server found' });
    }
  } catch (error) {
    debug('Error in /get-selected-server', {
      error,
      requestBody: req.body,
      queryParams: req.query,
    });
    handleServerError(error, res, 'Error in /get-selected-server');
  }
};
