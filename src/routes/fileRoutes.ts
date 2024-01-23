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

router.post('/set-current-folder', async (req, res) => {
  const directory = req.body.directory;
  try {
    const serverHandler = await getServerHandler();
    const success = await serverHandler.setCurrentDirectory(directory);
    res.status(success ? 200 : 400).json({ 
      output: success ? `Current directory set to ${directory}` : 'Directory does not exist.'
    });
  } catch (err) {
    handleServerError(err, res, 'Error setting current folder');
  }
});

router.post(['/create-file'], async (req, res) => {
  const { filename, content, backup = true, directory } = req.body;
  try {
    const serverHandler = await getServerHandler();
    const targetDirectory = directory || await serverHandler.getCurrentDirectory();
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
    const targetDirectory = directory || await serverHandler.getCurrentDirectory();
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
    const targetDirectory = directory || await serverHandler.getCurrentDirectory();
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
