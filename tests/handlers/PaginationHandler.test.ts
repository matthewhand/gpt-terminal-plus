import { storeResponse, getPaginatedResponse, cleanupIntervalId } from '../../src/handlers/PaginationHandler';
// Import config if you need to use it in your tests
import config from 'config';

describe('PaginationHandler', () => {
  // Define expectedPageSize and expectedTotalPages based on your maxResponseSize
  const maxResponseSize = config.get<number>('maxResponseSize') || 1000;
  const stdout = 'stdout '.repeat(200); // Adjust this to ensure it's longer than maxResponseSize
  const expectedPageSize = maxResponseSize;
  const expectedTotalPages = Math.ceil(stdout.length / expectedPageSize);

  it('should store and retrieve paginated stdout correctly', () => {
    const stderr = '';
    const responseId = storeResponse(stdout, stderr);

    const page1 = getPaginatedResponse(responseId, 0);
    const expectedOutput = stdout.slice(0, expectedPageSize);
    const optionalNewlineRegex = new RegExp(`${expectedOutput}\n?`);
    expect(page1.stdout).toMatch(optionalNewlineRegex);

    const pageLast = getPaginatedResponse(responseId, expectedTotalPages - 1);
    const lastPageStartIndex = expectedPageSize * (expectedTotalPages - 1);
    const expectedLastOutput = stdout.slice(lastPageStartIndex);
    const optionalNewlineLastRegex = new RegExp(`${expectedLastOutput}\n?`);
    expect(pageLast.stdout).toMatch(optionalNewlineLastRegex);
    expect(pageLast.totalPages).toBe(expectedTotalPages);
    
  });

  afterAll(() => {
    // Clear the interval to prevent it from running after tests complete
    clearInterval(cleanupIntervalId);
  });
});
