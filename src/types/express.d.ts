import { ServerHandler } from "../types/ServerHandler";

declare module "express-serve-static-core" {
  interface Request {
    serverHandler?: ServerHandler;
  }
}

