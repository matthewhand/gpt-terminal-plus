export interface PaginatedResponse<T> {
    items: T[];
    totalPages: number;
    responseId: string;
    stdout: string;
    stderr: string;
}
