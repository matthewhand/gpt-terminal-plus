import { Request, Response } from "express";

import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";
import { ListParams } from "../../types/ListParams";

export const listFiles = async (req: Request, res: Response) => {
  const { directory, limit, offset, orderBy } = req.body;

  try {
    const ServerHandler = getServerHandler(req);
    if (!ServerHandler) {
      throw new Error("Server handler not found");
    }

    const dir = (typeof directory === 'string' && directory.trim() !== '')
      ? directory
      : await ServerHandler.presentWorkingDirectory();

    const params: ListParams = {
      directory: dir,
      limit: typeof limit === 'number' ? limit : (typeof limit === 'string' ? parseInt(limit, 10) : undefined),
      offset: typeof offset === 'number' ? offset : (typeof offset === 'string' ? parseInt(offset, 10) : undefined),
      orderBy: orderBy === 'datetime' ? 'datetime'
        : orderBy === 'filename' ? 'filename'
        : undefined,
    };

    const paginated = await ServerHandler.listFiles(params);
    res.status(200).json(paginated);
  } catch (error) {
    handleServerError(error, res, "Error listing files");
  }
};
