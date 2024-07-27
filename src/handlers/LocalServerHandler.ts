import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo, PaginatedResponse, ServerHandlerInterface } from '../types/index';
import { createPaginatedResponse } from '../utils/PaginationUtils';
import { escapeRegExp } from '../utils/escapeRegExp';
import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';
import { psSystemInfoCmd } from './psSystemInfoCommand'; // Importing PowerShell command
import { shSystemInfoCmd } from './shSystemInfoCommand'; // Importing Shell command

/*router.post('/amend-file', async (req, res) => {
    const { filename, content, directory = "" } = req.body;
    try {
        const serverHandler = req.serverHandler!;
        const targetDirectory = directory || await serverHandler.getCurrentDirectory();
        const fullPath = path.join(targetDirectory, filename);
        const release = await lockfile.lock(fullPath, { realpath: false });
        try {
            const success = await serverHandler.amendFile(fullPath, content);
            res.status(success ? 200 : 400).json({
                message: success ? 'File amended successfully.' : 'Failed to amend file.'
            });
        } finally {
            await release();
        }
    } catch (err) {
        handleServerError(err, res, 'Error amending file');
    }
});
*
 * Class to handle server interactions for local servers.
 * Extends the abstract ServerHandler class and implements ServerHandlerInterface.
 */
export default class LocalServerHandler extends ServerHandler implements ServerHandlerInterface {
    private execAsync = promisify(exec);

    constructor(ServerConfig: ServerConfig) {
        super(ServerConfig);
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
                const [key, value] = line.split(':').map(part => part.trim());
                acc[key] = value;
                return acc;
            }, {});

            return this.constructSystemInfo(systemInfoObj);
        } catch (error) {
            console.error(`Error getting system information:`, error);
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

        try {
            const { stdout, stderr } = await this.execAsync(command, execOptions);
            return { stdout, stderr };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error executing command: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred while executing the command.');
            }
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

            return createPaginatedResponse(files, limit, offset);
        } catch (error) {
            console.error(`Failed to list files in directory '${targetDirectory}': ${error}`);
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
        try {
            if (backup && fs.existsSync(fullPath)) {
                const backupPath = `${fullPath}.bak`;
                await fs.promises.copyFile(fullPath, backupPath);
            }

            await fs.promises.writeFile(fullPath, content);
            return true;
        } catch (error) {
            console.error(`Failed to create file '${fullPath}': ${error}`);
            return false;
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
        try {
            if (backup && fs.existsSync(fullPath)) {
                const backupPath = `${fullPath}.bak`;
                await fs.promises.copyFile(fullPath, backupPath);
            }

            let content = await fs.promises.readFile(fullPath, 'utf8');
            const regex = new RegExp(escapeRegExp(pattern), 'g');
            content = content.replace(regex, replacement);
            await fs.promises.writeFile(fullPath, content);
            return true;
        } catch (error) {
            console.error(`Failed to update file '${fullPath}': ${error}`);
            return false;
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
        try {
            await fs.promises.appendFile(fullPath, content);
            return true;
        } catch (error) {
            console.error(`Failed to amend file '${fullPath}': ${error}`);
            return false;
        }
    }
}
