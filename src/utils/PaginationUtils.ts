import { PaginatedResponse } from '../types/PaginatedResponse';

export function createPaginatedResponse<T>(items: T[], limit: number, offset: number): PaginatedResponse<T> {
    return {
        items: items.slice(0, limit),
        totalPages: Math.ceil(items.length / limit),
        responseId: 'responseId',
        stdout: [],  // Correct type
        stderr: [],  // Correct type
    };
}
