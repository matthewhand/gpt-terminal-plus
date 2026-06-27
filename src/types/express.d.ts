import { ServerHandler } from "../utils/ServerHandler.js";

declare global {
  namespace Express {
    interface Request {
      server?: ServerHandler;
    }
  }
}
