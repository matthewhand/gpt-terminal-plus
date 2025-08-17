import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { analyzeError } from "../../llm/errorAdvisor";

const debug = Debug("app:command:execute-code");

/**
 * Function to execute code on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const executeCode = async (req: Request, res: Response) => {
  if (process.env.ENABLE_CODE_EXECUTION === 'false') {
    return res.status(403).json({ error: "Code execution is disabled." });
  }

  const { code, language } = req.body;

  if (!code || !language) {
    debug("Code and language are required but not provided.");
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    const server = getServerHandler(req);
    const result = await server.executeCode(code, language);
    debug(`Code executed: ${code}, result: ${JSON.stringify(result)}`);
    const payload: any = { result };
    if ((result?.exitCode !== undefined && result.exitCode !== 0) || result?.error) {
      const aiAnalysis = await analyzeError({ kind: 'code', input: code, language, stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode });
      if (aiAnalysis) payload.aiAnalysis = aiAnalysis;
    }
    res.status(200).json(payload);
  } catch (err) {
    debug(`Error executing code: ${err instanceof Error ? err.message : String(err)}`);
    try {
      const msg = err instanceof Error ? err.message : String(err);
      const aiAnalysis = await analyzeError({ kind: 'code', input: code, language, stderr: msg });
      const resp: any = { result: { stdout: '', stderr: msg, error: true, exitCode: 1 } };
      if (aiAnalysis) resp.aiAnalysis = aiAnalysis;
      res.status(200).json(resp);
    } catch {
      handleServerError(err, res, "Error executing code");
    }
  }
};
