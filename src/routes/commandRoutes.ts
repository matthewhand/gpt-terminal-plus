import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import { ServerConfig } from '../types';
import config from 'config';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';

const debug = Debug('app:commandRoutes');
const router = express.Router();

// Define interfaces for expected request body to improve type safety
interface RunCommandRequestBody {
  command: string;
  timeout?: number;
}

// Helper function to get serverHandler
async function getServerHandler(): Promise<ServerHandler> {
  //const serverConfigs = ServerHandler.listAvailableServers();
  //const defaultServerConfig = serverConfigs[0]; // Assuming the first server config as default
  //const serverHandler = await ServerHandler.getInstance(defaultServerConfig.host);
  const serverHandler = await ServerHandler.getInstance(global.selectedServer);
  return serverHandler;
}

router.post('/run', async (req: Request, res: Response) => {
  const { command, timeout }: RunCommandRequestBody = req.body;

  // Validate the command
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const serverHandler = await getServerHandler();

    // Use the provided timeout or default to the configured command timeout
    const effectiveTimeout = timeout ?? config.get<number>('commandTimeout') ?? 180000;

    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);

    // Response logic here...
    res.status(200).json(executionResult);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.use(ensureServerIsSet);

export default router;

