// src/routes/commandRoutes.ts
import express, { Request, Response } from 'express';
import { ServerConfigUtils } from '../utils/ServerConfigUtils';
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
    // Use the serverHandler directly from the request, set by ensureServerIsSet middleware
    const serverHandler = req.serverHandler;
    if (!serverHandler) {
      throw new Error('Server handler not set. Please ensure server is properly configured.');
    }
    
    // Execute the command using the server handler
    const effectiveTimeout = timeout ?? 180000; // Use a default timeout if not provided
    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);

    res.status(200).json(executionResult);
  } catch (error) {
    debug(`Error executing command: ${error}`);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Ensure the server is set for each request in this route
router.use(ensureServerIsSet);

export default router;
