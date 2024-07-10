import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerConfigManager from '../managers/ServerConfigManager';
import config from 'config';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';

const debug = Debug('app:commandRoutes');
const router = express.Router();

interface RunCommandRequestBody {
  command: string;
  timeout?: number;
  directory?: string;  // Optional directory parameter
  shell?: string;      // Optional shell parameter
  linesPerPage?: number;  // Optional pagination control
}

// Middleware to ensure server is set before handling routes
router.use(ensureServerIsSet);

const handleCommand = async (req: Request, res: Response) => {
  const { command, timeout, directory, shell, linesPerPage }: RunCommandRequestBody = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const configManager = ServerConfigManager.getInstance();
    const serverConfig = configManager.getServerConfig();

    if (!serverConfig) {
      throw new Error('Server configuration is null or undefined');
    }

    const serverHandler = await ServerHandler.getInstance(serverConfig.host);

    const effectiveTimeout = timeout ?? config.get<number>('commandTimeout') ?? 180000;
    const options = {
      timeout: effectiveTimeout,
      directory,  // Pass directory to executeCommand
      shell,      // Pass shell to executeCommand
      linesPerPage  // Pass linesPerPage to executeCommand if provided
    };
    const executionResult = await serverHandler.executeCommand(command, options);

    res.status(200).json(executionResult);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    debug(`Error executing command: ${errorMessage}`);
    res.status(500).json({ error: errorMessage });
  }
};

// Alias Routes included for ChatGPT hallucinations
router.post('/run', handleCommand);
router.post('/execute', handleCommand);
router.post('/execute-command', handleCommand);

router.use(ensureServerIsSet);

export default router;
