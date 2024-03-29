// src/routes/commandRoutes.ts
import express, { Request, Response } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper'; // Adjust the import path as necessary
import { ServerConfigUtils } from '../utils/ServerConfigUtils'; // Assuming this utility can fetch server handlers
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
    // Retrieve the selected server's handler directly using the stored global server setting
    const selectedServer = getSelectedServer();
    const serverHandler = await ServerConfigUtils.getInstance(selectedServer);

    if (!serverHandler) {
      throw new Error(`Server handler not set for ${selectedServer}. Please ensure the server is properly configured.`);
    }
    
    // Execute the command using the retrieved server handler
    const effectiveTimeout = timeout ?? 180000; // Use a default timeout if not provided
    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);

    res.status(200).json(executionResult);
  } catch (error) {
    debug(`Error executing command: ${error}`);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
