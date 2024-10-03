import { Request, Response } from 'express';
import { getSelectedServer } from '../../utils/GlobalStateHelper';
import Debug from 'debug';
import { AbstractServerHandler } from '../../handlers/AbstractServerHandler';

const debug = Debug('app:file:setPostCommand');

export const setPostCommand = (req: Request, res: Response): void => {
    const { command } = req.body;

    if (!command || typeof command !== 'string') {
        res.status(400).json({ message: 'Invalid or missing "command" parameter.' });
        return;
    }

    try {
        const handler = getSelectedServer() as unknown as AbstractServerHandler;
        if (!handler) {
            res.status(500).json({ message: 'No server selected.' });
            return;
        }

        // Properly access the setPostCommand method if it exists
        if (typeof (handler as any).setPostCommand === 'function') {
            (handler as any).setPostCommand(command);
            debug('Post command set to:', command);
            res.status(200).json({ message: 'Post command set successfully.' });
        } else {
            res.status(500).json({ message: 'setPostCommand method is not available on the selected server handler.' });
        }
    } catch (error) {
        debug('Error setting post command:', error);
        res.status(500).json({ message: 'Error setting post command', details: (error as Error).message });
    }
};
