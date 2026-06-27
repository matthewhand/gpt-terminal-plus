import type { Request } from 'express';
import type { ServerHandler } from './ServerHandler.js';

export type ServerRequest = Request & {
  server?: ServerHandler;
  serverHandler?: ServerHandler;
};
