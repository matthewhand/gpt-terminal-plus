import { PaginatedResponse } from '../types/PaginatedResponse';

/**
 * Handles pagination for a list of items.
 * @param items - The items to paginate.
 * @param page - The page number to retrieve.
 * @param pageSize - The number of items per page.
 * @returns A paginated response containing the items for the specified page.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
    const offset = (page - 1) * pageSize;
    const paginatedItems = items.slice(offset, offset + pageSize);
    return {
        items: paginatedItems,
        total: items.length,
        limit: pageSize,
        offset,
    };
}
