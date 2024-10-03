import { executeLocalCode } from './actions/executeCode';
import { executeFile as executeLocalFile } from './actions/executeFile';
import { createFile as createLocalFile } from './actions/createFile';
import { amendFile as amendLocalFile } from './actions/amendFile';
import { updateFile as updateLocalFile } from './actions/updateFile';
import { AbstractServerHandler } from '../AbstractServerHandler';
import { LocalServerConfig, ServerConfig } from '../../types/ServerConfig';
import { SystemInfo } from '../../types/SystemInfo';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import Debug from 'debug';

const localServerDebug = Debug('app:LocalServerHandler');

export class LocalServerHandler extends AbstractServerHandler {
    private localConfig: LocalServerConfig;
    code: boolean;

    constructor(serverConfig: LocalServerConfig) {
        super(serverConfig);
        this.localConfig = serverConfig;
        this.code = serverConfig.code ?? false;
        localServerDebug('Initialized LocalServerHandler with config:', serverConfig);
    }

    /**
     * Executes a command on the local server.
     */
    async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        localServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
        return executeLocalCode(command, 'bash', timeout, directory);
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
    async listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: string; }): Promise<PaginatedResponse<string>> {
        const { directory, limit = 10, offset = 0 } = params;
        localServerDebug(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}`);
        // Simulate file listing
        const files = ['file1.txt', 'file2.txt'];
        return { items: files.slice(offset, offset + limit), total: files.length, limit, offset };
    }

    /**
     * Creates a file on the local server.
     */
    async createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
        localServerDebug(`Creating file at path: ${filePath}, content: ${content}, backup: ${backup}`);
        return createLocalFile(filePath, content, backup);
    }

    /**
     * Updates the server configuration.
     */
    setServerConfig(config: ServerConfig): void {
        if ('code' in config) {
            this.localConfig = config as LocalServerConfig;
            this.serverConfig = config;
        }
    }

    /**
     * Retrieves the present working directory.
     */
    async presentWorkingDirectory(): Promise<string> {
        return process.cwd();
    }
}
