import { Request } from "express";
import { ServerHandler } from "../types/ServerHandler";

/**
 * Safely gets the server handler from the request.
 * @param {Request} req - The request object.
 * @returns {ServerHandler} - The server handler.
 * @throws {Error} - If the server handler is not found.
 */
export const getServerHandler = (req: Request): ServerHandler => {
  const serverHandler = req.serverHandler as ServerHandler | undefined;
  if (!serverHandler) {
    throw new Error("Server handler not found on request object");
  }
  return serverHandler;
};
