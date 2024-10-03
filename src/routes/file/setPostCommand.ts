import { Request, Response } from 'express';
import Debug from 'debug';
import { getServerHandler } from '../../utils/getServerHandler';
import { LocalServerHandler } from '../../handlers/local/LocalServerHandler';

const debug = Debug('app:setPostCommand');

/**
 * Sets the post-command for the server handler.
 */
export const setPostCommand = (req: Request, res: Response): void => {
  const { command } = req.body;
  debug('Received request to set post-command:', command);

  if (!command || typeof command !== 'string') {
    res.status(400).json({ message: 'Invalid request. Missing or invalid "command" field.' });
    return;
  }

  try {
    const handler = getServerHandler();

    if (handler instanceof LocalServerHandler) {
      handler.setServerConfig({ ...handler.serverConfig, 'post-command': command });
      debug('Post-command set to:', command);
      res.status(200).json({ message: 'Post-command set successfully.' });
    } else {
      res.status(400).json({ message: 'Post-command can only be set for local servers.' });
    }
  } catch (error) {
    debug('Error setting post-command:', error);
    res.status(500).json({ message: 'Failed to set post-command', error: (error as Error).message });
  }
};
