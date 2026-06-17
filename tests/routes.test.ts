import { describe, it, expect } from '@jest/globals';
import { setupApiRouter } from '@src/routes';
import apiRouter from '@src/routes';

describe('routes.ts - Route Exports', () => {
  it('should export setupApiRouter function', () => {
    expect(setupApiRouter).toBeDefined();
    expect(typeof setupApiRouter).toBe('function');
  });

  it('should export default as the API router', () => {
    expect(apiRouter).toBeDefined();
  });
});