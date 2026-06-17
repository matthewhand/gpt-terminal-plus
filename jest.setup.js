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
});

afterAll(() => {
  // Restore originals in case anything inspects console afterward
  console.log = originalLog;
  console.warn = originalWarn;
  console.info = originalInfo;
});
