export interface ResponsePage { stdout: string; stderr: string; totalPages: number; } export interface PaginatedResponse { stdout: string[]; stderr: string[]; timestamp: number; }
