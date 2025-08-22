
import { Request, Response } from 'express';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';

export const amendFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filePath, content, backup = true } = req.body;

    if (typeof filePath !== 'string' || !filePath.trim()) {
      res.status(400).json({ message: 'filePath must be provided and must be a string.' });
      return;
    }
    if (typeof content !== 'string') {
      res.status(400).json({ message: 'content must be provided and must be a string.' });
      return;
    }

    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    await server.amendFile(filePath, content, { backup });

    res.status(200).json({ 
      status: 'success', 
      message: 'File amended successfully.' 
    });
  } catch (error) {
    handleServerError(error, res, 'Failed to amend file');
  }
};
