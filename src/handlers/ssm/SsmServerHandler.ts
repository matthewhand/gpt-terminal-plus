import { AbstractServerHandler } from '../AbstractServerHandler';
import { SsmTargetConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import Debug from 'debug';

const ssmServerDebug = Debug('app:SsmServerHandler');

export class SsmServerHandler extends AbstractServerHandler {
    private ssmConfig: SsmTargetConfig;

    constructor(serverConfig: SsmTargetConfig) {
        super({ hostname: serverConfig.hostname, protocol: 'ssm', code: serverConfig.code || false });
        this.ssmConfig = serverConfig;
        ssmServerDebug('Initialized SsmServerHandler with config:', serverConfig);
    }

    /**
     * Sets the server configuration.
     */
    setServerConfig(config: ServerConfig): void {
        this.ssmConfig = config as SsmTargetConfig;
        this.serverConfig = { hostname: config.hostname, protocol: 'ssm', code: config.code || false };
    }

    /**
     * Executes a command on the SSM server.
     */
    async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        // Placeholder for SSM command execution
        ssmServerDebug(`Executing SSM command: ${command}`);
        return { stdout: 'SSM command executed', stderr: '' };
    }

    /**
     * Executes code in a specified language on the SSM server.
     */
    async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        // Placeholder implementation
        ssmServerDebug(`Executing SSM code: ${code} in language: ${language}`);
        return { stdout: 'SSM code executed', stderr: '' };
    }

    /**
     * Creates a file on the SSM server.
     */
    async createFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
        // Placeholder for SSM file creation
        ssmServerDebug(`Creating file on SSM server: ${filePath}`);
        return true;
    }

    /**
     * Retrieves system information for the SSM server.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        // Placeholder for SSM system info retrieval
        return {
            type: 'SsmServer',
            platform: 'linux',
            architecture: 'x64',
            totalMemory: 16384,
            freeMemory: 8192,
            uptime: 123456,
            currentFolder: '/home/user',
        };
    }

    /**
     * Lists files on the SSM server.
     */
    async listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: string }): Promise<PaginatedResponse<string>> {
        const { directory, limit = 10, offset = 0 } = params;
        ssmServerDebug(`Listing files on SSM server in directory: ${directory}`);
        // Placeholder implementation
        return {
            items: ['file1.txt', 'file2.txt'],
            total: 2,
            limit,
            offset,
        };
    }

    /**
     * Retrieves the present working directory on the SSM server.
     */
    async presentWorkingDirectory(): Promise<string> {
        // Placeholder for SSM working directory retrieval
        return '/home/user';
    }
}
