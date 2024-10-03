import { Request, Response } from 'express';
import { getSelectedServer } from '../../utils/GlobalStateHelper';
import Debug from 'debug';

const debug = Debug('app:file:setPostCommand');

export const setPostCommand = (req: Request, res: Response): void => {
    const { command } = req.body;

    if (!command || typeof command !== 'string') {
        res.status(400).json({ message: 'Invalid or missing "command" parameter.' });
        return;
    }

    try {
        const handler = getSelectedServer();
        if (!handler) {
            res.status(500).json({ message: 'No server selected.' });
            return;
        }

        // Assuming the handler has a method to set the post command
        handler.setPostCommand(command);
        debug('Post command set to:', command);
        res.status(200).json({ message: 'Post command set successfully.' });
    } catch (error) {
        debug('Error setting post command:', error);
        res.status(500).json({ message: 'Error setting post command', details: (error as Error).message });
    }
};
