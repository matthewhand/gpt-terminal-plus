import express from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerHandlerSingleton from '../services/serverHandlerInstance';
import { ServerConfig } from '../handlers/types'
import { escapeRegExp } from '../utils/escapeRegExp';
import path from 'path';
import { Response } from 'express';
import config from 'config';

const router = express.Router();
const serverConfig = config.get<ServerConfig>('ServerConfig'); // Assuming ServerConfig is a type you have defined

// Helper function to ensure serverHandler is initialized
function getServerHandler(res: Response): ServerHandler | null {
  const serverHandler = ServerHandlerSingleton.getInstance(serverConfig);
  if (!serverHandler) {
    res.status(500).json({ error: 'Server handler not initialized' });
    return null;
  }
  return serverHandler;
}

// Set the current directory
router.post('/set-current-folder', async (req, res) => {
  const directory = req.body.directory;
  const serverHandler = getServerHandler(res);
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
// Create or replace a file
router.post(['/create-file', '/create-or-replace-file'], async (req, res) => {
  const { filename, content, backup = true, directory = "" } = req.body;
  const serverHandler = getServerHandler(res);
  if (!serverHandler) return;

  const targetDirectory = directory || serverHandler.getCurrentDirectory();

  serverHandler.createFile(targetDirectory, filename, content, backup)
    .then(() => res.status(200).json({ message: 'File created or replaced successfully.' }))
    .catch((err: Error) => res.status(500).json({ error: err.message }));
});

// Update a file
router.post('/update-file', async (req, res) => {
  const { relative, pattern, replacement, backup = true, directory = "" } = req.body;
  const serverHandler = getServerHandler(res);
  if (!serverHandler) return;

  const targetDirectory = directory || serverHandler.getCurrentDirectory();

  serverHandler.updateFile(path.join(targetDirectory, relative), escapeRegExp(pattern), replacement, backup)
    .then(() => res.status(200).json({ message: 'File updated successfully.' }))
    .catch((err: Error) => res.status(500).json({ error: err.message }));
});

// List files in a directory
router.post('/list-files', async (req, res) => {
  const { directory, orderBy, limit = 42, offset = 0 } = req.body;
  const serverHandler = getServerHandler(res);
  if (!serverHandler) return;

  serverHandler.listFiles(directory, orderBy, limit, offset)
  .then((files: string[]) => res.status(200).json({ files }))
  .catch((err: Error) => res.status(500).json({ error: err.message }));
});

// Amend a file
router.post('/amend-file', async (req, res) => {
  const { filename, content, directory = "" } = req.body;
  const serverHandler = getServerHandler(res);
  if (!serverHandler) return;

  const targetDirectory = directory || serverHandler.getCurrentDirectory();

  serverHandler.amendFile(path.join(targetDirectory, filename), content)
    .then(() => res.status(200).json({ message: 'File amended successfully.' }))
    .catch((err: Error) => res.status(500).json({ error: err.message }));
});

export default router;
