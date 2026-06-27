import express from 'express';
import setupMiddlewares from '../middlewares/setupMiddlewares.js';

export function createTestApp() {
  const app = express();
  setupMiddlewares(app);
  return app;
}
