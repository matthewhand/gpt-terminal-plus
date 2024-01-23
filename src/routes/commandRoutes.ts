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
}

router.post('/run', async (req: Request, res: Response) => {
  const { command, timeout }: RunCommandRequestBody = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const configManager = ServerConfigManager.getInstance();
    const serverConfig = configManager.getServerConfig();
    const serverHandler = await ServerHandler.getInstance(serverConfig);

    const effectiveTimeout = timeout ?? config.get<number>('commandTimeout') ?? 180000;
    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);

    res.status(200).json(executionResult);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.use(ensureServerIsSet);

export default router;
