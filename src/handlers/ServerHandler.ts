import { ServerConfig, SystemInfo, PaginatedResponse, ServerHandlerInterface } from '../types/index';
import debug from 'debug';
import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';

const serverHandlerDebug = debug('app:ServerHandler');

/**
 * Abstract base class for server handlers.
 * Provides common methods and properties for managing server interactions.
 */
export abstract class ServerHandler implements ServerHandlerInterface {
    public identifier: string;

    protected serverConfig: ServerConfig;

    constructor(serverConfig: ServerConfig) {
        this.serverConfig = serverConfig;
        this.identifier = `${serverConfig.username}@${serverConfig.host}`;
        serverHandlerDebug(`ServerHandler created for ${this.identifier}`);
    }

    /**
     * Gets the server configuration.
     * @returns The server configuration.
     */
    getServerConfig(): ServerConfig {
        return this.serverConfig;
    }

    /**
     * Sets the current directory.
     * @param directory - The directory to set.
     * @returns True if the directory was set successfully.
     */
    setCurrentDirectory(directory: string): boolean {
        setCurrentFolder(directory);
        serverHandlerDebug(`Current directory set globally to ${directory}`);
        return true;
    }

    /**
     * Gets the current directory.
     * @returns The current directory.
     */
    async getCurrentDirectory(): Promise<string> {
        const directory = getCurrentFolder();
        serverHandlerDebug(`Retrieving current directory globally: ${directory}`);
        return directory;
    }

    /**
     * Abstract method to execute a command on the server.
     * @param command - The command to execute.
     * @param timeout - Optional timeout for the command execution.
     * @param directory - Optional directory to execute the command in.
     * @returns The command's stdout and stderr output.
     */
    abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;

    /**
     * Abstract method to list files in a directory on the server.
     * @param directory - The directory to list files in.
     * @param limit - Maximum number of files to return.
     * @param offset - Number of files to skip before starting to collect the result set.
     * @param orderBy - Criteria to order files by.
     * @returns A paginated response containing files in the directory.
     */
    abstract listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<PaginatedResponse>;

    /**
     * Abstract method to create a file on the server.
     * @param directory - The directory to create the file in.
     * @param filename - The name of the file to create.
     * @param content - The content to write to the file.
     * @param backup - Whether to create a backup of the file if it exists.
     * @returns True if the file is created successfully.
     */
    abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;

    /**
     * Abstract method to update a file on the server.
     * @param filePath - The path of the file to update.
     * @param pattern - The pattern to replace.
     * @param replacement - The replacement string.
     * @param backup - Whether to create a backup of the file before updating.
     * @returns True if the file is updated successfully.
     */
    abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;

    /**
     * Abstract method to append content to a file on the server.
     * @param filePath - The path of the file to amend.
     * @param content - The content to append.
     * @param backup - Whether to create a backup of the file before amending.
     * @returns True if the file is amended successfully.
     */
    abstract amendFile(filePath: string, content: string): Promise<boolean>;

    /**
     * Abstract method to retrieve system information from the server.
     * @returns System information.
     */
    abstract getSystemInfo(): Promise<SystemInfo>;
}
