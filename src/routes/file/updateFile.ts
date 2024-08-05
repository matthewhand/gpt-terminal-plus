import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

export const updateFile = async (req: Request, res: Response) => {
  const { filePath, pattern, replacement, multiline = false } = req.body;

  if (!filePath || !pattern || !replacement) {
    return res.status(400).json({ error: "File path, pattern, and replacement are required" });
  }

  try {
    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const success = await server.updateFile(filePath, pattern, replacement, multiline);

    res.status(success ? 200 : 400).json({ message: success ? "File updated successfully." : "Failed to update file." });
  } catch (error) {
    handleServerError(error, res, "Error updating file");
  }
};
