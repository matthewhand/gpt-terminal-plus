import express, { Request, Response } from 'express';
import config from 'config';
import Debug from 'debug';
import { ServerHandler } from '../handlers/ServerHandler';
import { ServerConfig } from '../types';

const debug = Debug('server:routes');
const router = express.Router();

// Use the ServerConfig from the config package directly
const servers: ServerConfig[] = config.get('serverConfig');

router.get('/list-servers', (req: Request, res: Response) => {
  debug('Received request to list servers');
  try {
    res.json({ servers });
  } catch (error) {
    debug('Error in /list-servers:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/set-server', async (req: Request, res: Response) => {
  const server = req.body.server; // Changed from host to server
  debug(`Received request to set server with host: ${server}`);
  
  try {
    if (!server) {
      debug('Invalid connection string format. Expected format: server');
      res.status(400).send('Invalid connection string format. Expected format: server');
      return;
    }

    // Initialize the server handler with the configuration
    const serverHandler = await ServerHandler.getInstance(server);
    const systemInfo = await serverHandler.getSystemInfo();
    
    debug(`Server set to: ${server}`);
    res.status(200).json({ output: `Server set to ${server}`, systemInfo });
  } catch (error) {
    debug('Error in /set-server:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the router
export default router;

