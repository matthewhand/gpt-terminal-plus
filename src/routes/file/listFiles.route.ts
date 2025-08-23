import { Request, Response } from "express";

import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

export const listFiles = async (req: Request, res: Response) => {
  const { directory, limit, offset, orderBy, recursive, typeFilter } = req.body;

  try {
    const ServerHandler = getServerHandler(req);
    if (!ServerHandler) {
      throw new Error("Server handler not found");
    }

    const files = await ServerHandler.listFiles({ directory: directory || '.', limit, offset, orderBy, recursive, typeFilter });

    res.status(200).json({ files });
  } catch (error) {
    handleServerError(error, res, "Error listing files");
  }
};
