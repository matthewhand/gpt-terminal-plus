/**
 * Interface representing a paginated response from a command execution.
 */
export interface ResponsePage {
    /** The standard output of the command. */
    stdout: string;

    /** The standard error output of the command. */
    stderr: string;

    /** The total number of pages in the response. */
    totalPages: number;
}
