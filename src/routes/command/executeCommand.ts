import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

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
    debug(`Command executed: ${command}, result: ${result}`);
    res.status(200).json({ result });
  } catch (err) {
    debug(`Error executing command: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error executing command");
  }
};
