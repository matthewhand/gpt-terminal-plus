import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import { ensureServerIsSet } from '../middlewares';
import Debug from 'debug';
const debug = Debug('app:serverRoutes');
const router = express.Router();

router.use(ensureServerIsSet);

router.get('/list-servers', async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = await ServerHandler.listAvailableServers();
    debug('Listing available servers', { servers });
    res.json({ servers });
  } catch (error: unknown) {
    debug('Error in /list-servers', {
      error,
      requestBody: req.body,
      queryParams: req.query
    });

    if (error instanceof Error) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});


router.post('/set-server', async (req: Request, res: Response) => {
  const { server } = req.body;
  debug(`Received request to set server: ${server}`, { requestBody: req.body });

  try {
    const serverHandler = await ServerHandler.getInstance(server);
    debug(`ServerHandler instance created for server: ${server}`);

    const systemInfo = await serverHandler.getSystemInfo();
    debug(`Retrieved system info for server: ${server}`, { systemInfo });

    res.status(200).json({ output: `Server set to ${server}`, systemInfo });
  } catch (error: unknown) {
    debug('Error in /set-server', {
      error,
      requestBody: req.body
    });

    if (error instanceof Error) {
      // Check if the error is due to a client-side issue (e.g., non-existent server)
      if (error.message === 'Server not in predefined list.') {
        res.status(400).json({
          output: error.message
        });
      } else {
        // For server-side errors
        res.status(500).json({
          output: 'Error retrieving system info',
          error: error.message,
          stack: error.stack  // Include stack trace for better debugging
        });
      }
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});

// Export the router
export default router;
