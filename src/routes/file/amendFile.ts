import path from "path";
import Debug from "debug";
import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

const debug = Debug("app:file:amend");

/**
 * Function to amend a file by appending content to it.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const amendFile = async (req: Request, res: Response) => {
  const { directory, filename, content, backup = true } = req.body;

  if (!filename || content === undefined) {
    debug("Filename and content are required but not provided.");
    return res.status(400).json({ error: "Filename and content are required" });
  }

  try {
    const serverHandler = getServerHandler(req);
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.isAbsolute(filename) ? filename : path.join(targetDirectory, filename);

    const success = await serverHandler.amendFile(fullPath, content, backup);
    debug(`File amended: ${fullPath}, content: ${content}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? "File amended successfully." : "Failed to amend file."
    });
  } catch (err) {
    debug(`Error amending file: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error amending file");
  }
};
