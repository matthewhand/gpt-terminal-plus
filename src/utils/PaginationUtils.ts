import { PaginatedResponse } from '../types/PaginatedResponse';

/**
 * Creates a paginated response for the provided items.
 * @param items - The items to paginate.
 * @param total - The total number of items.
 * @param limit - The maximum number of items per page.
 * @param offset - The offset of the current page.
 * @returns A paginated response containing the items for the specified page.
 */
export function createPaginatedResponse<T>(items: T[], total: number, limit: number, offset: number): PaginatedResponse<T> {
    return {
        items,
        total,
        limit,
        offset,
    };
}
