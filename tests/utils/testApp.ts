import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';

export async function makeProdApp() {
  const app = express();

  // Setup middlewares like production
  setupMiddlewares(app);

  // Mount routes module correctly (supports both named and default export)
  // Using require to avoid TS/ESM interop issues in tests
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const routesMod = require('../../src/routes');
  if (typeof routesMod.setupApiRouter === 'function') {
    routesMod.setupApiRouter(app);
  } else if (typeof routesMod.default === 'function') {
    routesMod.default(app);
  } else {
    throw new Error('routes module did not export a router setup function');
  }

  return app;
}
