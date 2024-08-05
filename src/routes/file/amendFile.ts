import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

/**
 * Endpoint to amend a file on the server.
 * @param req - Express request object
 * @param res - Express response object
 */
export const amendFile = async (req: Request, res: Response) => {
  try {
    const { filePath, content, backup = true } = req.body;

    // Debug: Log received parameters
    console.log("Received parameters:", { filePath, content, backup });

    // Guards
    if (!filePath || !content) {
      return res.status(400).json({ error: "File path and content are required" });
    }

    const serverHandler = getServerHandler(req);
    if (!serverHandler) {
      throw new Error("Server handler not found");
    }

    const success = await serverHandler.amendFile(filePath, content, backup);

    res.status(success ? 200 : 400).json({ message: success ? "File amended successfully." : "Failed to amend file." });
  } catch (error) {
    handleServerError(error, res, "Error amending file");
  }
};
