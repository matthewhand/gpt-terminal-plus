import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

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
    debug(`Code executed: ${code}, result: ${result}`);
    res.status(200).json({ result });
  } catch (err) {
    debug(`Error executing code: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error executing code");
  }
};
