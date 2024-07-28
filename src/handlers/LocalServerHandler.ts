import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import Debug from 'debug';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo, PaginatedResponse, ServerHandlerInterface } from '../types/index';
import { createPaginatedResponse } from '../utils/PaginationUtils';
import { escapeRegExp } from '../utils/escapeRegExp';
import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';
import { psSystemInfoCmd } from './psSystemInfoCommand'; // Importing PowerShell command
import { shSystemInfoCmd } from './shSystemInfoCommand'; // Importing Shell command

const debug = Debug('app:LocalServerHandler');

export default class LocalServerHandler extends ServerHandler implements ServerHandlerInterface {
    private execAsync = promisify(exec);

    constructor(ServerConfig: ServerConfig) {
        super(ServerConfig);
        debug('LocalServerHandler initialized with config:', ServerConfig);
    }

    /**
     * Retrieves system information from the local server.
     * @returns A promise that resolves to the system information.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        let shellCommand, execShell;

        if (this.ServerConfig.shell) {
            shellCommand = this.ServerConfig.shell === 'powershell' ? psSystemInfoCmd : shSystemInfoCmd;
            execShell = this.ServerConfig.shell;
        } else {
            shellCommand = process.platform === 'win32' ? psSystemInfoCmd : shSystemInfoCmd;
        }

        try {
            const execOptions = execShell ? { shell: execShell } : {};
            const { stdout } = await this.execAsync(shellCommand, execOptions);

            const systemInfoObj = stdout.trim().split('\n').reduce((acc: { [key: string]: string }, line) => {
                const parts = line.split(':');
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                acc[key] = value;
                return acc;
            }, {});

            return this.constructSystemInfo(systemInfoObj);
        } catch (error: unknown) {
            debug('Error getting system information: ' + (error instanceof Error ? error.message : String(error)));
            return this.getDefaultSystemInfo();
        }
    }

    /**
     * Provides default system information.
     * @returns The default system information.
     */
    protected getDefaultSystemInfo(): SystemInfo {
        return {
            homeFolder: process.env.HOME || process.env.USERPROFILE || '/',
            type: process.platform,
            release: 'N/A',
            platform: 'N/A',
            powershellVersion: 'N/A',
            architecture: process.arch,
            totalMemory: Math.round(os.totalmem() / 1024 / 1024), // In MB
            freeMemory: Math.round(os.freemem() / 1024 / 1024), // In MB
            uptime: process.uptime(), // In seconds
            currentFolder: getCurrentFolder() // Use GlobalStateHelper for current folder
        };
    }

    /**
     * Constructs a SystemInfo object from raw data.
     * @param rawData - The raw system information data.
     * @returns The constructed SystemInfo object.
     */
    private constructSystemInfo(rawData: Partial<SystemInfo>): SystemInfo {
        // Merge rawData with defaultInfo ensuring all SystemInfo fields are populated
        const defaultInfo = this.getDefaultSystemInfo();
        return { ...defaultInfo, ...rawData };
    }

