import { executeLocalCode } from './actions/executeCode';
import { createFile as createLocalFile } from './actions/createFile';
import { AbstractServerHandler } from '../AbstractServerHandler';
import { LocalServerConfig, ServerConfig } from '../../types/ServerConfig';
import { SystemInfo } from '../../types/SystemInfo';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import listFilesAction from './actions/listFiles';
import { ListParams } from '../../types/ListParams';
import { exec } from 'child_process';
import { getPresentWorkingDirectory } from '../../utils/GlobalStateHelper';
import Debug from 'debug';

const localServerDebug = Debug('app:LocalServerHandler');

export class LocalServerHandler extends AbstractServerHandler {
    private localConfig: LocalServerConfig;
    postCommand: string | undefined;

    constructor(serverConfig: LocalServerConfig) {
        super({ hostname: serverConfig.hostname || 'localhost', protocol: 'local', code: serverConfig.code || false });
        this.localConfig = serverConfig;
        this.postCommand = serverConfig['post-command'] as string | undefined;
        localServerDebug('Initialized LocalServerHandler with config:', serverConfig);
    }

    /**
     * Executes a command on the local server.
     */
    async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        localServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
        const workingDirectory = directory || getPresentWorkingDirectory();
        return executeLocalCode(command, 'bash', timeout, workingDirectory);
    }

    /**
     * Executes code in a specified language.
     */
    async executeCode(code: string, language: string, timeout: number = 5000, directory: string = '/tmp'): Promise<ExecutionResult> {
        if (!code || !language) throw new Error('Code and language are required for execution.');
        localServerDebug(`Executing code: ${code}, language: ${language}, timeout: ${timeout}, directory: ${directory}`);
        return executeLocalCode(code, language, timeout, directory);
    }

    /**
     * Retrieves system information for the local server.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        return {
            type: 'LocalServer',
            platform: process.platform,
            architecture: process.arch,
            totalMemory: 8192,
            freeMemory: 4096,
            uptime: process.uptime(),
            currentFolder: process.cwd(),
        };
    }

    /**
     * Lists files in a specified directory.
     */
    async listFiles(params: ListParams): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        const { directory = '.', limit = 50, offset = 0, orderBy } = params;
        localServerDebug(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}`);
        try {
            const { files, total } = await listFilesAction({ directory, limit, offset, orderBy });
            return {
                items: files,
                total,
                limit,
                offset,
            };
        } catch (error) {
            localServerDebug('Error listing files:', error);
            throw new Error('Failed to list files: ' + (error as Error).message);
        }
    }

    /**
     * Runs post-command if specified and returns its exit code.
     */
    private async runPostCommand(filePath: string): Promise<{ exitCode: number; advice?: string }> {
        if (this.postCommand) {
            const command = `${this.postCommand} ${filePath}`;
            localServerDebug(`Running post-command: ${command}`);
            return new Promise((resolve) => {
                exec(command, (error, stdout) => {
                    if (error) {
                        localServerDebug(`Error running post-command: ${error.message}`);
                        resolve({ exitCode: error.code || 1, advice: 'Post-command failed. Consider checking syntax or permissions.' });
                        return;
                    }
                    localServerDebug(`Post-command stdout: ${stdout}`);
                    resolve({ exitCode: 0, advice: 'Post-command executed successfully.' });
                });
            });
        }
        return { exitCode: 0 };
    }

    /**
     * Creates a file on the local server and runs post-command.
     */
    async createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
        localServerDebug(`Creating file at path: ${filePath}, content: ${content}, backup: ${backup}`);
        const result = await createLocalFile(filePath, content, backup);
        await this.runPostCommand(filePath);
        return result;
    }

    /**
     * Updates the server configuration.
     */
    setServerConfig(config: ServerConfig): void {
        if ('post-command' in config) {
            this.localConfig = config as LocalServerConfig;
            this.serverConfig = { hostname: config.hostname || 'localhost', protocol: 'local', code: config.code || false };
            this.postCommand = config['post-command'] as string | undefined;
        }
    }

    /**
     * Retrieves the present working directory.
     */
    async presentWorkingDirectory(): Promise<string> {
        return process.cwd();
    }
}
