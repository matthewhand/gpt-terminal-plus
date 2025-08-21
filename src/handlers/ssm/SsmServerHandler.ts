import { AbstractServerHandler } from '../AbstractServerHandler';
import { SsmTargetConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import Debug from 'debug';
import { SSMClient, SendCommandCommand, GetCommandInvocationCommand } from '@aws-sdk/client-ssm';

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
        ssmServerDebug(`Executing SSM command via AWS SSM: ${command}`);
        const client = new SSMClient({ region: this.ssmConfig.region });
        const script = directory ? `cd ${directory} && ${command}` : command;
        try {
            const send = await client.send(new SendCommandCommand({
                InstanceIds: [ this.ssmConfig.instanceId ],
                DocumentName: 'AWS-RunShellScript',
                Parameters: { commands: [ script ] }
            }));
            const commandId = send.Command?.CommandId as string;
            const start = Date.now();
            const maxMs = timeout && timeout > 0 ? timeout : 300000; // default 5m
            while (true) {
                const inv = await client.send(new GetCommandInvocationCommand({
                    CommandId: commandId,
                    InstanceId: this.ssmConfig.instanceId
                }));
                const status = inv.Status;
                if (status === 'Success' || status === 'Failed' || status === 'Cancelled' || status === 'TimedOut') {
                    const exitCode = inv.ResponseCode ?? (status === 'Success' ? 0 : 1);
                    return {
                        stdout: inv.StandardOutputContent || '',
                        stderr: inv.StandardErrorContent || '',
                        error: exitCode !== 0,
                        exitCode
                    };
                }
                if (Date.now() - start > maxMs) {
                    return { stdout: '', stderr: 'SSM command timeout', error: true, exitCode: 124 };
                }
                await new Promise(r => setTimeout(r, 1500));
            }
        } catch (e) {
            ssmServerDebug('SSM execute error: ' + String(e));
            return { stdout: '', stderr: String(e), error: true, exitCode: 1 };
        }
    }

    /**
     * Executes code in a specified language on the SSM server.
     */
    async executeCode(code: string, language: string): Promise<ExecutionResult> {
        // Placeholder implementation
        ssmServerDebug(`Executing SSM code: ${code} in language: ${language}`);
        return { stdout: 'SSM code executed', stderr: '', error: false, exitCode: 0 };
    }

    /**
     * Creates a file on the SSM server.
     */
    async createFile(filePath: string): Promise<boolean> {
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
    async listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        const { directory, limit = 10, offset = 0 } = params;
        ssmServerDebug(`Listing files on SSM server in directory: ${directory}`);
        // Placeholder implementation
        return {
            items: [
                { name: 'file1.txt', isDirectory: false },
                { name: 'file2.txt', isDirectory: false }
            ],
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
