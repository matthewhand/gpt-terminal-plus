// src/types/express.d.ts
import { ServerHandler } from '../handlers/ServerHandler';

declare module 'express-serve-static-core' {
  interface Request {
    serverHandler?: ServerHandler;
    body: any;
  }
}

