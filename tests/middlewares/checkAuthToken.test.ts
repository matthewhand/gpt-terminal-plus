import { checkAuthToken } from '../../src/middlewares/checkAuthToken';

describe('checkAuthToken middleware', () => {
  it('should export checkAuthToken', () => {
    expect(checkAuthToken).toBeDefined();
  });
});