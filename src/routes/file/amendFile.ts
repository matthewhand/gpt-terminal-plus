import { Request, Response } from 'express';
import Debug from 'debug';
import { getServerHandler } from '../../utils/getServerHandler';

const debug = Debug('app:amendFile');

/**
 * Amend a file by appending content.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const amendFile = async (req: Request, res: Response) => {
  try {
    const { filePath, content, backup = true } = req.body;

    // Debug: Log received parameters
    debug("Received parameters:", { filePath, content, backup });

    if (!filePath || !content) {
      res.status(400).json({ message: "File path and content are required" });
      return;
    }

    const serverHandler = getServerHandler(req);
    if (typeof serverHandler.amendFile !== 'function') {
      throw new Error('serverHandler.amendFile is not a function');
    }

    const success = await serverHandler.amendFile(filePath, content, backup);

    if (success) {
      res.status(200).json({ message: "File amended successfully" });
    } else {
      res.status(500).json({ message: "Failed to amend file" });
    }
  } catch (error) {
    const errorMessage = `Error amending file: ${error instanceof Error ? error.message : 'Unknown error'}`;
    debug(errorMessage);
    res.status(500).json({ error: errorMessage });
  }
};
