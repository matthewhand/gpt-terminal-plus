import { Request, Response } from "express";
import Debug from "debug";
import { handleServerError } from "../../utils/handleServerError";
import { getServerHandler } from "../../utils/getServerHandler";

const debug = Debug("app:server:getSystemInfo");

/**
 * Function to get system info for the current server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const getSystemInfo = async (req: Request, res: Response) => {
  try {
    const serverHandler = getServerHandler(req);
    const systemInfo = await serverHandler.getSystemInfo();
    res.status(200).json(systemInfo);
  } catch (error) {
    debug(`Error retrieving system info: ${error instanceof Error ? error.message : "Unknown error"}`);
    handleServerError(error, res, "Error retrieving system info");
  }
};
