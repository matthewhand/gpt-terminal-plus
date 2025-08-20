import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import routes from '../../src/routes';

export async function makeProdApp() {
  const app = express();
  
  // Setup middlewares like production
  setupMiddlewares(app);
  
  // Mount routes
  app.use('/', routes);
  
  return app;
}