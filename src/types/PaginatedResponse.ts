export interface PaginatedResponse<T> {
    items: T[];
    totalPages: number;
    responseId: string;
    stdout: string[]; // Changed to array
    stderr: string[]; // Changed to array
    timestamp?: number; // Add timestamp property if needed
}
