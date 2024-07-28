import { PaginatedResponse } from '../types/index';

export function createPaginatedResponse(items: string[], limit: number, offset: number): PaginatedResponse {
    return {
        items,
        limit,
        offset,
        total: items.length
    };
}
