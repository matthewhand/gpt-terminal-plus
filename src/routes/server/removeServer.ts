import { Request, Response } from 'express';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { handleServerError } from '../../utils/handleServerError';

/**
 * Remove a server from configuration
 * @route DELETE /server/{hostname}
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