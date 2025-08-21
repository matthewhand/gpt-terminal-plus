
import { Request, Response } from 'express';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';

export async function readFile(req: Request, res: Response): Promise<void> {
  try {
    const { filePath, startLine, endLine, encoding, maxBytes } = req.body || {};

    if (typeof filePath !== 'string' || !filePath.trim()) {
      res.status(400).json({ 
        status: 'error', 
        message: 'filePath must be provided and must be a string', 
        data: null 
      });
      return;
    }

    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const fileContent = await server.readFile(filePath, { startLine, endLine, encoding, maxBytes });

    res.status(200).json({ 
      status: 'success', 
      message: 'File read successfully', 
      data: fileContent 
    });
  } catch (error) {
    handleServerError(error, res, 'Failed to read file');
  }
}
