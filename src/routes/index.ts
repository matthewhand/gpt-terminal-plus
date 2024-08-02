import { Express, Router, Request, Response } from 'express';
import fileRoutes from './fileRoutes';
import commandRoutes from './commandRoutes';
import serverRoutes from './serverRoutes';
import publicRouter from './publicRouter';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { initializeServerHandler } from '../middlewares/initializeServerHandler';
import Debug from 'debug';

const debug = Debug('app:routes:index');

/**
 * Set up routes based on environment variables.
 * @param router - The Express Router instance.
 */
export const setupRoutes = (router: Router): void => {
  const enableFileManagement = process.env.ENABLE_FILE_MANAGEMENT !== 'false';
  const enableCommandManagement = process.env.ENABLE_COMMAND_MANAGEMENT !== 'false';
  const enableServerManagement = process.env.ENABLE_SERVER_MANAGEMENT !== 'false';

  debug('Setting up routes with configurations:', {
    enableFileManagement,
    enableCommandManagement,
    enableServerManagement,
  });

  if (enableFileManagement) {
    debug("File management is enabled.");
    router.use('/files', fileRoutes);
  } else {
    debug("File management is disabled.");
  }

  if (enableCommandManagement) {
    debug("Command management is enabled.");
    router.use('/commands', commandRoutes);
  } else {
    debug("Command management is disabled.");
  }

  if (enableServerManagement) {
    debug("Server management is enabled.");
    router.use('/servers', serverRoutes);
  } else {
    debug("Server management is disabled. Defaulting to local server configuration.");
    // Additional logic to default to local server configuration can be added here
  }

  // Add other routes here
  router.use(publicRouter);
};

/**
 * Set up API router with authentication and server handler initialization.
 * @param app - The Express application instance.
 */
export const setupApiRouter = (app: Express): void => {
  const apiRouter = Router();

  // Check if API_TOKEN is configured
  if (!process.env.API_TOKEN) {
    console.warn("Warning: No API_TOKEN configured. Using staticRouter.");

    // Use staticRouter to respond with a message indicating no API_TOKEN
    const staticRouter = Router();
    staticRouter.use((req: Request, res: Response) => {
      res.status(504).json({
        error: "Service unavailable: No API_TOKEN configured. Access is restricted.",
      });
    });

    app.use(staticRouter);
  } else {
    // API Router setup with authentication and server handler initialization
    apiRouter.use(checkAuthToken);
    apiRouter.use(initializeServerHandler);

    // Set up routes
    setupRoutes(apiRouter);

    app.use(apiRouter);
  }
};
