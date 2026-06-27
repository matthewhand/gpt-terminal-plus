import type { ServerHandler } from '../ServerHandler.js';

declare global {
  namespace Express {
    interface Request {
      server?: ServerHandler;
      serverHandler?: ServerHandler;
    }
  }
}

export {};
