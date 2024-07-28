import { ResponsePage } from '../types/ResponsePage';
import { PaginatedResponse } from '../types/PaginatedResponse';

export function storeResponse(stdout: string, stderr: string): string {
    const responseId = Math.random().toString(36).substring(7);
    responseStorage[responseId] = {
        stdout: stdout.split('\n'),
        stderr: stderr.split('\n'),
        timestamp: Date.now(),
        items: [],
        totalPages: 1,
        responseId: responseId
    };
    return responseId;
}

export function getPaginatedResponse(responseId: string, page: number): ResponsePage {
    const response = responseStorage[responseId];
    return {
        stdout: response.stdout.slice(page * maxResponseSize, (page + 1) * maxResponseSize).join('\n'),
        stderr: response.stderr.join('\n'),
        totalPages: Math.ceil(response.stdout.length / maxResponseSize),
    };
}

export const cleanupIntervalId = setInterval(() => {}, 1000);

const responseStorage: { [key: string]: PaginatedResponse } = {};
const maxResponseSize = 1000;
