import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import Debug from 'debug';
import { errorHandler } from './errorHandler';
import { generalRateLimit } from './rateLimit';
import { logMode } from './logMode';

const debug = Debug('app:setupMiddlewares');

/**
 * Sets up all middlewares for the Express application.
 * @param {express.Application} app - The Express application instance.
 */
const setupMiddlewares = (app: express.Application): void => {
  debug('Setting up middlewares, with conditional /health logging suppression...');

  // Security headers (helmet) - must be first
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // Compression middleware
  app.use(compression({
    level: 6, // Good balance between compression and performance
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req: express.Request, res: express.Response) => {
      // Don't compress responses with this request header
      if (req.headers['x-no-compression']) {
        return false;
      }
      // Use compression filter function
      return compression.filter(req, res);
    }
  }));

  // Rate limiting - applied early but after security headers
  app.use('/api/', generalRateLimit);
  app.use('/command/', generalRateLimit);
  app.use('/file/', generalRateLimit);
  app.use('/server/', generalRateLimit);

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
  const isTest = process.env.NODE_ENV === 'test';
  
  // Check if private network access should be disabled
  const disablePrivateNetwork = process.env.DISABLE_PRIVATE_NETWORK_ACCESS === 'true';
  
  const corsOptions: cors.CorsOptions = isTest
    ? {
        origin: (_origin, cb) => cb(null, true),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      }
    : {
        origin: (process.env.CORS_ORIGIN
          ? process.env.CORS_ORIGIN.split(',')
          : disablePrivateNetwork 
            ? ['https://chat.openai.com', 'https://chatgpt.com']
            : [
                'https://chat.openai.com', 
                'https://chatgpt.com',
                'http://localhost:5004',
                'http://127.0.0.1:5004',
                'http://localhost:3000',
                'http://127.0.0.1:3000'
              ]) as any,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      };

  const originsLog = Array.isArray((corsOptions as any).origin)
    ? (corsOptions as any).origin.join(', ')
    : (isTest ? 'TEST:any' : 'custom');
  console.log('CORS configuration set to: ' + originsLog);
  app.use(cors(corsOptions));

  // Body parsing middleware
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
  // Support raw text/yaml bodies for profiles import endpoint
  app.use(bodyParser.text({ type: ['text/*', 'application/yaml', 'application/x-yaml'], limit: '5mb' }));

  // Log mode detection for debugging
  app.use(logMode);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  debug('Middlewares setup completed with security, compression, and rate limiting.');
};

export default setupMiddlewares;
