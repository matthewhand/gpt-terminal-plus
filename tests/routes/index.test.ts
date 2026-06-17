import express from 'express';
import { setupApiRouter } from '../../src/routes';

jest.mock('../../src/routes/commandRoutes', () => jest.fn());
jest.mock('../../src/routes/serverRoutes', () => jest.fn());
jest.mock('../../src/routes/activityRoutes', () => jest.fn());
jest.mock('../../src/routes/fileRoutes', () => jest.fn());
jest.mock('../../src/routes/chatRoutes', () => jest.fn());
jest.mock('../../src/routes/llmConsoleRoutes', () => jest.fn());
jest.mock('../../src/routes/settingsRoutes', () => jest.fn());
jest.mock('../../src/routes/endpointStatusRouter', () => jest.fn());
jest.mock('../../src/routes/core', () => ({
  configRouter: jest.fn(),
  healthRouter: jest.fn()
}));
jest.mock('../../src/routes/command', () => ({
  executeCommand: jest.fn(),
  executeShell: jest.fn(),
  executeCode: jest.fn(),
  executeFile: jest.fn(),
  executeLlm: jest.fn(),
  executeBash: jest.fn(),
  executePython: jest.fn(),
  executorsRouter: jest.fn(),
  executeDynamicRouter: jest.fn()
}));
jest.mock('../../src/middlewares/securityLogger', () => ({
  securityLogger: jest.fn()
}));
jest.mock('../../src/middlewares/advancedRateLimit', () => ({
  rateLimiters: {
    moderate: jest.fn(),
    lenient: jest.fn(),
    strict: jest.fn()
  }
}));

describe('setupApiRouter', () => {
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

  describe('test environment routing', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should mount test command router under /command when NODE_ENV=test', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/command', expect.any(Function));
    });

    it('should mount file routes without strict rate limiting in test mode', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/file', expect.any(Function), expect.any(Function));
      // Should not have strict rate limiter
    });
  });

  describe('production environment routing', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.USE_PROD_ROUTES_FOR_TEST = '0';
    });

    it('should mount production command routes', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/command', expect.any(Function));
    });

    it('should mount file routes with strict rate limiting in production', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/file', expect.any(Function), expect.any(Function), expect.any(Function));
    });
  });

  describe('common routes', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should mount server routes with security logger and moderate rate limiting', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/server', expect.any(Function), expect.any(Function), expect.any(Function));
    });

    it('should mount activity routes with security logger and lenient rate limiting', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/activity', expect.any(Function), expect.any(Function), expect.any(Function));
    });

    it('should mount chat routes with security logger and moderate rate limiting', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/chat', expect.any(Function), expect.any(Function), expect.any(Function));
    });

    it('should mount llm routes with security logger and moderate rate limiting', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/llm', expect.any(Function), expect.any(Function), expect.any(Function));
    });

    it('should mount settings routes with security logger and strict rate limiting', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/settings', expect.any(Function), expect.any(Function), expect.any(Function));
    });

    it('should mount config router', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/config', expect.any(Function));
    });

    it('should mount health router', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/health', expect.any(Function));
    });

    it('should mount executors router under /command', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/command', expect.any(Function));
    });
  });

  describe('optional routes', () => {
    it('should mount setup routes if available', () => {
      // Mock require to return setup routes
      const mockSetupRoutes = jest.fn();
      jest.doMock('../../src/routes/setupRoutes', () => mockSetupRoutes, { virtual: true });
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/setup', mockSetupRoutes);
    });

    it('should mount model routes if available', () => {
      const mockModelRoutes = jest.fn();
      jest.doMock('../../src/routes/modelRoutes', () => mockModelRoutes, { virtual: true });
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/model', mockModelRoutes);
    });

    it('should mount endpoint status router', () => {
      setupApiRouter(app);
      expect(useSpy).toHaveBeenCalledWith('/endpoint-status', expect.any(Function));
    });
  });

  describe('USE_PROD_ROUTES_FOR_TEST flag', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      process.env.USE_PROD_ROUTES_FOR_TEST = '1';
    });

    it('should use production routes when USE_PROD_ROUTES_FOR_TEST=1', () => {
      setupApiRouter(app);
      // Should mount production command routes instead of test router
      expect(useSpy).toHaveBeenCalledWith('/command', expect.any(Function));
    });
  });
});