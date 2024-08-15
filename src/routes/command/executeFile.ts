import { Request, Response } from 'express';
import { execFile } from 'child_process';
import path from 'path';

/**
 * Handles the execution of a file on the server.
 * 
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const executeFile = (req: Request, res: Response): void => {
  const { filename, directory } = req.body;

  if (!filename) {
    res.status(400).json({ error: 'Filename is required.' });
    return;
  }

  const filePath = directory ? path.join(directory, filename) : filename;
  const fileExtension = path.extname(filename).toLowerCase();

  let command: string;

  switch (fileExtension) {
    case '.sh':
      command = 'bash';
      break;
    case '.ps1':
      command = 'powershell';
      break;
    case '.py':
      command = 'python';
      break;
    case '.ts':
      command = 'ts-node';
      break;
    default:
      res.status(400).json({ error: `Unsupported file extension: ${fileExtension}` });
      return;
  }

  execFile(command, [filePath], (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`Error executing file ${filename}:`, error);
      res.status(500).json({ error: error.message, stderr });
      return;
    }

    res.status(200).json({ stdout, stderr });
  });
};
