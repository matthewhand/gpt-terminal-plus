import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';

jest.mock('helmet', () => jest.fn(() => (req: any, res: any, next: any) => next()));
jest.mock('cors', () => jest.fn(() => (req: any, res: any, next: any) => next()));
jest.mock('compression', () => ({
  __esModule: true,
  default: jest.fn(() => (req: any, res: any, next: any) => next()),
  filter: jest.fn()
}));
jest.mock('morgan', () => jest.fn(() => (req: any, res: any, next: any) => next()));
jest.mock('body-parser', () => ({
  json: jest.fn(() => (req: any, res: any, next: any) => next()),
  urlencoded: jest.fn(() => (req: any, res: any, next: any) => next()),
  text: jest.fn(() => (req: any, res: any, next: any) => next())
}));
jest.mock('../../src/middlewares/errorHandler', () => ({
  errorHandler: jest.fn()
}));
jest.mock('../../src/middlewares/rateLimit', () => ({
  generalRateLimit: jest.fn(() => (req: any, res: any, next: any) => next()),
  chatRateLimit: jest.fn(),
  fileRateLimit: jest.fn(),
  advancedRateLimit: { rateLimiters: { moderate: jest.fn(), lenient: jest.fn(), strict: jest.fn() } }
}));
jest.mock('../../src/middlewares/logMode', () => jest.fn(() => (req: any, res: any, next: any) => next()));

describe('setupMiddlewares', () => {
  let app: express.Application;
  let useSpy: jest.SpyInstance;

  beforeEach(() => {
    app = express();
    useSpy = jest.spyOn(app, 'use');
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('helmet security headers', () => {
    it('should apply helmet with CSP and HSTS', () => {
      const helmet = require('helmet');
      setupMiddlewares(app);

      expect(helmet).toHaveBeenCalledWith({
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
      });
      expect(useSpy).toHaveBeenCalledWith(expect.any(Function)); // helmet middleware
    });
  });

  describe('compression', () => {
    it('should apply compression with custom settings', () => {
      const compression = require('compression').default;
      setupMiddlewares(app);

      expect(compression).toHaveBeenCalledWith({
        level: 6,
        threshold: 1024,
        filter: expect.any(Function)
      });
    });
  });

  describe('rate limiting', () => {
    it('should apply rate limiting to specific routes', () => {
      setupMiddlewares(app);

      expect(useSpy).toHaveBeenCalledWith('/api/', expect.any(Function));
      expect(useSpy).toHaveBeenCalledWith('/command/', expect.any(Function));
      expect(useSpy).toHaveBeenCalledWith('/file/', expect.any(Function));
      expect(useSpy).toHaveBeenCalledWith('/server/', expect.any(Function));
    });
  });

  describe('HTTP logging', () => {
    it('should apply morgan logging with health check suppression', () => {
      const morgan = require('morgan');
      setupMiddlewares(app);

      expect(morgan).toHaveBeenCalledWith('combined');
      // Should have a middleware that checks for /health
      expect(useSpy).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should suppress logging for health check when DISABLE_HEALTH_LOG=true', () => {
      process.env.DISABLE_HEALTH_LOG = 'true';
      setupMiddlewares(app);

      // The middleware function should skip logging for /health
      const middlewareCalls = useSpy.mock.calls.filter(call =>
        typeof call[0] === 'function' && call[0].toString().includes('DISABLE_HEALTH_LOG')
      );
      expect(middlewareCalls.length).toBeGreaterThan(0);
    });
  });

  describe('CORS configuration', () => {
    describe('test environment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('should allow all origins in test mode', () => {
        const cors = require('cors');
        setupMiddlewares(app);

        expect(cors).toHaveBeenCalledWith({
          origin: expect.any(Function),
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        });
      });
    });

    describe('production environment', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
      });

      it('should use default origins when no CORS_ORIGIN set', () => {
        const cors = require('cors');
        setupMiddlewares(app);

        expect(cors).toHaveBeenCalledWith({
          origin: [
            'https://chat.openai.com',
            'https://chatgpt.com',
            'http://localhost:5004',
            'http://127.0.0.1:5004',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
          ],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        });
      });

      it('should use custom CORS_ORIGIN when set', () => {
        process.env.CORS_ORIGIN = 'https://custom.com,https://another.com';
        const cors = require('cors');
        setupMiddlewares(app);

        expect(cors).toHaveBeenCalledWith({
          origin: ['https://custom.com', 'https://another.com'],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        });
      });

      it('should use private network defaults when DISABLE_PRIVATE_NETWORK_ACCESS=true', () => {
        process.env.DISABLE_PRIVATE_NETWORK_ACCESS = 'true';
        const cors = require('cors');
        setupMiddlewares(app);

        expect(cors).toHaveBeenCalledWith({
          origin: ['https://chat.openai.com', 'https://chatgpt.com'],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        });
      });
    });
  });

  describe('body parsing', () => {
    it('should apply JSON body parser', () => {
      const bodyParser = require('body-parser');
      setupMiddlewares(app);

      expect(bodyParser.json).toHaveBeenCalledWith({ limit: '10mb' });
      expect(bodyParser.urlencoded).toHaveBeenCalledWith({ extended: true, limit: '10mb' });
      expect(bodyParser.text).toHaveBeenCalledWith({
        type: ['text/*', 'application/yaml', 'application/x-yaml'],
        limit: '5mb'
      });
    });
  });

  describe('log mode', () => {
    it('should apply log mode middleware', () => {
      const logMode = require('../../src/middlewares/logMode');
      setupMiddlewares(app);

      expect(logMode).toHaveBeenCalled();
    });
  });

  describe('error handler', () => {
    it('should apply error handler as last middleware', () => {
      const { errorHandler } = require('../../src/middlewares/errorHandler');
      setupMiddlewares(app);

      // Error handler should be applied last
      const lastCall = useSpy.mock.calls[useSpy.mock.calls.length - 1];
      expect(lastCall[0]).toBe(errorHandler);
    });
  });

  describe('console logging', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should log CORS configuration', () => {
      process.env.NODE_ENV = 'test';
      setupMiddlewares(app);

      expect(consoleLogSpy).toHaveBeenCalledWith('CORS configuration set to: TEST:any');
    });
  });
});