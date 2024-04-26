import express, { Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerConfigManager from './ServerConfigManager';
import path from 'path';
import lockfile from 'proper-lockfile';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';
import { escapeRegExp } from '../utils/escapeRegExp'; // Ensure this is correctly imported

const debug = Debug('app:fileRoutes');
const router = express.Router();
router.use(ensureServerIsSet);

async function getServerHandler(): Promise<ServerHandler> {
  const configManager = ServerConfigManager.getInstance();
  const serverConfig = configManager.getServerConfig();
  return ServerHandler.getInstance(serverConfig);
}

const handleServerError = (error: unknown, res: Response, debugContext: string) => {
  const errorMsg = error instanceof Error ? error.message : 'Unknown error';
  debug(`${debugContext}: ${errorMsg}`);
  res.status(500).json({ error: errorMsg });
};

router.get(['/list-files', '/browse-files'], async (req, res) => {
  // Explicitly cast directory to string to ensure type compatibility
  const directory = String(req.query.directory);
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;
  const orderBy = String(req.query.orderBy || 'filename');

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

router.post(['/set-working-directory', '/change-dir'], async (req, res) => {
  const directory = req.body.directory;
  try {
    const serverHandler = await getServerHandler();
    const success = await serverHandler.setWorkingDirectory(directory);
    res.status(success ? 200 : 400).json({ 
      output: success ? `Working directory set to ${directory}` : 'Directory does not exist.'
    });
  } catch (err) {
    handleServerError(err, res, 'Error setting current folder');
  }
});

router.post(['/create-file'], async (req, res) => {
  const { filename, content, backup = true, directory } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getWorkingDirectory();
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

router.post('/update-file', async (req, res) => {
  const { filename, pattern, replacement, backup = true, directory = "" } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getWorkingDirectory();
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
  } catch (err) {
    handleServerError(err, res, 'Error updating file');
  }
});

router.post('/amend-file', async (req, res) => {
  const { filename, content, directory = "" } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getWorkingDirectory();
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
