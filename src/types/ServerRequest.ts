import type { Request } from 'express';
import type { ServerHandler } from './ServerHandler';

export type ServerRequest = Request & {
  server?: ServerHandler;
  serverHandler?: ServerHandler;
};
