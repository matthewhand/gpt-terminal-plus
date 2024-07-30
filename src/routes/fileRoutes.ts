import express, { Router, Request, Response } from 'express';
import path from 'path';
import lockfile from 'proper-lockfile';
import Debug from 'debug';
import { escapeRegExp } from '../utils/escapeRegExp';

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
  debug(debugContext + ": " + errorMsg);
  res.status(500).json({ error: errorMsg });
};

/**
 * Route to change the default directory.
 */
router.post('/change-directory', async (req: Request, res: Response) => {
  const { directory } = req.body;
  try {
    const serverHandler = req.serverHandler;
    if (!serverHandler) {
      throw new Error('Server handler not found on request object');
    }
    const success = serverHandler.changeDirectory(directory);
    res.status(success ? 200 : 400).json({ 
      output: success ? "Current directory set to " + directory : 'Directory does not exist.'
    });
  } catch (err: unknown) {
    debug("Error setting current folder: " + (err instanceof Error ? err.message : String(err)));
    handleServerError(err, res, 'Error setting current folder');
  }
});

/**
 * Route to create or replace a file.
 */
router.post('/create-file', async (req: Request, res: Response) => {
  const { filename, content, backup = true, directory } = req.body;
  try {
    const serverHandler = req.serverHandler;
    if (!serverHandler) {
      throw new Error('Server handler not found on request object');
    }
    if (typeof serverHandler.createFile !== 'function') {
      throw new Error('createFile method not found on server handler');
    }
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.join(targetDirectory, filename);
    const release = await lockfile.lock(fullPath, { realpath: false });
    try {
      const success = await serverHandler.createFile(targetDirectory, filename, content, backup);
      res.status(success ? 200 : 400).json({ 
        message: success ? 'File created or replaced successfully.' : 'Failed to create or replace file.'
      });
    } finally {
      await release();
    }
  } catch (err: unknown) {
    debug("Error in create/replace file: " + (err instanceof Error ? err.message : String(err)));
    handleServerError(err, res, 'Error in create/replace file');
  }
});

/**
 * Route to update a file by replacing a pattern with a replacement.
 */
router.post('/update-file', async (req: Request, res: Response) => {
  const { filename, pattern, replacement, backup = true, directory = "" } = req.body;
  try {
    const serverHandler = req.serverHandler;
    if (!serverHandler) {
      throw new Error('Server handler not found on request object');
    }
    if (typeof serverHandler.updateFile !== 'function') {
      throw new Error('updateFile method not found on server handler');
    }
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.join(targetDirectory, filename);
    const release = await lockfile.lock(fullPath);
    try {
      const updateResult = await serverHandler.updateFile(fullPath, escapeRegExp(pattern), replacement, backup);
      res.status(updateResult ? 200 : 400).json({ 
        message: updateResult ? 'File updated successfully.' : 'Failed to update the file.'
      });
    } finally {
      await release();
    }
  } catch (err: unknown) {
    debug("Error updating file: " + (err instanceof Error ? err.message : String(err)));
    handleServerError(err, res, 'Error updating file');
  }
});

/**
 * Route to amend a file by appending content to it.
 */
router.post('/amend-file', async (req: Request, res: Response) => {
  const { filename, content, directory = "" } = req.body;
  try {
    const serverHandler = req.serverHandler;
    if (!serverHandler) {
      throw new Error('Server handler not found on request object');
    }
    if (typeof serverHandler.amendFile !== 'function') {
      throw new Error('amendFile method not found on server handler');
    }
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.join(targetDirectory, filename);
    const release = await lockfile.lock(fullPath, { realpath: false });
    try {
        const success = await serverHandler.amendFile(fullPath, content);
        res.status(success ? 200 : 400).json({
            message: success ? 'File amended successfully.' : 'Failed to amend file.'
        });
    } finally {
        await release();
    }
  } catch (err: unknown) {
    debug("Error amending file: " + (err instanceof Error ? err.message : String(err)));
    handleServerError(err, res, 'Error amending file');
  }
});

export default router;