    /**
     * Executes a command on the local server.
     * @param command - The command to execute.
     * @param timeout - Optional timeout for the command execution.
     * @param directory - Optional directory to execute the command in.
     * @returns The command's stdout and stderr output.
     */
    async executeCommand(command: string, timeout: number = 5000, directory?: string): Promise<{ stdout: string; stderr: string }> {
        const execOptions = {
            timeout,
            cwd: directory || getCurrentFolder(), // Use GlobalStateHelper for current directory
            shell: this.ServerConfig.shell || undefined
        };

        debug('Executing command: ' + command + ' with options: ' + JSON.stringify(execOptions));
        try {
            const { stdout, stderr } = await this.execAsync(command, execOptions);
            debug('Command stdout: ' + stdout);
            debug('Command stderr: ' + stderr);
            return { stdout, stderr };
        } catch (error: unknown) {
            debug('Error executing command: ' + (error instanceof Error ? error.message : String(error)));
            throw new Error('Error executing command: ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    /**
     * Lists files in a specified directory on the local server.
     * @param directory - The directory to list files in.
     * @param limit - Maximum number of files to return.
     * @param offset - Number of files to skip before starting to collect the result set.
     * @param orderBy - Criteria to order files by.
     * @returns A paginated response containing files in the directory.
     */
    async listFiles(directory: string = '', limit: number = 42, offset: number = 0, orderBy: 'filename' | 'datetime' = 'filename'): Promise<PaginatedResponse> {
        const targetDirectory = directory || getCurrentFolder();
        debug('Listing files in directory: ' + targetDirectory + ' with limit: ' + limit + ', offset: ' + offset + ', orderBy: ' + orderBy);
        try {
            const entries = await fs.promises.readdir(targetDirectory, { withFileTypes: true });
            let files = entries.filter(entry => entry.isFile()).map(entry => entry.name);

            if (orderBy === 'datetime') {
                const fileStats = await Promise.all(files.map(async file => ({
                    name: file,
                    stats: await fs.promises.stat(path.join(targetDirectory, file))
                })));

                files = fileStats.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()).map(file => file.name);
            } else {
                files.sort();
            }

            debug('Files listed: ' + files);
            return createPaginatedResponse(files, limit, offset);
        } catch (error: unknown) {
            debug('Failed to list files in directory \'' + targetDirectory + '\': ' + (error instanceof Error ? error.message : String(error)));
            throw error;
        }
    }

    /**
     * Creates a file in the specified directory on the local server.
     * @param directory - The directory to create the file in.
     * @param filename - The name of the file to create.
     * @param content - The content to write to the file.
     * @param backup - Whether to create a backup of the file if it exists.
     * @returns True if the file is created successfully.
     */
    async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
        const fullPath = path.join(directory || getCurrentFolder(), filename);
        debug('Creating file at: ' + fullPath + ' with backup: ' + backup);
        try {
            if (backup && fs.existsSync(fullPath)) {
                const backupPath = fullPath + '.bak';
                await fs.promises.copyFile(fullPath, backupPath);
                debug('Backup created at: ' + backupPath);
            }

            await fs.promises.writeFile(fullPath, content);
            debug('File created at: ' + fullPath);
            return true;
        } catch (error: unknown) {
            debug('Failed to create file \'' + fullPath + '\': ' + (error instanceof Error ? error.message : String(error)));
            throw error;
        }
    }

    /**
     * Updates a file on the local server by replacing a pattern with a replacement string.
     * @param filePath - The path of the file to update.
     * @param pattern - The pattern to replace.
     * @param replacement - The replacement string.
     * @param backup - Whether to create a backup of the file before updating.
     * @returns True if the file is updated successfully.
     */
    async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
        const fullPath = path.join(getCurrentFolder(), filePath);
        debug('Updating file at: ' + fullPath + ' with backup: ' + backup);
        try {
            if (backup && fs.existsSync(fullPath)) {
                const backupPath = fullPath + '.bak';
                await fs.promises.copyFile(fullPath, backupPath);
                debug('Backup created at: ' + backupPath);
            }

            let content = await fs.promises.readFile(fullPath, 'utf8');
            const regex = new RegExp(escapeRegExp(pattern), 'g');
            content = content.replace(regex, replacement);
            await fs.promises.writeFile(fullPath, content);
            debug('File updated at: ' + fullPath);
            return true;
        } catch (error: unknown) {
            debug('Failed to update file \'' + fullPath + '\': ' + (error instanceof Error ? error.message : String(error)));
            throw error;
        }
    }

    /**
     * Appends content to a file on the local server.
     * @param filePath - The path of the file to amend.
     * @param content - The content to append.
     * @returns True if the file is amended successfully.
     */
    async amendFile(filePath: string, content: string): Promise<boolean> {
        const fullPath = path.join(getCurrentFolder(), filePath);
        debug('Amending file at: ' + fullPath);
        try {
            await fs.promises.appendFile(fullPath, content);
            debug('File amended at: ' + fullPath);
            return true;
        } catch (error: unknown) {
            debug('Failed to amend file \'' + fullPath + '\': ' + (error instanceof Error ? error.message : String(error)));
            throw error;
        }
    }
}
