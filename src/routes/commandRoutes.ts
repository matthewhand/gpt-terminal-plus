import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerConfigManager from '../config/ServerConfigManager';
import config from 'config';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';

const debug = Debug('app:commandRoutes');
const router = express.Router();

interface RunCommandRequestBody {
  command: string;
  timeout?: number;
  linesPerPage?: number;  // Optional pagination control
}

const handleCommand = async (req: Request, res: Response) => {
  const { command, timeout, linesPerPage }: RunCommandRequestBody = req.body;

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
      linesPerPage  // Pass this to executeCommand if provided
    };
    const executionResult = await serverHandler.executeCommand(command, options);

    res.status(200).json(executionResult);
  } catch (error: any) { 
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    debug(`Error executing command: ${errorMessage}`);
    res.status(500).json({ error: errorMessage });
  }
};

// Route for /run
router.post('/run', handleCommand);
router.post('/execute', handleCommand);
router.post('/execute-command', handleCommand);

router.use(ensureServerIsSet);

export default router;
