import { PaginatedResponse } from '../types/PaginatedResponse';

const getResponseFromCache = (id: number, page: number): string => {
  // Dummy implementation, replace with actual logic
  return `Response for id: ${id}, page: ${page}`;
};

const PAGE_SIZE = 10;

export default class PaginationHandler {
  static async retrieveResponsePage(id: number, page: number): Promise<PaginatedResponse<string>> {
    const response = getResponseFromCache(id, page);
    return {
      data: response,
      totalPages: Math.ceil(response.length / PAGE_SIZE)
    };
  }
}
