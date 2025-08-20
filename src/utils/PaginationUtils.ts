import { PaginatedResponse } from '../types/PaginatedResponse';

/**
 * Handles pagination logic.
 * @param items - The items to paginate.
 * @param limit - The number of items per page.
 * @param offset - The offset to start the pagination.
 * @returns The paginated response.
 */
export function paginate<T>(items: T[], limit: number, offset: number): PaginatedResponse<T> {
  const paginatedItems = items.slice(offset, offset + limit);
  return {
    items: paginatedItems,
    limit,
    offset,
    total: items.length  // Correctly include total property
  };
}
