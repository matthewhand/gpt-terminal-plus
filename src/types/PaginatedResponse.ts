/**
 * Interface representing a paginated response.
 * @template T - The type of the items in the response.
 */
export interface PaginatedResponse<T> {
    /** The items in the current page. */
    items: T[];

    /** The total number of pages. */
    totalPages: number;

    /** The unique identifier for the response. */
    responseId: string;

    /** The standard output logs of the command execution, split by lines. */
    stdout: string[];

    /** The standard error logs of the command execution, split by lines. */
    stderr: string[];

    /** The timestamp of the response, if needed. */
    timestamp?: number;
}
