import { PaginatedResponse } from '../types/PaginatedResponse';

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Handles pagination logic.
 */
export class PaginationHandler {
  public limit: number;
  public offset: number;

  constructor(options: PaginationOptions = {}) {
    this.limit = options.limit || 10;
    this.offset = options.offset || 0;
  }

  /**
   * Paginates the given items.
   * @param items - The items to paginate.
   * @returns The paginated response.
   */
  paginate<T>(items: T[]): PaginatedResponse<T> {
    const paginatedItems = items.slice(this.offset, this.offset + this.limit);
    return {
      items: paginatedItems,
      limit: this.limit,
      offset: this.offset,
      total: items.length
    };
  }
}

/**
 * Utility function for simple pagination (backwards compatibility).
 * @param items - The items to paginate.
 * @param limit - The number of items per page.
 * @param offset - The offset to start the pagination.
 * @returns The paginated response.
 */
export function paginate<T>(items: T[], limit: number, offset: number): PaginatedResponse<T> {
  const handler = new PaginationHandler({ limit, offset });
  return handler.paginate(items);
}
