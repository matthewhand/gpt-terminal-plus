import express, { Request, Response } from 'express';
import ServerHandler from '../services/serverHandlerInstance';
import config from 'config';
import { ServerConfig } from '../handlers/types';

const router = express.Router();

// Use the ServerConfig from the config package directly
const servers: ServerConfig[] = config.get('ServerConfig');

router.get('/list-servers', (req: Request, res: Response) => {
  res.json({ servers });
});

router.post('/set-server', async (req: Request, res: Response) => {
  const newServerAddress = req.body.server as string;
  // Find the server configuration that matches the newServerAddress
  const serverConfig = servers.find(server => server.connectionString === newServerAddress);

  if (!serverConfig) {
    console.error('Server not found in predefined list:', newServerAddress);
    res.status(400).json({ output: 'Server not in predefined list.' });
    return;
  }

  // Initialize the server handler with the configuration
  const serverHandler = ServerHandler.getInstance(serverConfig);

  // Check if serverHandler is null and handle it
  if (!serverHandler) {
    console.error('Failed to initialize server handler.');
    res.status(500).json({ output: 'Failed to initialize server handler.' });
    return;
  }

  try {
    const systemInfo = await (serverHandler as any).getSystemInfo();
    // Here you should handle setting the current server configuration in your application's state
    console.log(`Server set to: ${serverConfig.connectionString}`);
    res.status(200).json({ output: `Server set to ${serverConfig.connectionString}`, systemInfo });
  } catch (error) {
    // Use a type guard to check if the error is an instance of Error
    if (error instanceof Error) {
      console.error('Error retrieving system info:', error.message);
      res.status(500).json({ output: 'Error retrieving system info', error: error.message });
    } else {
      // If it's not an Error instance, handle it as an unknown type
      console.error('An unknown error occurred');
      res.status(500).json({ output: 'An unknown error occurred' });
    }
  }
});
// Export the router
export default router;
