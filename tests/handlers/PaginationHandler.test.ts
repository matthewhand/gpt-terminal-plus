import { storeResponse, getPaginatedResponse } from '../../src/handlers/PaginationHandler';

describe('PaginationHandler', () => {
  it('should store and retrieve paginated stdout correctly', () => {
    // Ensure the string is longer than 5000 characters to create more than one page
    const stdout = 'stdout '.repeat(1000); // 'stdout ' is 7 characters, so 7 * 1000 = 7000 characters
    const stderr = '';
    const responseId = storeResponse(stdout, stderr, 5000);

    const page1 = getPaginatedResponse(responseId, 0);
    expect(page1.stdout).toBe(stdout.slice(0, 5000));
    expect(page1.stderr).toBe('');
    expect(page1.totalPages).toBe(2); // Now totalPages should correctly be 2

    const page2 = getPaginatedResponse(responseId, 1);
    expect(page2.stdout).toBe(stdout.slice(5000));
    expect(page2.stderr).toBe('');
    expect(page2.totalPages).toBe(2);
  });

  it('should store and retrieve paginated stderr correctly', () => {
    // Ensure the string is longer than 5000 characters to create more than one page
    const stdout = '';
    const stderr = 'stderr '.repeat(1000); // 'stderr ' is 7 characters, so 7 * 1000 = 7000 characters
    const responseId = storeResponse(stdout, stderr, 5000);

    const page1 = getPaginatedResponse(responseId, 0);
    expect(page1.stdout).toBe('');
    expect(page1.stderr).toBe(stderr.slice(0, 5000));
    expect(page1.totalPages).toBe(2); // Now totalPages should correctly be 2

    const page2 = getPaginatedResponse(responseId, 1);
    expect(page2.stdout).toBe('');
    expect(page2.stderr).toBe(stderr.slice(5000));
    expect(page2.totalPages).toBe(2);
  });

  // Add more tests as needed
});
