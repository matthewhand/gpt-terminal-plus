import type { Express } from 'express';
import { Router } from 'express';

import fileRoutes from './fileRoutes';
import commandRoutes from './commandRoutes';
import serverRoutes from './serverRoutes';
import publicRouter from './publicRouter';
import modelRoutes from './modelRoutes';
import chatRoutes from './chatRoutes';
import setupRouter from './setupRoutes'; // this is a Router instance

/** Wire up all feature routers onto a provided Router. */
export const setupRoutes = (router: Router): void => {
  router.use('/file', fileRoutes);
  router.use('/command', commandRoutes);
  router.use('/server', serverRoutes);
  router.use('/model', modelRoutes);
  router.use('/chat', chatRoutes);
  router.use('/setup', setupRouter);
  router.use(publicRouter);
};

/**
 * Test-friendly helper:
 * - If `app` is provided, mounts the API router on the app and returns the app.
 * - If not, returns a standalone router with routes wired up.
 */
export function setupApiRouter(app?: Express) {
  const router = Router();
  setupRoutes(router);
  if (app) {
    app.use('/', router);
    return app;
  }
  return router;
}

export default setupRoutes;
