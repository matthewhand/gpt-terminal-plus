import { PaginatedResponse } from '../types/PaginatedResponse';
import { SystemInfo } from '../types/SystemInfo';

/**
 * Interface representing the server handler.
 */
export interface ServerHandlerInterface {
    /**
     * Executes a command on the server.
     * @param {string} command - The command to execute.
     * @param {number} [timeout] - Optional timeout for the command.
     * @param {string} [directory] - Optional directory to execute the command in.
     * @returns {Promise<{ stdout: string; stderr: string }>} - The standard output and standard error of the command.
     */
    executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;

    /**
     * Lists files in a directory.
     * @param {string} directory - The directory to list files in.
     * @param {number} [limit] - Optional limit on the number of files to return.
     * @param {number} [offset] - Optional offset for pagination.
     * @param {'datetime' | 'filename'} [orderBy] - Optional order criteria.
     * @returns {Promise<PaginatedResponse<string>>} - A paginated response with file names.
     */
    listFiles(directory: string, limit?: number, offset?: number, orderBy?: 'datetime' | 'filename'): Promise<PaginatedResponse<string>>;

    /**
     * Creates a file in a directory.
     * @param {string} directory - The directory to create the file in.
     * @param {string} filename - The name of the file.
     * @param {string} content - The content of the file.
     * @param {boolean} backup - Whether to create a backup of the file.
     * @returns {Promise<boolean>} - Whether the file was created successfully.
     */
    createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;

    /**
     * Updates a file by replacing a pattern with a replacement.
     * @param {string} filePath - The path of the file to update.
     * @param {string} pattern - The pattern to replace.
     * @param {string} replacement - The replacement text.
     * @param {boolean} backup - Whether to create a backup of the file.
     * @returns {Promise<boolean>} - Whether the file was updated successfully.
     */
    updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;

    /**
     * Amends a file by appending content to it.
     * @param {string} filePath - The path of the file to amend.
     * @param {string} content - The content to append.
     * @returns {Promise<boolean>} - Whether the file was amended successfully.
     */
    amendFile(filePath: string, content: string): Promise<boolean>;

    /**
     * Retrieves system information from the server.
     * @returns {Promise<SystemInfo>} - The system information.
     */
    getSystemInfo(): Promise<SystemInfo>;
}
