import { PaginatedResponse } from ../types/index;

export function createPaginatedResponse<T>(items: T[], limit: number, offset: number): PaginatedResponse<T> {
    return {
        items: items.slice(0, limit),
        totalPages: Math.ceil(items.length / limit),
        responseId: responseId,
        stdout: stdout,
        stderr: stderr,
    };
}

