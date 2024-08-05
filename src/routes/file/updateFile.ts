import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import path from "path";

/**
 * Endpoint to update a file on the server.
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateFile = async (req: Request, res: Response) => {
  try {
    const { directory, filename, pattern, replacement, backup = true, multiline = false } = req.body;

    // Debug: Log received parameters
    console.log("Received parameters:", { directory, filename, pattern, replacement, backup, multiline });

    // Guards
    if (!filename || !directory || !pattern || !replacement) {
      return res.status(400).json({ error: "Filename, directory, pattern, and replacement are required" });
    }

    const filePath = path.join(directory, filename);
    const serverHandler = getServerHandler(req);
    if (!serverHandler) {
      throw new Error("Server handler not found");
    }

    const success = await serverHandler.updateFile(filePath, pattern, replacement, backup, multiline);

    res.status(success ? 200 : 400).json({ message: success ? "File updated successfully." : "Failed to update file." });
  } catch (error) {
    handleServerError(error, res, "Error updating file");
  }
};
