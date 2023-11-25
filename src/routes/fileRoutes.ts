import express, { Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import { ServerConfig } from '../types';
import { escapeRegExp } from '../utils/escapeRegExp';
import path from 'path';
import config from 'config';
import lockfile from 'proper-lockfile';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';
const debug = Debug('app:fileRoutes');
const router = express.Router();
router.use(ensureServerIsSet);

const serverConfig = config.get<ServerConfig>('serverConfig');

// Helper function to ensure serverHandler is initialized
async function getServerHandler(res: Response): Promise<ServerHandler | null> {
  try {
    // Use the host property from serverConfig to get the instance
    const serverHandler = await ServerHandler.getInstance(serverConfig.host);
    return serverHandler;
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server handler not initialized' });
    return null;
  }
}

// Set the current directory
router.post('/set-current-folder', async (req, res) => {
  const directory = req.body.directory;
  const serverHandler = await getServerHandler(res);
  if (!serverHandler) return;

  try {
    const success = await serverHandler.setCurrentDirectory(directory);
    if (success) {
      res.status(200).json({ output: 'Current directory set to ' + directory });
    } else {
      res.status(400).json({ output: 'Directory does not exist.' });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
  
});

// Combined create or replace a file route
router.post(['/create-file'], async (req, res) => {
  const { filename, content, backup = true, directory } = req.body;
  const serverHandler = await getServerHandler(res);
  if (!serverHandler) return;

  const targetDirectory = directory || await serverHandler.getCurrentDirectory();
  const fullPath = path.join(targetDirectory, filename);

  try {
    // Lock the file to prevent concurrent writes
    const release = await lockfile.lock(fullPath, { realpath: false });

    try {
      // Perform the file creation or replacement
      const success = await serverHandler.createFile(targetDirectory, filename, content, backup);
      if (success) {
        res.status(200).json({ message: 'File created or replaced successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to create or replace file.' });
      }
    } finally {
      // Always release the lock
      await release();
    }
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});


router.post('/update-file', async (req, res) => {
  const { filename, pattern, replacement, backup = true, directory = "" } = req.body;
  const serverHandler = await getServerHandler(res); // Added await here
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
  const serverHandler = await getServerHandler(res); 
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

router.post('/list-files', async (req, res) => {
  const { directory, orderBy = 'filename', limit = 42, offset = 0 } = req.body;
  const serverHandler = await getServerHandler(res); // Make sure to await the Promise here
  if (!serverHandler) return;

  try {
    // Perform the list files operation
    const files = await serverHandler.listFiles(directory, limit, offset, orderBy); 
    res.status(200).json({ files });
  } catch (err) {
    // If an error occurs, respond with the error message
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});


export default router;
