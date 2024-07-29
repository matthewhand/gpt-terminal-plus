import { PaginatedResponse } from '../types/PaginatedResponse';

export default class PaginationHandler {
  static async retrieveResponsePage(id: number, page: number): Promise<PaginatedResponse<string>> {
    const response: string = await getResponseFromCache(id);
    const lines: string[] = response.split('\n');
    const pageData: string = lines.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).join('\n');
    return { data: pageData, totalPages: Math.ceil(lines.length / PAGE_SIZE) };
  }
}

