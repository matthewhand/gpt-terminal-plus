import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import Debug from 'debug';

const debug = Debug('app:setupMiddlewares');

/**
 * Sets up all middlewares for the Express application.
 * @param {express.Application} app - The Express application instance.
 */
const setupMiddlewares = (app: express.Application): void => {
  app.use(express.static('public'));
  debug('Setting up middlewares, including custom handling for /health endpoint suppression...');

  // Use morgan for logging HTTP requests
  app.use(morgan('combined'));

  // Custom middleware to suppress /health logs
  app.use((req, res, next) => {
    if (req.path !== '/health' || process.env.DISABLE_HEALTH_LOG !== 'true') {
      debug('Logging request to ' + req.path); morgan('combined')(req, res, next);
    } else {
      next();
    }
  });

  // Determine CORS origin based on environment variable or use defaults
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['https://chat.openai.com', 'https://chatgpt.com'];

  console.log('CORS configuration set to: ' + corsOrigin.join(', '));
  app.use(cors({ origin: corsOrigin }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  debug('Middlewares setup completed.');
};

export default setupMiddlewares;
