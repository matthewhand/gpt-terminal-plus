import express, { Request, Response } from 'express';
import { ServerHandler } from '../handlers/ServerHandler';
import Debug from 'debug';
import { CommandConfig, ServerConfig } from '../types';
import ServerConfigManager from '../config/ServerConfigManager';

const debug = Debug('app:serverRoutes');
const router = express.Router();

/**
 * @swagger
 * /list-servers:
 *   get:
 *     description: List available servers and commands
 *     responses:
 *       200:
 *         description: A list of servers and commands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 servers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServerConfig'
 *                 commands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommandConfig'
 */

/**
 * Endpoint to list available servers and commands.
 * @name /list-servers
 * @function
 * @memberof module:routes/serverRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.get('/list-servers', async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = await ServerHandler.listAvailableServers();
    const commands = await ServerHandler.listAvailableCommands();
    debug('Listing available servers and commands', { servers, commands });
    res.json({ servers, commands });
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

/**
 * @swagger
 * /set-server:
 *   post:
 *     description: Set the active server and manage alias settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               server:
 *                 type: string
 *                 description: The server to set.
 *               getSystemInfo:
 *                 type: boolean
 *                 description: Whether to retrieve system information upon setting the server. Defaults to true.
 *                 default: true
 *     responses:
 *       200:
 *         description: The server was successfully set, with system information retrieved and aliases managed according to preferences.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 output:
 *                   type: string
 *                   description: A message indicating the server was successfully set.
 *                 systemInfo:
 *                   type: object
 *                   description: Information about the system of the set server, provided if 'getSystemInfo' is true.
 */

/**
 * Endpoint to set the active server and manage alias settings.
 * @name /set-server
 * @function
 * @memberof module:routes/serverRoutes
 * @inner
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
router.post('/set-server', async (req: Request<{}, {}, { server: string, getSystemInfo?: boolean }>, res: Response) => {
  const { server, getSystemInfo = true } = req.body;
  debug(`Received request to set server: ${server}`, { requestBody: req.body });

  try {
    debug('Attempting to get ServerHandler instance');
    const serverHandler = await ServerHandler.getInstance(server);
    debug(`ServerHandler instance created for server: ${server}`);

    const serverConfig: ServerConfig = await ServerHandler.getServerConfig(server);
    debug('Server config retrieved', { serverConfig });

    // Persist the server configuration using ServerConfigManager
    const configManager = ServerConfigManager.getInstance();
    configManager.setServerConfig(serverConfig);

    // Ensure tasks is defined and is an array
    const tasks = serverConfig.tasks ?? [];
    debug('Filtered tasks', { tasks });

    // Retrieve the available commands for this server
    const commands = await ServerHandler.listAvailableCommands();
    // TODO const relevantCommands = (commands || []).filter(command => (tasks || []).includes(command.name));
    const relevantCommands = (commands || []).filter(command => (tasks || []).includes(command.name));
    debug('Filtered available commands', { relevantCommands });

    // Attempt to retrieve system information if requested
    let systemInfo = {};
    if (getSystemInfo) {
      try {
        debug('Retrieving system information');
        systemInfo = await serverHandler.getSystemInfo();
        debug(`Retrieved system info for server: ${server}`, { systemInfo });
      } catch (error) {
        debug('Failed to retrieve system info, proceeding without it:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          server
        });
        systemInfo = { error: 'Failed to retrieve system information, but server set successfully.' };
      }
    }

    const hint = 'Present the server configuration, available commands, and system information in a tabulated form for better readability.';
    debug('Returning response to client');
    res.status(200).json({
      output: `Server set to ${server}`,
      serverConfig,
      commands: relevantCommands,
      systemInfo,
      hint
    });
  } catch (error: unknown) {
    debug('Error in /set-server', {
      error,
      requestBody: req.body
    });

    if (error instanceof Error) {
      res.status(500).json({
        output: 'Error setting server',
        error: error.message
      });
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});

export default router;
