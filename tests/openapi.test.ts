import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import express from 'express';
import * as yaml from 'yaml';
import * as openapi from '@src/openapi';
import { convictConfig } from '@src/config/convictConfig';
import { listExecutors } from '@src/utils/executors';

jest.mock('yaml');
jest.mock('@src/config/convictConfig');
jest.mock('@src/utils/executors');

const mockApp = {
  get: jest.fn(),
} as unknown as express.Application;

const mockReq = {
  headers: { 'x-forwarded-proto': 'https' },
  protocol: 'http',
  get: jest.fn(() => 'example.com:8080'),
} as express.Request;

describe('openapi.ts - OpenAPI Spec and Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (convictConfig as jest.Mock).mockReturnValue({
      get: jest.fn(key => {
        if (key === 'executors.exposureMode') return 'both';
        if (key === 'files.consequential') return true;
        return null;
      }),
    });
    (listExecutors as jest.Mock).mockReturnValue([
      { name: 'python', kind: 'code', enabled: true, cmd: 'python', args: [] },
      { name: 'bash', kind: 'shell', enabled: true, cmd: 'bash', args: ['-c'] },
    ]);
    (yaml.stringify as jest.Mock).mockImplementation(obj => `YAML: ${JSON.stringify(obj)}`);
  });

  describe('buildExecutorPaths', () => {
    it('should include generic shell path when mode is generic', () => {
      (convictConfig as jest.Mock).mockReturnValue({ get: jest.fn(() => 'generic') });
      const paths = openapi.buildExecutorPaths(convictConfig());
      expect(paths['/command/execute-shell']).toBeDefined();
      expect(paths['/command/execute-shell'].post.operationId).toBe('executeShell');
    });

    it('should include specific executor paths when mode is specific', () => {
      (convictConfig as jest.Mock).mockReturnValue({ get: jest.fn(() => 'specific') });
      const paths = openapi.buildExecutorPaths(convictConfig());
      expect(paths['/command/execute-python']).toBeDefined();
      expect(paths['/command/execute-python'].post.operationId).toBe('execute_python');
      expect(paths['/command/execute-bash'].post.kind).toBeUndefined(); // shell kind
    });

    it('should include both generic and specific when mode is both', () => {
      const paths = openapi.buildExecutorPaths(convictConfig());
      expect(paths['/command/execute-shell']).toBeDefined();
      expect(paths['/command/execute-python']).toBeDefined();
      expect(paths['/command/execute-bash']).toBeDefined();
    });

    it('should handle code kind executors with code schema', () => {
      const paths = openapi.buildExecutorPaths(convictConfig());
      const pythonPath = paths['/command/execute-python'];
      expect(pythonPath.post.requestBody.content['application/json'].schema.properties.code).toBeDefined();
      expect(pythonPath.post.requestBody.content['application/json'].schema.required).toEqual(['code']);
    });

    it('should handle shell kind with command/args schema', () => {
      const paths = openapi.buildExecutorPaths(convictConfig());
      const bashPath = paths['/command/execute-bash'];
      expect(bashPath.post.requestBody.content['application/json'].schema.properties.command).toBeDefined();
      expect(bashPath.post.requestBody.content['application/json'].schema.required).toEqual(['command']);
    });
  });

  describe('getPublicBaseUrl', () => {
    it('should return env PUBLIC_BASE_URL if valid', () => {
      process.env.PUBLIC_BASE_URL = 'https://api.example.com/';
      const url = openapi.getPublicBaseUrl();
      expect(url).toBe('https://api.example.com');
      delete process.env.PUBLIC_BASE_URL;
    });

    it('should ignore invalid env URL', () => {
      process.env.PUBLIC_BASE_URL = 'invalid';
      const url = openapi.getPublicBaseUrl();
      expect(url).not.toBe('invalid');
      delete process.env.PUBLIC_BASE_URL;
    });

    it('should use request proto and host', () => {
      (mockReq.get as jest.Mock).mockReturnValue('test.com:3000');
      const url = openapi.getPublicBaseUrl(mockReq);
      expect(url).toBe('https://test.com:3000');
    });

    it('should fallback to request protocol if no forwarded proto', () => {
      mockReq.headers['x-forwarded-proto'] = undefined;
      mockReq.protocol = 'https';
      const url = openapi.getPublicBaseUrl(mockReq);
      expect(url).toBe('https://example.com:8080');
    });

    it('should use env defaults without req', () => {
      process.env.HTTPS_ENABLED = 'true';
      process.env.PORT = '8443';
      process.env.PUBLIC_HOST = 'myhost.com';
      const url = openapi.getPublicBaseUrl();
      expect(url).toBe('https://myhost.com:8443');
      delete process.env.HTTPS_ENABLED;
      delete process.env.PORT;
      delete process.env.PUBLIC_HOST;
    });

    it('should default to http://localhost:3100 without env', () => {
      const url = openapi.getPublicBaseUrl();
      expect(url).toBe('http://localhost:3100');
    });
  });

  describe('buildSpec', () => {
    it('should build spec with correct openapi version and info', () => {
      const spec = openapi.buildSpec();
      expect(spec.openapi).toBe('3.0.3');
      expect(spec.info.title).toBe('gpt-terminal-plus API');
      expect(spec.info.version).toBe('0.1.0');
    });

    it('should set servers from base URL', () => {
      process.env.PUBLIC_BASE_URL = 'https://test.com';
      const spec = openapi.buildSpec();
      expect(spec.servers[0].url).toBe('https://test.com');
      delete process.env.PUBLIC_BASE_URL;
    });

    it('should include security schemes and ExecutionResult schema', () => {
      const spec = openapi.buildSpec();
      expect(spec.components.securitySchemes.bearerAuth.type).toBe('http');
      const execSchema = spec.components.schemas.ExecutionResult;
      expect(execSchema.properties.stdout.type).toBe('string');
      expect(execSchema.required).toEqual(expect.arrayContaining(['stdout', 'stderr', 'exitCode', 'error']));
    });

    it('should include /server/list path', () => {
      const spec = openapi.buildSpec();
      const listPath = spec.paths['/server/list'];
      expect(listPath.get.operationId).toBe('serverList');
      expect(listPath.get.responses['200']).toBeDefined();
    });

    it('should include executor paths from buildExecutorPaths', () => {
      const spec = openapi.buildSpec();
      expect(spec.paths['/command/execute-shell']).toBeDefined();
      expect(spec.paths['/command/execute-python']).toBeDefined();
    });

    it('should include /command/executors path', () => {
      const spec = openapi.buildSpec();
      const execPath = spec.paths['/command/executors'];
      expect(execPath.get.operationId).toBe('listExecutors');
      expect(execPath.get.responses['200'].content['application/json'].schema.properties.executors).toBeDefined();
    });

    it('should include toggle/update/test executor paths', () => {
      const spec = openapi.buildSpec();
      expect(spec.paths['/command/executors/{name}/toggle']).toBeDefined();
      expect(spec.paths['/command/executors/{name}/test']).toBeDefined();
      expect(spec.paths['/command/executors/{name}/update']).toBeDefined();
    });

    it('should include /command/execute-llm path', () => {
      const spec = openapi.buildSpec();
      const llmPath = spec.paths['/command/execute-llm'];
      expect(llmPath.post.operationId).toBe('executeLlm');
      expect(llmPath.post.requestBody.content['application/json'].schema.required).toEqual(['instructions']);
    });

    it('should include file operation paths with x-openai-isConsequential from config', () => {
      (convictConfig as jest.Mock).mockReturnValue({ get: jest.fn(key => key === 'files.consequential' ? true : null) });
      const spec = openapi.buildSpec();
      expect(spec.paths['/file/create']['post']['x-openai-isConsequential']).toBe(true);
      expect(spec.paths['/file/list']).toBeDefined();
      expect(spec.paths['/file/update']).toBeDefined();
      expect(spec.paths['/file/amend']).toBeDefined();
      expect(spec.paths['/file/diff']).toBeDefined();
      expect(spec.paths['/file/patch']).toBeDefined();
    });

    it('should include activity paths', () => {
      const spec = openapi.buildSpec();
      expect(spec.paths['/activity/list']).toBeDefined();
      expect(spec.paths['/activity/session/{date}/{id}']).toBeDefined();
    });

    it('should include settings and config paths', () => {
      const spec = openapi.buildSpec();
      expect(spec.paths['/settings']).toBeDefined();
      expect(spec.paths['/config/persist']).toBeDefined();
      expect(spec.paths['/config/toggle/llm']).toBeDefined();
      expect(spec.paths['/config/toggle/files']).toBeDefined();
      expect(spec.paths['/config/toggle/shell']).toBeDefined();
    });

    it('should set global security', () => {
      const spec = openapi.buildSpec();
      expect(spec.security).toEqual([{ bearerAuth: [] }]);
    });
  });

  describe('registerOpenAPIRoutes', () => {
    it('should register /openapi.json route with dynamic spec', () => {
      openapi.registerOpenAPIRoutes(mockApp);
      expect(mockApp.get).toHaveBeenCalledWith('/openapi.json', expect.any(Function));
    });

    it('should register /openapi.yaml route with YAML stringify', () => {
      openapi.registerOpenAPIRoutes(mockApp);
      expect(mockApp.get).toHaveBeenCalledWith('/openapi.yaml', expect.any(Function));
      const handler = mockApp.get.mock.calls.find(call => call[0] === '/openapi.yaml')[1];
      const res = { type: jest.fn(), send: jest.fn() };
      handler(mockReq, res);
      expect(yaml.stringify).toHaveBeenCalledWith(expect.objectContaining({ openapi: '3.0.3' }));
      expect(res.type).toHaveBeenCalledWith('application/yaml');
      expect(res.send).toHaveBeenCalled();
    });

    it('should register /docs fallback HTML route', () => {
      openapi.registerOpenAPIRoutes(mockApp);
      expect(mockApp.get).toHaveBeenCalledWith('/docs', expect.any(Function));
      const handler = mockApp.get.mock.calls.find(call => call[0] === '/docs')[1];
      const res = { status: jest.fn().mockReturnThis(), type: jest.fn().mockReturnThis(), send: jest.fn() };
      handler(mockReq, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.type).toHaveBeenCalledWith('text/html');
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Swagger UI'));
    });
  });

  describe('registerOpenApiRoutes alias', () => {
    it('should be the same as registerOpenAPIRoutes', () => {
      expect(openapi.registerOpenApiRoutes).toBe(openapi.registerOpenAPIRoutes);
    });
  });
});