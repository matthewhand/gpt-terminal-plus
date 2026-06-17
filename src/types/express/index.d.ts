import type { ServerHandler } from '../ServerHandler';

declare global {
  namespace Express {
    interface Request {
      server?: ServerHandler;
      serverHandler?: ServerHandler;
    }
  }
}

export {};
