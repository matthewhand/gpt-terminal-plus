import express from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import { ServerConfig } from '../types';
import config from 'config';
import { getPaginatedResponse, storeResponse } from '../handlers/PaginationHandler';

// Define interfaces for expected request body to improve type safety
interface RunCommandRequestBody {
  command: string;
  timeout?: number;
}

const router = express.Router();

// Helper function to get serverHandler
async function getServerHandler(): Promise<ServerHandler | null> {
  try {
    const serverConfig = config.get<ServerConfig>('serverConfig');
    const serverHandler = await ServerHandler.getInstance(serverConfig.host); // Await the Promise here
    return serverHandler;
  } catch (error) {
    console.error('Failed to initialize serverHandler:', error);
    return null;
  }
}

router.post('/run', async (req, res) => {
  const { command, timeout }: RunCommandRequestBody = req.body;
  const serverHandler = await getServerHandler(); 
  if (!serverHandler) {
    return res.status(500).json({ error: 'Server handler not initialized' });
  }

  const effectiveTimeout = timeout || config.get<number>('commandTimeout') || 180000;
  const maxResponseSize = config.get<number>('maxResponseSize') || 1000;

  try {
    // Execute the command and get the raw output
    const executionResult = await serverHandler.executeCommand(command, effectiveTimeout);
    
    // Store the paginated stdout and stderr and get the response ID
    const responseId = storeResponse(executionResult.stdout, executionResult.stderr, maxResponseSize);

    // Retrieve the paginated response
    const paginatedResult = getPaginatedResponse(responseId, 0);

    // Respond with the paginated output
    res.status(200).json({
      responseId,
      totalPages: paginatedResult.totalPages,
      currentPage: 0,
      stdout: paginatedResult.stdout,
      stderr: paginatedResult.stderr
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
