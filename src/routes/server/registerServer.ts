import { Request, Response } from 'express';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { handleServerError } from '../../utils/handleServerError';

/**
 * Register a new server dynamically
 * @route POST /server/register
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