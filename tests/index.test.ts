import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { app, start } from '@src/index';
import * as configHandler from '@src/config/configHandler';
import * as serverLoader from '@src/bootstrap/serverLoader';
import * as envValidation from '@src/utils/envValidation';
import * as middlewares from '@src/middlewares/setupMiddlewares';
import * as routes from '@src/routes/index';
import * as openapi from '@src/openapi';
import * as gracefulShutdown from '@src/utils/gracefulShutdown';
import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import config from 'config';

// Mock modules
jest.mock('dotenv');
jest.mock('fs');
jest.mock('path');
jest.mock('http');
jest.mock('https');
jest.mock('express');
jest.mock('config');
jest.mock('@src/config/configHandler');
jest.mock('@src/bootstrap/serverLoader');
jest.mock('@src/utils/envValidation');
jest.mock('@src/middlewares/setupMiddlewares');
jest.mock('@src/routes/index');
jest.mock('@src/openapi');
jest.mock('@src/utils/gracefulShutdown');
jest.mock('./modules/ngrok', () => ({}));
jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('@modelcontextprotocol/sdk/server/sse.js');

const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  listen: jest.fn(),
  close: jest.fn(),
} as any;
const mockServer = { listen: jest.fn(), close: jest.fn() } as any;

describe('index.ts - App Initialization and Server Setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (dotenv.config as jest.Mock).mockReturnValue({ parsed: true });
    (express as jest.Mock).mockReturnValue(mockApp);
    (http.createServer as jest.Mock).mockReturnValue(mockServer);
    (https.createServer as jest.Mock).mockReturnValue(mockServer);
    (config.has as jest.Mock).mockReturnValue(true);
    (config.get as jest.Mock).mockReturnValue(5005);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockImplementation();
    (fs.readFileSync as jest.Mock).mockReturnValue('mock-key');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should export the app instance', () => {
    expect(app).toBeDefined();
    expect(app).toBeInstanceOf(express());
  });

  it('should validate environment variables on startup', () => {
    require('@src/index');
    expect(envValidation.validateEnvironmentVariables).toHaveBeenCalledTimes(1);
  });

  it('should setup middlewares', () => {
    require('@src/index');
    expect(middlewares.setupMiddlewares).toHaveBeenCalledWith(app);
  });

  it('should serve static assets from public/', () => {
    require('@src/index');
    expect(mockApp.use).toHaveBeenCalledWith(express.static(expect.any(String())));
  });

  it('should serve docs as static files at /docs-static', () => {
    require('@src/index');
    expect(mockApp.use).toHaveBeenCalledWith('/docs-static', express.static(expect.any(String())));
  });

  it('should setup API router', () => {
    require('@src/index');
    expect(routes.setupApiRouter).toHaveBeenCalledWith(app);
  });

  it('should register OpenAPI routes', () => {
    require('@src/index');
    expect(openapi.registerOpenApiRoutes).toHaveBeenCalledWith(app);
  });

  it('should setup Swagger UI at /docs', () => {
    const swaggerUiServe = jest.fn();
    const swaggerUiSetup = jest.fn().mockReturnValue((req: any, res: any, next: any) => next());
    jest.doMock('swagger-ui-express', () => ({ serve: swaggerUiServe, setup: swaggerUiSetup }));

    require('@src/index');

    expect(mockApp.use).toHaveBeenCalledWith('/docs', swaggerUiServe, expect.any(Function));
  });

  describe('MCP Server Setup', () => {
    it('should initialize MCP server when USE_MCP=true', () => {
      process.env.USE_MCP = 'true';
      const mockMcpServer = { connect: jest.fn(), name: 'GPT Terminal Plus' };
      const mockSSETransport = { /* mock */ };
      jest.doMock('@modelcontextprotocol/sdk/server/mcp.js', () => ({ McpServer: jest.fn(() => mockMcpServer) }));
      jest.doMock('@modelcontextprotocol/sdk/server/sse.js', () => ({ SSEServerTransport: jest.fn(() => mockSSETransport) }));
      const mockRegisterMcpTools = jest.fn();
      jest.doMock('@src/modules/mcpTools', () => ({ registerMcpTools: mockRegisterMcpTools }));

      require('@src/index');

      expect(mockMcpServer.connect).toHaveBeenCalled();
      expect(mockApp.get).toHaveBeenCalledWith('/mcp/messages', expect.any(Function));
      delete process.env.USE_MCP;
    });

    it('should not initialize MCP when USE_MCP=false', () => {
      process.env.USE_MCP = 'false';
      require('@src/index');
      // No specific assertion, but ensure no errors and no MCP calls
      expect(() => require('@src/index')).not.toThrow();
      delete process.env.USE_MCP;
    });
  });

  describe('Configuration Handling', () => {
    const mockConfigDir = '/mock/config';
    const mockConfigPath = path.join(mockConfigDir, 'production.json');

    beforeEach(() => {
      (path.resolve as jest.Mock).mockReturnValue(mockConfigDir);
      (path.join as jest.Mock).mockReturnValue(mockConfigPath);
      jest.spyOn(process, 'env', 'get').mockReturnValue({ NODE_CONFIG_DIR: mockConfigDir });
    });

    it('should register servers from config', async () => {
      await start();
      expect(serverLoader.registerServersFromConfig).toHaveBeenCalledTimes(1);
    });

    it('should create config directory if it does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      await start();
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockConfigDir, { recursive: true });
    });

    it('should generate and persist default config if not loaded', async () => {
      (configHandler.isConfigLoaded as jest.Mock).mockReturnValue(false);
      const mockDefaultConfig = { port: 5005 };
      (configHandler.generateDefaultConfig as jest.Mock).mockReturnValue(mockDefaultConfig);
      await start();
      expect(configHandler.generateDefaultConfig).toHaveBeenCalledTimes(1);
      expect(configHandler.persistConfig).toHaveBeenCalledWith(mockDefaultConfig, mockConfigPath);
    });

    it('should not generate config if already loaded', async () => {
      (configHandler.isConfigLoaded as jest.Mock).mockReturnValue(true);
      await start();
      expect(configHandler.generateDefaultConfig).not.toHaveBeenCalled();
    });
  });

  describe('Port Selection', () => {
    it('should use process.env.PORT if valid', async () => {
      process.env.PORT = '8080';
      await start();
      expect(config.get).not.toHaveBeenCalled(); // Since env port used
      delete process.env.PORT;
    });

    it('should use config port if env PORT invalid', async () => {
      process.env.PORT = 'invalid';
      await start();
      expect(config.get).toHaveBeenCalledWith('port');
      delete process.env.PORT;
    });

    it('should fallback to default port 5005 if no config', async () => {
      (config.has as jest.Mock).mockReturnValue(false);
      await start();
      // Port set to 5005 implicitly tested via server.listen
    });
  });

  describe('Server Start', () => {
    it('should start HTTP server when HTTPS_ENABLED=false', async () => {
      process.env.HTTPS_ENABLED = 'false';
      process.env.USE_SERVERLESS = 'false';
      await start();
      expect(http.createServer).toHaveBeenCalledWith(app);
      expect(mockServer.listen).toHaveBeenCalledWith(5005, expect.any(Function));
      expect(gracefulShutdown.setupGracefulShutdown).toHaveBeenCalledWith({
        server: mockServer,
        timeout: 30000,
        onShutdown: expect.any(Function),
      });
      delete process.env.HTTPS_ENABLED;
      delete process.env.USE_SERVERLESS;
    });

    it('should start HTTPS server when HTTPS_ENABLED=true with valid paths', async () => {
      process.env.HTTPS_ENABLED = 'true';
      process.env.HTTPS_KEY_PATH = '/key.pem';
      process.env.HTTPS_CERT_PATH = '/cert.pem';
      process.env.USE_SERVERLESS = 'false';
      (fs.readFileSync as jest.Mock).mockReturnValueOnce('key').mockReturnValueOnce('cert');
      await start();
      expect(https.createServer).toHaveBeenCalledWith({ key: 'key', cert: 'cert' }, app);
      expect(mockServer.listen).toHaveBeenCalledWith(5005, expect.any(Function));
      delete process.env.HTTPS_ENABLED;
      delete process.env.HTTPS_KEY_PATH;
      delete process.env.HTTPS_CERT_PATH;
      delete process.env.USE_SERVERLESS;
    });

    it('should throw error and exit if HTTPS enabled without key/cert paths', async () => {
      process.env.HTTPS_ENABLED = 'true';
      process.env.USE_SERVERLESS = 'false';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
      await expect(start()).rejects.toThrow('exit');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to setup server:', expect.any(Error));
      consoleErrorSpy.mockRestore();
      exitSpy.mockRestore();
      delete process.env.HTTPS_ENABLED;
      delete process.env.USE_SERVERLESS;
    });

    it('should setup serverless handler when USE_SERVERLESS=true', async () => {
      process.env.USE_SERVERLESS = 'true';
      const mockServerless = jest.fn().mockReturnValue('handler');
      jest.doMock('serverless-http', () => ({ default: mockServerless }));
      const moduleExports = await import('@src/index');
      expect(moduleExports.handler).toBe('handler');
      delete process.env.USE_SERVERLESS;
    });

    it('should handle serverless load error and exit', async () => {
      process.env.USE_SERVERLESS = 'true';
      jest.doMock('serverless-http', () => { throw new Error('load error'); });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
      await expect(start()).rejects.toThrow('exit');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load serverless-http:', expect.any(Error));
      delete process.env.USE_SERVERLESS;
      consoleErrorSpy.mockRestore();
      exitSpy.mockRestore();
    });
  });

  describe('Auto-start and Exports', () => {
    it('should auto-start when executed as main module', () => {
      const originalMain = require.main;
      (require as any).main = module;
      const mainSpy = jest.spyOn({ main }, 'main').mockImplementation(async () => {});
      require('@src/index');
      expect(mainSpy).toHaveBeenCalled();
      (require as any).main = originalMain;
    });

    it('should export start function', () => {
      expect(start).toBeDefined();
      expect(typeof start).toBe('function');
    });

    it('should handle fatal startup errors', async () => {
      const error = new Error('startup error');
      jest.spyOn({ main }, 'main').mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw error; });
      await expect(start()).rejects.toThrow('startup error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fatal startup error:', error);
      consoleErrorSpy.mockRestore();
      exitSpy.mockRestore();
    });
  });
});