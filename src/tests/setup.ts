// Global test setup
process.env.NODE_ENV = 'test';
process.env.API_TOKEN = 'test-token';

// Set a default per-test timeout to avoid runaway tests
jest.setTimeout(20000);

// Final safety: ensure process exits even if something leaves open handles
afterAll(() => {
  // Flush any timers and close stdio if possible
  try { jest.useRealTimers(); } catch {}
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
