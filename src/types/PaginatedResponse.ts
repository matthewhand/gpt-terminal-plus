export interface PaginatedResponse {
    items: string[];
    totalPages: number;
    responseId: string;
    stdout: string[];
    stderr: string[];
    timestamp: number;
}
