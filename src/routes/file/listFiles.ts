import { Request, Response } from 'express';
import { handleServerError } from '../../utils/handleServerError';

export const listFiles = async (req: Request, res: Response) => {
  const directory = req.body.directory || req.query.directory;
  const limit = parseInt(req.body.limit || req.query.limit) || 100;
  const offset = parseInt(req.body.offset || req.query.offset) || 0;
  const orderBy = req.body.orderBy || req.query.orderBy || 'filename';

  if (!directory) {
    return res.status(400).json({ error: 'directory is required' });
  }

  try {
    const serverHandler = req.serverHandler;
    const result = await serverHandler.listFiles(directory, limit, offset, orderBy);
    res.status(200).json(result);
  } catch (error) {
    handleServerError(error, res, 'Error listing files');
  }
};
