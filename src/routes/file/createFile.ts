import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

export const createFile = async (req: Request, res: Response) => {
  const { filePath, content, backup = true } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  try {
    const server = getServerHandler(req);
    if (!server) {
      throw new Error("Server handler not found");
    }

    const success = await server.createFile(filePath, content, backup);

    res.status(success ? 200 : 400).json({ message: success ? "File created successfully." : "Failed to create file." });
  } catch (error) {
    handleServerError(error, res, "Error creating file");
  }
};
