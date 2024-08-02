import express, { Request, Response } from 'express';
import path from 'path';
import Debug from 'debug';
import { escapeRegExp } from '../utils/escapeRegExp';
import { ServerHandler } from '../types/ServerHandler';

const debug = Debug('app:fileRoutes');
const router = express.Router();

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
 * Route to change the default directory.
 */
router.post('/change-directory', async (req: Request, res: Response) => {
  const { directory } = req.body;

  if (!directory) {
    debug('Directory is required but not provided.');
    return res.status(400).json({ error: 'Directory is required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const success = await serverHandler.changeDirectory(directory);
    debug(`Directory change attempted: ${directory}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      output: success ? `Current directory set to ${directory}` : 'Directory does not exist.'
    });
  } catch (err: unknown) {
    debug(`Error setting current folder: ${(err instanceof Error ? err.message : String(err))}`);
    handleServerError(err, res, 'Error setting current folder');
  }
});

/**
 * Route to create or replace a file.
 */
router.post('/create', async (req: Request, res: Response) => {
  const { directory, filename, content, backup = true } = req.body;

  if (!filename || !content) {
    debug('Filename and content are required but not provided.');
    return res.status(400).json({ error: 'Filename and content are required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.isAbsolute(filename) ? filename : path.join(targetDirectory, filename);

    const success = await serverHandler.createFile(targetDirectory, filename, content, backup);
    debug(`File create/replace attempted: ${fullPath}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? 'File created or replaced successfully.' : 'Failed to create or replace file.'
    });
  } catch (err: unknown) {
    debug(`Error in create/replace file: ${(err instanceof Error ? err.message : String(err))}`);
    handleServerError(err, res, 'Error in create/replace file');
  }
});

/**
 * Route to update a file by replacing a pattern with a replacement.
 */
router.post('/update', async (req: Request, res: Response) => {
  const { filePath, pattern, replacement, backup = true, directory } = req.body;

  if (!filePath || !pattern || !replacement) {
    debug('File path, pattern, and replacement are required but not provided.');
    return res.status(400).json({ error: 'File path, pattern, and replacement are required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(targetDirectory, filePath);

    const updateResult = await serverHandler.updateFile(fullPath, escapeRegExp(pattern), replacement, backup);
    debug(`File update attempted: ${fullPath}, pattern: ${pattern}, replacement: ${replacement}, success: ${updateResult}`);

    res.status(updateResult ? 200 : 400).json({
      message: updateResult ? 'File updated successfully.' : 'Failed to update the file.'
    });
  } catch (err: unknown) {
    debug(`Error updating file: ${(err instanceof Error ? err.message : String(err))}`);
    handleServerError(err, res, 'Error updating file');
  }
});

/**
 * Route to amend a file by appending content to it.
 */
router.post('/amend', async (req: Request, res: Response) => {
  const { filePath, content, backup = true, directory } = req.body;

  if (!filePath || !content) {
    debug('File path and content are required but not provided.');
    return res.status(400).json({ error: 'File path and content are required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(targetDirectory, filePath);

    const success = await serverHandler.amendFile(fullPath, content, backup);
    debug(`File amend attempted: ${fullPath}, content: ${content}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? 'File amended successfully.' : 'Failed to amend file.'
    });
  } catch (err: unknown) {
    debug(`Error amending file: ${(err instanceof Error ? err.message : String(err))}`);
    handleServerError(err, res, 'Error amending file');
  }
});

/**
 * Route to list files in a directory.
 */
router.get('/list', async (req: Request, res: Response) => {
  const { directory, limit, offset, orderBy } = req.query as { directory: string, limit?: string, offset?: string, orderBy?: 'datetime' | 'filename' };

  if (!directory) {
    debug('Directory is required but not provided.');
    return res.status(400).json({ error: 'Directory is required' });
  }

  try {
    const serverHandler = getServerHandler(req);
    const files = await serverHandler.listFiles({
      directory,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      orderBy
    });
    debug(`Files listed in directory: ${directory}, files: ${JSON.stringify(files)}`);
    res.status(200).json(files);
  } catch (error) {
    debug(`Error listing files: ${(error instanceof Error ? error.message : 'Unknown error')}`);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export default router;
