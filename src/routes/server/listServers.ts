import { Request, Response } from 'express';
import Debug from 'debug';
import { ServerManager } from '../../managers/ServerManager';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:server:listServers');

/**
 * Function to list available servers.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const listServers = async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = ServerManager.listAvailableServers();
    debug('Listing available servers', { servers: servers.map((server: any) => server.host) });
    res.json({ servers });
  } catch (error) {
    debug('Error in /list-servers', {
      error,
      requestBody: req.body,
      queryParams: req.query,
    });
    handleServerError(error, res, 'Error in /list-servers');
  }
};
