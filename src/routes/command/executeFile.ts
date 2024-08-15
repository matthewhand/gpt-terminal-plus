import { Request, Response } from 'express';
import Debug from 'debug';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';

const debug = Debug("app:command:execute-file");

/**
 * Function to execute a file on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeFile = async (req: Request, res: Response) => {
  const { filename, directory } = req.body;

  if (!filename) {
    debug("Filename is required but not provided.");
    return res.status(400).json({ error: "Filename is required." });
  }

  try {
    const server = getServerHandler(req);
    const result = await server.executeFile(filename, directory);
    debug(`File executed: ${filename}, result: ${JSON.stringify(result)}`);
    res.status(200).json({ result });
  } catch (err) {
    debug(`Error executing file: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error executing file");
  }
};
