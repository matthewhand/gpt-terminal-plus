import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import Debug from 'debug';
import { errorHandler } from './errorHandler';

const debug = Debug('app:setupMiddlewares');

/**
 * Sets up all middlewares for the Express application.
 * @param {express.Application} app - The Express application instance.
 */
const setupMiddlewares = (app: express.Application): void => {
  debug('Setting up middlewares, with conditional /health logging suppression...');

  // HTTP request logging with optional /health suppression
  const httpLogger = morgan('combined');
  app.use((req, res, next) => {
    const suppressHealth = req.path === '/health' && process.env.DISABLE_HEALTH_LOG === 'true';
    if (suppressHealth) {
      return next();
    }
    debug('Logging request to ' + req.path);
    return httpLogger(req, res, next);
  });

  // Determine CORS origin based on environment variable or use defaults
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['https://chat.openai.com', 'https://chatgpt.com'];

  console.log('CORS configuration set to: ' + corsOrigin.join(', '));
  app.use(cors({ origin: corsOrigin }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // Support raw text/yaml bodies for profiles import endpoint
  app.use(bodyParser.text({ type: ['text/*', 'application/yaml', 'application/x-yaml'], limit: '5mb' }));

  // Error handling middleware (must be last)
  app.use(errorHandler);

  debug('Middlewares setup completed.');
};

export default setupMiddlewares;
