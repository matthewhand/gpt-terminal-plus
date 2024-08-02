import path from 'path';
import Debug from 'debug';
import { Request, Response } from 'express';
import { ServerHandler } from '../../types/ServerHandler';

const debug = Debug('app:file:amend');

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
 * Function to amend a file by appending content to it.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const amendFile = async (req: Request, res: Response) => {
  const { directory, filename, content, backup = true } = req.body;

  if (!filename || content === undefined) {
    debug('Filename and content are required but not provided.');
    return res.status(400).json({ error: 'Filename and content are required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.isAbsolute(filename) ? filename : path.join(targetDirectory, filename);

    const success = await serverHandler.amendFile(fullPath, content, backup);
    debug(`File amended: ${fullPath}, content: ${content}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? 'File amended successfully.' : 'Failed to amend file.'
    });
  } catch (err) {
    debug(`Error amending file: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, 'Error amending file');
  }
};
