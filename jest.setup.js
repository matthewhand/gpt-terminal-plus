/* Jest setup for Node 18+ */
// Reduce noisy logs during tests while preserving error visibility
const originalLog = console.log;
const originalWarn = console.warn;
const originalInfo = console.info;

beforeAll(() => {
  // Silence info-level logs for cleaner test output
  console.log = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();

  // Global defaults for test infrastructure / shared auth/llm/server setup issues.
  // These help other agents/tests avoid repeated boilerplate for tokens, LLM opt-in, config.
  // (npm test script also prefixes NODE_CONFIG_DIR/NODE_ENV, but this makes direct `npx jest` robust.)
  if (!process.env.NODE_CONFIG_DIR) {
    process.env.NODE_CONFIG_DIR = 'config/test';
  }
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
  }
  if (!process.env.API_TOKEN) {
    // Mirror getOrGenerateApiToken() logic so checkAuthToken and convictConfig have a stable token early.
    const crypto = require('crypto');
    process.env.API_TOKEN = crypto.randomBytes(16).toString('hex');
  }
  if (typeof process.env.LLM_ENABLED === 'undefined') {
    // Default OFF to prevent accidental LLM calls / network in non-LLM tests.
    // LLM-focused tests explicitly set process.env.LLM_ENABLED = 'true' (and often mock providers).
    process.env.LLM_ENABLED = 'false';
  }
  // Server selection: ensure clean slate for GlobalStateHelper.selectedServer used by handler/middleware tests.
  // Individual tests may call _resetGlobalStateForTests() for their suite; this provides baseline.
  if (!process.env.SELECTED_SERVER) {
    // Empty is the "no server selected" default used across server list / handler selection logic.
    process.env.SELECTED_SERVER = '';
  }
});

afterAll(() => {
  // Restore originals in case anything inspects console afterward
  console.log = originalLog;
  console.warn = originalWarn;
  console.info = originalInfo;
});
