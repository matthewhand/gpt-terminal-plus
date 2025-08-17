import { Request, Response } from 'express';
import Debug from 'debug';
import { handleServerError } from '../../utils/handleServerError';
import { getServerHandler } from '../../utils/getServerHandler';
import { analyzeError } from '../../llm/errorAdvisor';

const debug = Debug("app:command:execute-file");

/**
 * Function to execute a file on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeFile = async (req: Request, res: Response) => {
  const { filename, directory } = req.body;

  debug(`Received executeFile request: filename=${filename}, directory=${directory}`);

  if (!filename) {
    debug("Filename is required but not provided.");
    return res.status(400).json({ error: "Filename is required." });
  }

  try {
    const server = getServerHandler(req);
    const result = await server.executeFile(filename, directory);
    debug(`File executed: ${filename}, result: ${JSON.stringify(result)}`);
    const payload: any = { result };
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      const aiAnalysis = await analyzeError({ kind: 'file', input: filename, stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode });
      if (aiAnalysis) payload.aiAnalysis = aiAnalysis;
    }
    res.status(200).json(payload);
  } catch (err) {
    debug(`Error executing file: ${err instanceof Error ? err.message : String(err)}`);
    try {
      const msg = err instanceof Error ? err.message : String(err);
      const aiAnalysis = await analyzeError({ kind: 'file', input: filename, stderr: msg });
      const resp: any = { result: { stdout: '', stderr: msg, error: true, exitCode: 1 } };
      if (aiAnalysis) resp.aiAnalysis = aiAnalysis;
      res.status(200).json(resp);
    } catch {
      handleServerError(err, res, "Error executing file");
    }
  }
};
