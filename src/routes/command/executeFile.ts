import { Request, Response } from 'express';
import Debug from 'debug';
import { executeShell } from './executeShell';

const debug = Debug("app:command:execute-file");
let warned = false;

/**
 * Deprecated file execution route. Delegates to shell executor.
 */
export const executeFile = async (req: Request, res: Response) => {
  const { filename, directory } = req.body;

  debug(`Received executeFile request: filename=${filename}, directory=${directory}`);

  if (!filename) {
    debug("Filename is required but not provided.");
    return res.status(400).json({ error: "Filename is required." });
  }
  if (!warned) {
    warned = true;
    console.warn('executeFile is deprecated; use /command/execute with a shell command instead.');
  }
  res.setHeader('Warning', '299 - "executeFile is deprecated; use /command/execute instead"');

  const cmd = directory ? `cd ${directory} && ./${filename}` : `./${filename}`;
  req.body = { command: cmd };
  return executeShell(req, res);
};
