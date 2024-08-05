import { Request, Response } from "express";
import path from "path";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

export const listFiles = async (req: Request, res: Response) => {
  const { directory, limit, offset, orderBy } = req.body;

  try {
    const ServerHandler = getServerHandler(req);
    if (!ServerHandler) {
      throw new Error("Server handler not found");
    }

    const targetDirectory = directory || await ServerHandler.presentWorkingDirectory();
    const files = await ServerHandler.listFiles(targetDirectory);

    res.status(200).json({ files });
  } catch (error) {
    handleServerError(error, res, "Error listing files");
  }
};
