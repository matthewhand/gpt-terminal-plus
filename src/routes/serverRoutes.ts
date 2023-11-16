import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';
const debug = Debug('app:serverRoutes');
const router = express.Router();
router.use(ensureServerIsSet);

router.get('/list-servers', async (req: Request, res: Response) => {
  debug('Received request to list servers');
  try {
    const servers = await ServerHandler.listAvailableServers();
    res.json({ servers });
  } catch (error: unknown) {
    if (error instanceof Error) {
      debug('Error in /list-servers:', error.message);
      res.status(500).send('Internal Server Error');
    } else {
      debug('Unknown error in /list-servers');
      res.status(500).send('An unknown error occurred');
    }
  }
});

router.post('/set-server', async (req: Request, res: Response) => {
  const { server } = req.body;
  debug(`Received request to set server: ${server}`);
  
  try {
    // Initialize the server handler with the provided configuration
    const serverHandler = await ServerHandler.getInstance(server);
    const systemInfo = await serverHandler.getSystemInfo();
    
    debug(`Server set to ${server}`);
    res.status(200).json({ output: `Server set to ${server}`, systemInfo });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Server not in predefined list.') {
      debug('Error in /set-server:', error.message);
      res.status(400).json({ output: error.message });
    } else if (error instanceof Error) {
      debug('Error in /set-server:', error.message);
      res.status(500).json({
        output: 'Error retrieving system info',
        error: error.message
      });
    } else {
      debug('Unknown error in /set-server');
      res.status(500).send('An unknown error occurred');
    }
  }
});

// Export the router
export default router;
