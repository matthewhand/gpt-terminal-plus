import { Request, Response } from 'express';
import { handleServerError } from '../../utils/handleServerError';

export const createFile = async (req: Request, res: Response) => {
  const { directory, filePath, content, backup } = req.body;
  if (!directory || !filePath || !content) {
    return res.status(400).json({ error: 'directory, filePath, and content are required' });
  }

  try {
    const serverHandler = req.serverHandler;
    const result = await serverHandler.createFile(directory, filePath, content, backup || true);
    res.status(200).json(result);
  } catch (error) {
    handleServerError(error, res, 'Error creating file');
  }
};
