import { Request, Response } from 'express';
import { handleServerError } from '../../utils/handleServerError';

export const listFiles = async (req: Request, res: Response) => {
  const { directory, limit, offset, orderBy } = req.body;
  if (!directory) {
    return res.status(400).json({ error: 'directory is required' });
  }

  try {
    const serverHandler = req.serverHandler;
    const result = await serverHandler.listFiles(directory, limit || 100, offset || 0, orderBy || 'filename');
    res.status(200).json(result);
  } catch (error) {
    handleServerError(error, res, 'Error listing files');
  }
};
