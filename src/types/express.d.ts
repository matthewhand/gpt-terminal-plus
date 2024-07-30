import { ServerHandler } from '../handlers/ServerHandler';

/**
 * Extends the Express Request interface to include custom properties.
 */
declare module 'express-serve-static-core' {
  interface Request {
    /** Optional property to hold the server handler instance. */
    serverHandler?: ServerHandler;

    /** Property to hold the request body. */
    body: any;
  }
}
