import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { analyzeError } from "../../llm/errorAdvisor";
import { getPresentWorkingDirectory } from "../../utils/GlobalStateHelper";

const debug = Debug("app:command:execute");

/**
 * Function to execute a command on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeCommand = async (req: Request, res: Response) => {
  const { command } = req.body;

  if (!command) {
    debug("Command is required but not provided.");
    return res.status(400).json({ error: "Command is required" });
  }

  try {
    const server = getServerHandler(req);
    const result = await server.executeCommand(command);
    debug(`Command executed: ${command}, result: ${JSON.stringify(result)}`);
    const payload: any = { result };
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      const aiAnalysis = await analyzeError({
        kind: 'command',
        input: command,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        cwd: await getPresentWorkingDirectory(),
      });
      if (aiAnalysis) payload.aiAnalysis = aiAnalysis;
    }
    res.status(200).json(payload);
  } catch (err) {
    debug(`Error executing command: ${err instanceof Error ? err.message : String(err)}`);
    try {
      const msg = err instanceof Error ? err.message : String(err);
      const aiAnalysis = await analyzeError({ kind: 'command', input: command, stderr: msg, cwd: await getPresentWorkingDirectory() });
      const resp: any = {
        result: { stdout: '', stderr: msg, error: true, exitCode: 1 },
      };
      if (aiAnalysis) resp.aiAnalysis = aiAnalysis;
      res.status(200).json(resp);
    } catch {
      handleServerError(err, res, "Error executing command");
    }
  }
};
