import express from 'express';
import ServerHandlerSingleton from '../services/serverHandlerInstance';
import { ServerConfig } from '../types';
import config from 'config';
import { generateResponseId, storeResponse } from '../handlers/PaginationHandler';

// Define interfaces for expected request body to improve type safety
interface RunCommandRequestBody {
  command: string;
  timeout?: number;
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
  const maxResponseSize = config.get<number>('maxResponseSize') || 1000;

  try {
    const { stdout, stderr } = await serverHandler.executeCommand(command, effectiveTimeout);
    const responseId = generateResponseId();
    // Store the paginated stdout and stderr
    storeResponse(responseId, stdout, stderr, maxResponseSize);

    // Calculate total pages
    const totalPages = Math.ceil(Math.max(stdout.length, stderr.length) / maxResponseSize);

    // Get the first page of stdout and stderr
    const firstPageStdout = stdout.slice(0, maxResponseSize);
    const firstPageStderr = stderr.slice(0, maxResponseSize);

    // Respond with the first page and total pages
    res.status(200).json({
      responseId,
      totalPages,
      currentPage: 0,
      stdout: firstPageStdout,
      stderr: firstPageStderr
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
