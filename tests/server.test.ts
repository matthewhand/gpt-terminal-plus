import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import app from '@src/index';
import * as serverModule from '@src/server';

describe('server.ts - Server Startup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should import app from index', () => {
    expect(app).toBeDefined();
  });

  it('should use process.env.PORT if valid number', () => {
    process.env.PORT = '8080';
    const mockListen = jest.spyOn(app, 'listen').mockImplementation();
    require('@src/server');
    expect(mockListen).toHaveBeenCalledWith(8080, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server listening on :8080');
    delete process.env.PORT;
  });

  it('should use default port 3100 if no env PORT', () => {
    delete process.env.PORT;
    const mockListen = jest.spyOn(app, 'listen').mockImplementation();
    require('@src/server');
    expect(mockListen).toHaveBeenCalledWith(3100, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server listening on :3100');
  });

  it('should use default port if env PORT is invalid', () => {
    process.env.PORT = 'invalid';
    const mockListen = jest.spyOn(app, 'listen').mockImplementation();
    require('@src/server');
    expect(mockListen).toHaveBeenCalledWith(3100, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server listening on :3100');
    delete process.env.PORT;
  });
});