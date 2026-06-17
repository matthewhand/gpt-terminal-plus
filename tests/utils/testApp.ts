import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import { getOrGenerateApiToken } from '../../src/common/apiToken';

/**
 * Shared helper to create a production-like app (with full middlewares + routes)
 * for tests that need real route wiring (e.g. circuit breakers, limits).
 *
 * Handles common shared test setup issues:
 * - Ensures NODE_CONFIG_DIR for convict/test config
 * - Ensures API_TOKEN via getOrGenerate so checkAuthToken + convictConfig succeed
 * - Callers must send Authorization: Bearer <token> header on requests (or set NODE_ENV=development to bypass)
 */
export async function makeProdApp() {
  // Ensure test config is active (script sets it but direct jest or sub-invokes may not)
  if (!process.env.NODE_CONFIG_DIR) {
    process.env.NODE_CONFIG_DIR = 'config/test';
  }

  // Ensure token exists so auth middleware (which runs in prod routes) and security config succeed.
  // getOrGenerateApiToken() will populate process.env.API_TOKEN if missing.
  getOrGenerateApiToken();

  const app = express();

  // Setup middlewares like production (includes checkAuthToken, which is strict under NODE_ENV=test)
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

/**
 * Lightweight shared helper mirroring the duplicated `makeApp` pattern used
 * across many route tests. Creates express app + middlewares + routes.
 * Prefer this over copy-pasted local makeApp functions.
 * Does not force NODE_CONFIG_DIR or token (callers manage auth as before).
 */
export function makeTestApp() {
  const app = express();
  setupMiddlewares(app);

  // Mount routes module correctly (supports both named and default export)
  // Using require to avoid TS/ESM interop issues in tests
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const routesMod = require('../../src/routes');
  if (typeof routesMod.setupApiRouter === 'function') {
    routesMod.setupApiRouter(app);
  } else if (typeof routesMod.default === 'function') {
    routesMod.default(app);
  }
  // silent fallback for minimal cases; some tests mount manually
  return app;
}
