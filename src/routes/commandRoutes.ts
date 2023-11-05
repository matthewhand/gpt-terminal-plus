import express from 'express';
import ServerHandlerSingleton from '../services/serverHandlerInstance';
import { ServerConfig } from '../types';
import config from 'config';
import lockfile from 'proper-lockfile';

// Define interfaces for expected request body to improve type safety
interface RunCommandRequestBody {
  command: string;
  timeout?: number;
}

interface CreateFileRequestBody {
  filename: string;
  content: string;
  backup?: boolean;
  directory?: string;
}

const router = express.Router();

// Initialize serverHandler immediately if configuration exists
const serverConfig = config.get<ServerConfig>('serverConfig');
const serverHandler = serverConfig ? ServerHandlerSingleton.getInstance(serverConfig) : null;

if (!serverHandler) {
  console.error('serverConfig is not defined in the config files.');
  process.exit(1);
}

router.post('/run', async (req, res) => {
  const { command, timeout }: RunCommandRequestBody = req.body;
  const effectiveTimeout = timeout || config.get<number>('commandTimeout') || 180000;

  // Define a unique lock name based on the command, or use a generic one if the command should not run concurrently with any other
  const lockName = `command-lock-${command}`;

  try {
    // Attempt to acquire a lock before executing the command
    const release = await lockfile.lock(lockName, { realpath: false });

    try {
      const result = await serverHandler.executeCommand(command, effectiveTimeout);
      res.status(200).json(result);
    } finally {
      // Release the lock after the command execution
      await release();
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});


router.post(['/create-file', '/create-or-replace-file'], async (req, res) => {
  const { filename, content, backup = true, directory = "" }: CreateFileRequestBody = req.body;
  
  if (!serverHandler) {
    return res.status(500).json({ error: 'Server handler not initialized' });
  }

  try {
    // Await the getCurrentDirectory if it's asynchronous
    const targetDirectory = directory || await serverHandler.getCurrentDirectory();
    const success = await serverHandler.createFile(targetDirectory, filename, content, backup);
    if (success) {
      res.json({ message: 'File created successfully' });
    } else {
      res.status(400).json({ error: 'Failed to create file' });
    }
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

export default router;
