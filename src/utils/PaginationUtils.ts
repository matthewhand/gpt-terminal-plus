import { v4 as uuidv4 } from 'uuid';
import { PaginatedResponse } from '../types/response'; // Correct the import path if needed

/**
 * Creates a paginated response from a list of items.
 * @param items - The list of items to paginate.
 * @param limit - The maximum number of items per page.
 * @param offset - The offset to start the pagination from.
 * @returns A PaginatedResponse containing the paginated items, total pages, a unique response ID, and metadata.
 */
export function createPaginatedResponse(items: string[], limit: number, offset: number): PaginatedResponse {
  const totalPages = Math.ceil(items.length / limit);
  const paginatedItems = items.slice(offset, offset + limit);
  return {
    items: paginatedItems,
    totalPages,
    responseId: uuidv4(),
    stdout: [], // Placeholder, to be populated as needed
    stderr: [], // Placeholder, to be populated as needed
    timestamp: Date.now()
  };
}
