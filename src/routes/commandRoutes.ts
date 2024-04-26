import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import ServerConfigManager from './ServerConfigManager';
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
    const serverHandler = await ServerHandler.getInstance(serverConfig);

    const effectiveTimeout = timeout ?? config.get<number>('commandTimeout') ?? 180000;
    const options = {
      timeout: effectiveTimeout,
      linesPerPage  // Pass this to executeCommand if provided
    };
    const executionResult = await serverHandler.executeCommand(command, options);

    res.status(200).json(executionResult);
  } catch (error: any) { // Changed from implicit 'unknown' to 'any' for broader type handling
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
