import { Request, Response } from 'express';
import { ServerHandler } from '../../types/ServerHandler';
import Debug from 'debug';

const debug = Debug('app:command:execute');

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
 * Function to execute a command on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeCommand = async (req: Request, res: Response) => {
  const { command } = req.body;

  if (!command) {
    debug('Command is required but not provided.');
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const result = await serverHandler.executeCommand(command);
    debug(`Command executed: ${command}, result: ${result}`);
    res.status(200).json({ result });
  } catch (err) {
    debug(`Error executing command: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, 'Error executing command');
  }
};
