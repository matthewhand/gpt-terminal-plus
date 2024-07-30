import { PaginatedResponse } from '../types/PaginatedResponse';
import Debug from 'debug';

const debug = Debug('app:PaginationHandler');

const getResponseFromCache = (id: number, page: number): string => {
  // Dummy implementation, replace with actual logic
  return 'Response for id: ' + id + ', page: ' + page;
};

const PAGE_SIZE = 10;

export default class PaginationHandler {
  /**
   * Retrieves a paginated response for a given ID and page number.
   * @param {number} id - The unique ID of the response.
   * @param {number} page - The page number to retrieve.
   * @returns {Promise<PaginatedResponse<string>>} - The paginated response.
   */
  static async retrieveResponsePage(id: number, page: number): Promise<PaginatedResponse<string>> {
    // Validate inputs
    if (typeof id !== 'number' || id < 0) {
      const errorMessage = 'ID must be a non-negative number.';
      debug(errorMessage);
      throw new Error(errorMessage);
    }
    if (typeof page !== 'number' || page < 0) {
      const errorMessage = 'Page number must be a non-negative number.';
      debug(errorMessage);
      throw new Error(errorMessage);
    }

    debug('Retrieving response page for id: ' + id + ', page: ' + page);
    const response = getResponseFromCache(id, page);

    const paginatedResponse: PaginatedResponse<string> = {
      items: [response],
      totalPages: Math.ceil(response.length / PAGE_SIZE),
      responseId: 'response-' + id,
      stdout: [],
      stderr: [],
      timestamp: Date.now(),
    };

    debug('Retrieved response: ' + JSON.stringify(paginatedResponse));
    return paginatedResponse;
  }
}
