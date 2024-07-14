import express, { Request, Response } from 'express';
import { getSelectedServer } from '../utils/GlobalStateHelper';
import { ServerConfigUtils } from '../utils/ServerConfigUtils';
import Debug from 'debug';

const debug = Debug('app:commandRoutes');
const router = express.Router();

/**
 * Interface for the expected request body to improve type safety
 */
interface RunCommandRequestBody {
  command: string;
  timeout?: number;
}

/**
 * Handler to execute a command on the selected server
 */
const executeCommandHandler = async (req: Request, res: Response) => {
  const { command, timeout }: RunCommandRequestBody = req.body;

  // Validate the command
  if (!command) {
    debug('Command is required but not provided.');
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    // Retrieve the selected server's handler directly using the stored global server setting
    const selectedServer = getSelectedServer();
    const serverHandler = await ServerConfigUtils.getInstance(selectedServer);

    if (!serverHandler) {
      const errorMessage = `Server handler not set for ${selectedServer}. Please ensure the server is properly configured.`;
      debug(errorMessage);
      throw new Error(errorMessage);
    }

    // Execute the command using the retrieved server handler
    const effectiveTimeout = timeout ?? 180000; // Default timeout if not provided
    debug(`Executing command: ${command} with timeout: ${effectiveTimeout} on server: ${selectedServer}`);
    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);

    debug(`Command executed successfully: ${JSON.stringify(executionResult)}`);
    res.status(200).json(executionResult);
  } catch (error) {
    const errorMessage = `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`;
    debug(errorMessage);
    res.status(500).json({ error: errorMessage });
  }
};

/**
 * Endpoint to run a command on the selected server
 */
router.post('/run', executeCommandHandler);

/**
 * Alias for execute-command
 */
router.post('/execute-command', executeCommandHandler);

export default router;

