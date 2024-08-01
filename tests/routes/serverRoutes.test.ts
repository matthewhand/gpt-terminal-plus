import { Request, Response } from 'express';
import { initializeServerHandler } from '../../src/middlewares/initializeServerHandler';
import LocalServer from '../../src/handlers/local/LocalServerImplementation';
import { LocalConfig } from '../../src/types/ServerConfig';

// Sample local configuration
const localConfig: LocalConfig = {
  protocol: 'local',
  host: 'localhost',
  code: false,  // Add the required 'code' property
};

// Mock Request and Response objects
const req = {} as Request;
const res = {} as Response;
res.status = jest.fn().mockReturnValue(res);
res.json = jest.fn().mockReturnValue(res);

// Test cases

describe('initializeServerHandler Middleware', () => {
  it('should initialize server handler with local config', () => {
    initializeServerHandler(req, res, () => {});
    expect(res.status).not.toHaveBeenCalled();
    expect(req.serverHandler).toBeDefined();
    expect((req.serverHandler as LocalServer).code).toEqual(localConfig.code);
  });
});
