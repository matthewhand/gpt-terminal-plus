export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
}
