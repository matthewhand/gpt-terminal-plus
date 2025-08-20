import { ServerConfig } from './ServerConfig';

/**
 * Interface representing the application configuration.
 */
export interface AppConfig {
    /** Configuration for the servers. */
    ServerConfig: ServerConfig[];

    /** The default timeout for commands, in milliseconds. */
    commandTimeout: number;

    /** The maximum number of responses to return. */
    maxResponse: number;

    /** The port number on which the application will run. */
    port: number;
}
