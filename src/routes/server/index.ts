import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { ServerManager } from "../../managers/ServerManager";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const debug = Debug("app:server");

/**
 * Function to get system info for the current server.
 */
export const getSystemInfo = async (req: Request, res: Response) => {
  try {
    const server = getServerHandler(req);
    const systemInfo = await server.getSystemInfo();
    res.status(200).json(systemInfo);
  } catch (error) {
    debug(`Error retrieving system info: ${error instanceof Error ? error.message : "Unknown error"}`);
    handleServerError(error, res, "Error retrieving system info");
  }
};

/**
 * Function to list available servers.
 */
export const listServers = async (req: Request, res: Response) => {
  debug('Received request to list servers', { method: req.method, path: req.path });

  try {
    const servers = ServerManager.listAvailableServers();
    debug('Listing available servers', { servers: servers.map((server: any) => server.host) });
    res.json({ servers });
  } catch (error) {
    debug('Error in /list-servers', {
      error,
      requestBody: req.body,
      queryParams: req.query,
    });
    handleServerError(error, res, 'Error in /list-servers');
  }
};

/**
 * Register a new server dynamically
 */
export const registerServer = async (req: Request, res: Response) => {
  const { hostname, protocol, config } = req.body;

  if (!hostname || !protocol) {
    return res.status(400).json({ 
      error: 'hostname and protocol are required' 
    });
  }

  if (!['local', 'ssh', 'ssm'].includes(protocol)) {
    return res.status(400).json({ 
      error: 'protocol must be local, ssh, or ssm' 
    });
  }

  try {
    const configPath = path.join(process.cwd(), 'config', 'servers.json');
    
    let servers = {};
    try {
      const content = await readFile(configPath, 'utf8');
      servers = JSON.parse(content);
    } catch {
      // File doesn't exist, start with empty object
    }

    // Validate server config based on protocol
    if (protocol === 'ssh' && (!config?.host || !config?.username)) {
      return res.status(400).json({ 
        error: 'SSH servers require host and username in config' 
      });
    }

    if (protocol === 'ssm' && !config?.instanceId) {
      return res.status(400).json({ 
        error: 'SSM servers require instanceId in config' 
      });
    }

    // Add server to configuration
    (servers as any)[hostname] = {
      protocol,
      hostname,
      ...config,
      registeredAt: new Date().toISOString()
    };

    // Write updated configuration
    await writeFile(configPath, JSON.stringify(servers, null, 2), 'utf8');

    res.json({
      success: true,
      message: `Server ${hostname} registered successfully`,
      server: (servers as any)[hostname]
    });

  } catch (error) {
    handleServerError(error, res, 'Error registering server');
  }
};

/**
 * Remove a server from configuration
 */
export const removeServer = async (req: Request, res: Response) => {
  const { hostname } = req.params;

  if (!hostname) {
    return res.status(400).json({ 
      error: 'hostname parameter is required' 
    });
  }

  try {
    const configPath = path.join(process.cwd(), 'config', 'servers.json');
    
    let servers = {};
    try {
      const content = await readFile(configPath, 'utf8');
      servers = JSON.parse(content);
    } catch {
      return res.status(404).json({ 
        error: 'No server configuration found' 
      });
    }

    if (!(servers as any)[hostname]) {
      return res.status(404).json({ 
        error: `Server ${hostname} not found` 
      });
    }

    // Remove server from configuration
    const removedServer = (servers as any)[hostname];
    delete (servers as any)[hostname];

    // Write updated configuration
    await writeFile(configPath, JSON.stringify(servers, null, 2), 'utf8');

    res.json({
      success: true,
      message: `Server ${hostname} removed successfully`,
      removedServer
    });

  } catch (error) {
    handleServerError(error, res, 'Error removing server');
  }
};

/**
 * Sets the server using ServerManager and handles the request/response.
 */
export const setServer = (req: Request, res: Response): void => {
  const { hostname } = req.body;

  if (!hostname || typeof hostname !== 'string') {
    res.status(400).json({ message: 'Invalid hostname provided.' });
    return;
  }

  try {
    const serverManager = ServerManager.getInstance();
    const serverConfig = serverManager.getServerConfig(hostname);
    if (!serverConfig) {
      res.status(404).json({ message: `Server not found: ${hostname}` });
      return;
    }
    debug('Server set to:', hostname);
    res.status(200).json({ message: `Server set to: ${hostname}` });
  } catch (error) {
    debug('Error setting server:', error);
    res.status(500).json({ message: 'Failed to set server.', error: (error as Error).message });
  }
};