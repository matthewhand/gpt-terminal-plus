import { ServerHandler } from "../utils/ServerHandler";

declare global {
  namespace Express {
    interface Request {
      server?: ServerHandler;
    }
  }
}
