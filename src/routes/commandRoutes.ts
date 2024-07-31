import express, { Request, Response } from 'express';
import Debug from 'debug';
import { ServerHandler } from '../types/ServerHandler';

const debug = Debug('app:commandRoutes');
const router = express.Router();

/**
 * Interface for the expected request body to improve type safety
 */
interface RunCommandRequestBody extends Request {
  body: {
    command: string;
    timeout?: number;
  }
}

/**
 * Safely gets the server handler from the request.
 * @param {Request} req - The request object.
 * @returns {ServerHandler} - The server handler.
 * @throws {Error} - If the server handler is not found.
 */
const getServerHandler = (req: Request): ServerHandler => {
  const serverHandler = req.serverHandler as ServerHandler | undefined;
  if (!serverHandler) {
    throw new Error('Server handler not found on request object');
  }
  return serverHandler;
};

/**
 * Handler to execute a command on the selected server
 */
const executeCommandHandler = async (req: RunCommandRequestBody, res: Response) => {
  const { command, timeout } = req.body;

  // Validate the command
  if (!command) {
    debug('Command is required but not provided.');
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const serverHandler = getServerHandler(req);

    // Execute the command using the retrieved server handler
    const effectiveTimeout = timeout ?? parseInt(process.env.DEFAULT_COMMAND_TIMEOUT || '180000'); // Default timeout if not provided
    debug('Executing command: ' + command + ' with timeout: ' + effectiveTimeout);
    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);

    debug('Command executed successfully: ' + JSON.stringify(executionResult));
    res.status(200).json(executionResult);
  } catch (error) {
    const errorMessage = 'Error executing command: ' + (error instanceof Error ? error.message : 'Unknown error');
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
