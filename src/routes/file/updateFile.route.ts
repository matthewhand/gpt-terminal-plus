
import { Request, Response } from 'express';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';

export const updateFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, pattern, replacement, backup = true, multiline = false } = req.body;

    if (typeof filePath !== 'string' || !filePath.trim()) {
      res.status(400).json({ message: 'filePath must be provided and must be a string.' });
      return;
    }
    if (typeof pattern !== 'string' || !pattern.trim()) {
      res.status(400).json({ message: 'pattern must be provided and must be a string.' });
      return;
    }
    if (typeof replacement !== 'string') {
      res.status(400).json({ message: 'replacement must be provided and must be a string.' });
      return;
    }

    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    await server.updateFile(filePath, pattern, replacement, { backup, multiline });

    res.status(200).json({ 
      status: 'success', 
      message: 'File updated successfully.' 
    });
  } catch (error) {
    handleServerError(error, res, 'Failed to update file');
  }
};
