import { Request, Response } from "express";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

export const createFile = async (req: Request, res: Response) => {
  const { directory, filename, content, backup = true } = req.body;

  if (!filename || !directory) {
    return res.status(400).json({ error: "Filename and directory are required" });
  }

  try {
    const serverHandler = getServerHandler(req);
    if (!serverHandler) {
      throw new Error("Server handler not found");
    }

    const success = await serverHandler.createFile(directory, filename, content, backup);

    res.status(success ? 200 : 400).json({ message: success ? "File created successfully." : "Failed to create file." });
  } catch (error) {
    handleServerError(error, res, "Error creating file");
  }
};
