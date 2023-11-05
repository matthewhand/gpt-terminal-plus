import { storeResponse, getPaginatedResponse } from '../../handlers/PaginationHandler';

describe('PaginationHandler', () => {
  let largeOutput: string;
  const maxResponseSize = 1000;
  const responseId = 'testResponse';

  beforeAll(() => {
    largeOutput = 'a'.repeat(5000);
    storeResponse(responseId, largeOutput);
  });

  it('should paginate the response correctly', () => {
    const firstPage = getPaginatedResponse(responseId, 0, maxResponseSize);
    expect(firstPage.data).toBe(largeOutput.substring(0, maxResponseSize));
    expect(firstPage.totalPages).toBe(5);

    const secondPage = getPaginatedResponse(responseId, 1, maxResponseSize);
    expect(secondPage.data).toBe(largeOutput.substring(maxResponseSize, maxResponseSize * 2));
    expect(secondPage.totalPages).toBe(5);
  });
});