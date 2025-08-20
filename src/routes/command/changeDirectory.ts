import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

const debug = Debug("app:command:changeDirectory");

/**
 * Function to change the working directory on the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const changeDirectory = async (req: Request, res: Response) => {
  const { directory } = req.body;

  if (!directory) {
    debug("Directory is required but not provided.");
    return res.status(400).json({ error: "Directory is required" });
  }

  try {
    const server = getServerHandler(req);
    const success = await server.changeDirectory(directory);
    debug(`Directory changed to: ${directory}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? "Directory changed successfully." : "Failed to change directory."
    });
  } catch (err) {
    debug(`Error changing directory: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error changing directory");
  }
};
