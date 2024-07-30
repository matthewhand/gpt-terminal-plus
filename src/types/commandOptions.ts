/**
 * Interface representing options for executing a command.
 */
export interface CommandOptions {
    /** The current working directory for the command execution. */
    cwd?: string;

    /** The timeout for the command execution, in milliseconds. */
    timeout?: number;

    /** The directory to execute the command in. */
    directory?: string;
}
