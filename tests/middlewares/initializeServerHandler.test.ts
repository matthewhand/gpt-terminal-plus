import { initializeServerHandler } from '../../src/middlewares/initializeServerHandler';

describe('initializeServerHandler middleware', () => {
  it('should export initializeServerHandler', () => {
    expect(initializeServerHandler).toBeDefined();
  });
});