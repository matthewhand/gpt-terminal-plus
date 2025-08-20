/**
 * Interface representing a command configuration.
 */
export interface CommandConfig {
    /** The name of the command. */
    name: string;

    /** The command to be executed. */
    command: string;

    /** The shell to use for executing the command (optional). */
    shell?: string;
}
