// src/types/express.d.ts

import { LocalServerHandler } from '../handlers/LocalServerHandler';
import { RemoteServerHandler } from '../handlers/RemoteServerHandler';

declare module 'express-serve-static-core' {
  interface Request {
    serverHandler?: LocalServerHandler | RemoteServerHandler;
  }
}
