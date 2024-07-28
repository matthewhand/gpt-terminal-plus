import { PaginatedResponse } from ../types/PaginatedResponse;

export function storeResponse<T>(stdout: string, stderr: string): PaginatedResponse<T> {
    const responseId = Math.random().toString(36).substring(7);
    responseStorage[responseId] = {
        stdout: stdout.split(n),
        stderr: stderr.split(n),
        timestamp: Date.now(),
        items: [] as T[],
        totalPages: 1,
        responseId: responseId
    };
    return responseStorage[responseId];
}

export function getPaginatedResponse<T>(responseId: string, page: number): PaginatedResponse<T> {
    const response = responseStorage[responseId];
    return {
        items: response.stdout.slice(page * maxResponseSize, (page + 1) * maxResponseSize).map(line => line as unknown as T),
        totalPages: Math.ceil(response.stdout.length / maxResponseSize),
        responseId,
        stdout: response.stdout.join(n),
        stderr: response.stderr.join(n),
    };
}

const responseStorage: { [key: string]: PaginatedResponse<unknown> } = {};
const maxResponseSize = 1000;

