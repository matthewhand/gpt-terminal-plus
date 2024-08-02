import { Request, Response } from 'express';
import { ServerHandler } from '../../types/ServerHandler';
import Debug from 'debug';

const debug = Debug('app:command:changeDirectory');

/**
 * Handles server errors by logging and sending a response with the error message.
 * @param {unknown} error - The error that occurred.
 * @param {Response} res - The response object to send the error message.
 * @param {string} debugContext - The context in which the error occurred.
 */
const handleServerError = (error: unknown, res: Response, debugContext: string) => {
  const errorMsg = error instanceof Error ? error.message : 'Unknown error';
  debug(debugContext + ': ' + errorMsg);
  res.status(500).json({ error: errorMsg });
};

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
 * Function to change the working directory on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const changeDirectory = async (req: Request, res: Response) => {
  const { directory } = req.body;

  if (!directory) {
    debug('Directory is required but not provided.');
    return res.status(400).json({ error: 'Directory is required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const success = await serverHandler.changeDirectory(directory);
    debug(`Directory changed to: ${directory}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? 'Directory changed successfully.' : 'Failed to change directory.'
    });
  } catch (err) {
    debug(`Error changing directory: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, 'Error changing directory');
  }
};
