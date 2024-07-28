import { createFile } from './local/functions/createFile';
import { updateFile } from './local/functions/updateFile';
import { amendFile } from './local/functions/amendFile';
import { executeCommand } from './local/functions/executeCommand';
import { getSystemInfo } from './local/functions/getSystemInfo';
import { listFiles } from './local/functions/listFiles';
import { SystemInfo } from '../types/SystemInfo';

/**
 * Handles local server operations.
 */
class LocalServerHandler {
    private config: any;

    /**
     * Constructs a LocalServerHandler instance.
     * @param config - The configuration for the local server handler.
     */
    constructor(config: any) {
        this.config = config;
    }

    /**
     * Creates a file with the specified content.
     * @param directory - The directory where the file will be created.
     * @param filename - The name of the file to create.
     * @param content - The content to write to the file.
     * @param backup - Whether to create a backup of the existing file.
     * @returns A promise that resolves to true if the file was created successfully, false otherwise.
     */
    public async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
        console.log('Creating file: ' + directory + '/' + filename);
        try {
            return await createFile(directory, filename, content, backup);
        } catch (error) {
            console.error('Error creating file in ' + directory + ':', error);
            return false;
        }
    }

    /**
     * Updates a file by replacing a specific pattern with new content.
     * @param filePath - The path of the file to update.
     * @param pattern - The pattern to replace in the file.
     * @param replacement - The replacement content for the pattern.
     * @param backup - Whether to create a backup of the existing file.
     * @returns A promise that resolves to true if the file was updated successfully, false otherwise.
     */
    public async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
        console.log('Updating file: ' + filePath);
        return updateFile(filePath, pattern, replacement, backup);
    }

    /**
     * Appends content to an existing file.
     * @param filePath - The path of the file to amend.
     * @param content - The content to append to the file.
     * @returns A promise that resolves to true if the file was amended successfully, false otherwise.
     */
    public async amendFile(filePath: string, content: string): Promise<boolean> {
        console.log('Amending file: ' + filePath);
        return amendFile(filePath, content);
    }

    /**
     * Executes a command in the specified directory.
     * @param command - The command to execute.
     * @param timeout - The timeout for the command execution in milliseconds.
     * @param directory - The directory from which to execute the command.
     * @returns A promise that resolves to the command execution result.
     */
    public async executeCommand(command: string, timeout: number, directory: string): Promise<any> {
        console.log('Executing command: ' + command);
        return executeCommand(command, timeout, directory);
    }

    /**
     * Retrieves system information using the specified shell and script path.
     * @returns A promise that resolves to the system information.
     */
    public async getSystemInfo(): Promise<SystemInfo> {
        console.log('Retrieving system info with shell: ' + this.config.shell + ', scriptPath: ' + this.config.scriptPath);
        return getSystemInfo(this.config.shell, this.config.scriptPath);
    }

    /**
     * Lists files in a specified directory.
     * @param directory - The directory to list files from.
     * @param limit - The maximum number of files to return.
     * @param offset - The offset for file listing, used for pagination.
     * @param orderBy - The criteria to order the files by.
     * @returns A promise that resolves to an array of file names.
     */
    public async listFiles(directory: string, limit: number, offset: number, orderBy: "datetime" | "filename"): Promise<string[]> {
        console.log('Listing files in directory: ' + directory);
        return await listFiles(directory, limit, offset, orderBy);
    }
}

export default LocalServerHandler;
