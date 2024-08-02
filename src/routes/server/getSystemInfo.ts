import { Request, Response } from 'express';
import Debug from 'debug';
import { ServerHandler } from '../../types/ServerHandler';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:server:getSystemInfo');

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

/**
 * Function to get system info for the current server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getSystemInfo = async (req: Request, res: Response) => {
  try {
    const serverHandler = getServerHandler(req);
    const systemInfo = await serverHandler.getSystemInfo();
    res.status(200).json(systemInfo);
  } catch (error) {
    debug(`Error retrieving system info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    handleServerError(error, res, 'Error retrieving system info');
  }
};
