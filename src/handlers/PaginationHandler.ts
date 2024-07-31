import { PaginatedResponse } from '../types/PaginatedResponse';

export class PaginationHandler {
  private data: string[];
  private totalPages: number;

  constructor(data: string[], totalPages: number) {
    this.data = data;
    this.totalPages = totalPages;
  }

  public async handlePagination(): Promise<PaginatedResponse<string>> {
    return {
      items: this.data,
      totalPages: this.totalPages,
      responseId: 'responseId',
      stdout: [],
      stderr: []
    };
  }
}
