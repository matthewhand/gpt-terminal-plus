import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import path from 'path';
import lockfile from 'proper-lockfile';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';
import { escapeRegExp } from '../utils/escapeRegExp';
import ServerConfigManager from '../managers/ServerConfigManager';

const debug = Debug('app:fileRoutes');
const router = express.Router();
router.use(ensureServerIsSet);

async function getServerHandler(): Promise<ServerHandler> {
  const configManager = ServerConfigManager.getInstance();
  const serverConfig = configManager.getServerConfig();
  if (!serverConfig) {
    throw new Error('Server is not set.');
  }
  return ServerHandler.getInstance(serverConfig.host);
}

const handleServerError = (error: unknown, res: Response, debugContext: string) => {
  const errorMsg = error instanceof Error ? error.message : 'Unknown error';
  debug(`${debugContext}: ${errorMsg}`);
  res.status(500).json({ error: errorMsg });
};

/**
 * @swagger
 * /list-files:
 *   get:
 *     description: List files in a specified directory
 *     parameters:
 *       - name: directory
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: offset
 *         in: query
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: orderBy
 *         in: query
 *         schema:
 *           type: string
 *           default: filename
 *     responses:
 *       200:
 *         description: A list of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get(['/list-files', '/browse-files'], async (req: Request, res: Response) => {
  const directory = req.query.directory as string;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const orderBy = (req.query.orderBy as string) || 'filename';

  if (!directory) {
    return res.status(400).json({ error: 'Directory parameter is required' });
  }

  try {
    const serverHandler = await getServerHandler();
    const files = await serverHandler.listFiles(directory, limit, offset, orderBy);
    res.json(files);
  } catch (err) {
    handleServerError(err, res, 'Error listing files');
  }
});

/**
 * @swagger
 * /set-default-directory:
 *   post:
 *     description: Set the default directory for the server
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               directory:
 *                 type: string
 *                 description: The directory to set as the default
 *     responses:
 *       200:
 *         description: Default directory set successfully
 *       400:
 *         description: Bad request, directory parameter is missing or invalid
 */
router.post(['/set-default-directory', '/change-directory'], async (req: Request, res: Response) => {
  const { directory } = req.body;

  if (!directory) {
    return res.status(400).json({ error: 'Directory parameter is missing.' });
  }

  try {
    const serverHandler = await getServerHandler();
    const success = await serverHandler.setDefaultDirectory(directory);
    if (success) {
      res.status(200).json({ output: `Default directory set to ${directory}` });
    } else {
      res.status(400).json({ error: 'Directory does not exist.' });
    }
  } catch (err) {
    handleServerError(err, res, 'Error setting current folder');
  }
});

/**
 * @swagger
 * /create-file:
 *   post:
 *     description: Create or replace a file in the specified directory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: The name of the file to create or replace
 *               content:
 *                 type: string
 *                 description: The content to write to the file
 *               backup:
 *                 type: boolean
 *                 description: Whether to backup the existing file before creating or replacing the new one
 *                 default: true
 *               directory:
 *                 type: string
 *                 description: The directory to create the file in, defaults to the server's default directory
 *     responses:
 *       200:
 *         description: File created or replaced successfully
 *       400:
 *         description: Failed to create or replace file
 */
router.post('/create-file', async (req: Request, res: Response) => {
  const { filename, content, backup = true, directory } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getDefaultDirectory();
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
  } catch (err) {
    handleServerError(err, res, 'Error in create/replace file');
  }
});

/**
 * @swagger
 * /update-file:
 *   post:
 *     description: Update an existing file in the specified directory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: The name of the file to update
 *               pattern:
 *                 type: string
 *                 description: The text pattern to replace in the file
 *               replacement:
 *                 type: string
 *                 description: The new text to replace the pattern with
 *               backup:
 *                 type: boolean
 *                 description: Whether to backup the existing file before updating it
 *                 default: true
 *               directory:
 *                 type: string
 *                 description: The directory of the file to update, defaults to the server's default directory
 *     responses:
 *       200:
 *         description: File updated successfully
 *       400:
 *         description: Failed to update the file
 */
router.post('/update-file', async (req: Request, res: Response) => {
  const { filename, pattern, replacement, backup = true, directory } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getDefaultDirectory();
    const fullPath = path.join(targetDirectory, filename);
    const release = await lockfile.lock(fullPath, { realpath: false });
    try {
      const updateResult = await serverHandler.updateFile(fullPath, escapeRegExp(pattern), replacement, backup);
      res.status(updateResult ? 200 : 400).json({ 
        message: updateResult ? 'File updated successfully.' : 'Failed to update the file.'
      });
    } finally {
      await release();
    }
  } catch (err) {
    handleServerError(err, res, 'Error updating file');
  }
});

/**
 * @swagger
 * /amend-file:
 *   post:
 *     description: Amend an existing file by appending content to it
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: The name of the file to amend
 *               content:
 *                 type: string
 *                 description: The content to append to the file
 *               directory:
 *                 type: string
 *                 description: The directory of the file to amend, defaults to the server's default directory
 *     responses:
 *       200:
 *         description: File amended successfully
 *       400:
 *         description: Failed to amend file
 */
router.post('/amend-file', async (req: Request, res: Response) => {
  const { filename, content, directory } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getDefaultDirectory();
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
  } catch (err) {
    handleServerError(err, res, 'Error amending file');
  }
});

export default router;
