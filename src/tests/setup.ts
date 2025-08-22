// Global test setup
process.env.NODE_ENV = 'test';
process.env.API_TOKEN = 'test-token';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};