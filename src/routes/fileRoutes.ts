import express, { Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerConfigManager from './ServerConfigManager';
import path from 'path';
import lockfile from 'proper-lockfile';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';

const debug = Debug('app:fileRoutes');
const router = express.Router();
router.use(ensureServerIsSet);

// Helper function to ensure serverHandler is initialized and log current server
async function getServerHandler(): Promise<ServerHandler | null> {
  try {
    const configManager = ServerConfigManager.getInstance();
    const serverConfig = configManager.getServerConfig();
    const serverHandler = await ServerHandler.getInstance(serverConfig);
    debug(`Server handler initialized for server: ${serverConfig}`);
    return serverHandler;
  } catch (error) {
    debug('Error initializing server handler', { error });
    return null;
  }
}

// Example for one route with detailed error handling
router.post('/set-current-folder', async (req, res) => {
  const directory = req.body.directory;
  debug(`Set current folder request received: ${directory}`);

  const serverHandler = await getServerHandler(req, res);
  if (!serverHandler) return;

  try {
    const success = await serverHandler.setCurrentDirectory(directory);
    debug(`Set current folder result: ${success ? 'Success' : 'Failure'}`);
    if (success) {
      res.status(200).json({ output: 'Current directory set to ' + directory });
    } else {
      res.status(400).json({ 
        error: 'DirectoryNotFound',
        message: 'Directory does not exist.'
      });
    }
  } catch (err) {
    const error = err as Error;
    debug(`Error setting current folder: ${error.message}`);
    res.status(500).json({ 
      error: 'SetCurrentFolderError',
      message: 'Error setting current folder',
      debugInfo: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Combined create or replace a file route
router.post(['/create-file'], async (req, res) => {
  const { filename, content, backup = true, directory } = req.body;
  debug(`Create file request received: ${filename}, in directory: ${directory}`);

  const serverHandler = await getServerHandler(req, res);
  if (!serverHandler) return;

  const targetDirectory = directory || await serverHandler.getCurrentDirectory();
  const fullPath = path.join(targetDirectory, filename);

  try {
    debug(`Attempting to create/replace file: ${fullPath}`);
    const release = await lockfile.lock(fullPath, { realpath: false });

    try {
      const success = await serverHandler.createFile(targetDirectory, filename, content, backup);
      debug(`Create/replace file result: ${success ? 'Success' : 'Failure'}`);
      if (success) {
        res.status(200).json({ message: 'File created or replaced successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to create or replace file.' });
      }
    } finally {
      await release();
    }
  } catch (err) {
    const error = err as Error;
    debug(`Error in create/replace file: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-file', async (req, res) => {
  const { filename, pattern, replacement, backup = true, directory = "" } = req.body;
  const serverHandler = await getServerHandler(req, res);
  if (!serverHandler) return;

  // Validate that none of the parameters are empty
  if (!filename || !pattern || !replacement || !directory.trim()) {
    return res.status(400).json({ error: 'All parameters must be provided and non-empty.' });
  }

  const targetDirectory = directory || await serverHandler.getCurrentDirectory(); // Added await here
  const fullPath = path.join(targetDirectory, filename);

  try {
    // Lock the file
    const release = await lockfile.lock(fullPath);

    try {
      // Perform the file update
      const updateResult = await serverHandler.updateFile(fullPath, escapeRegExp(pattern), replacement, backup); // This is correct
      if (updateResult) {
        res.status(200).json({ message: 'File updated successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to update the file.' });
      }
    } finally {
      // Unlock the file, ignoring any errors during unlock
      await release();
    }
  } catch (err) {
    // Handle error
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Amend a file
router.post('/amend-file', async (req, res) => {
  const { filename, content, directory = "" } = req.body;
  const serverHandler = await getServerHandler(req, res); 
  if (!serverHandler) return;

  const targetDirectory = directory || await serverHandler.getCurrentDirectory(); 
  const fullPath = path.join(targetDirectory, filename);

  try {
    // Lock the file to prevent concurrent writes
    const release = await lockfile.lock(fullPath, { realpath: false });

    try {
      // Perform the file amendment
      const success = await serverHandler.amendFile(fullPath, content);
      if (success) {
        res.status(200).json({ message: 'File amended successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to amend file.' });
      }
    } finally {
      // Always release the lock
      await release();
    }
  } catch (err) {
    // If locking fails, respond with the error message
    res.status(500).json({ error: err instanceof Error ? err.message : 'Locking failed' });
  }
});

export default router;
