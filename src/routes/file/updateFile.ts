import path from "path";
import Debug from "debug";
import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

const debug = Debug("app:file:update");

/**
 * Function to update a file by replacing a pattern with a replacement.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const updateFile = async (req: Request, res: Response) => {
  const { directory, filename, pattern, replacement, backup = true, multiline = false } = req.body;

  if (!filename || !pattern || replacement === undefined) {
    debug("Filename, pattern, and replacement are required but not provided.");
    return res.status(400).json({ error: "Filename, pattern, and replacement are required" });
  }

  try {
    const serverHandler = getServerHandler(req);
    const targetDirectory = directory || await serverHandler.presentWorkingDirectory();
    const fullPath = path.isAbsolute(filename) ? filename : path.join(targetDirectory, filename);

    const success = await serverHandler.updateFile(fullPath, pattern, replacement, backup, multiline);
    debug(`File updated: ${fullPath}, pattern: ${pattern}, replacement: ${replacement}, multiline: ${multiline}, success: ${success}`);
    res.status(success ? 200 : 400).json({
      message: success ? "File updated successfully." : "Failed to update file."
    });
  } catch (err) {
    debug(`Error updating file: ${err instanceof Error ? err.message : String(err)}`);
    handleServerError(err, res, "Error updating file");
  }
};
