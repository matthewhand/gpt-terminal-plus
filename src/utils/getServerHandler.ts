import { ServerHandler } from "../types/ServerHandler";
import type { ServerRequest } from "../types/ServerRequest";

/**
 * Safely gets the server handler from the request.
 * @param {Request} req - The request object.
 * @returns {ServerHandler} - The server handler.
 * @throws {Error} - If the server handler is not found.
 */
export const getServerHandler = (req: ServerRequest): ServerHandler => {
  const server = req.server ?? req.serverHandler;
  if (!server) {
    throw new Error("Server handler not found on request object");
  }
  return server;
};
