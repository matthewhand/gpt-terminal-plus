
import { AbstractServerHandler } from '../AbstractServerHandler';
import { SsmTargetConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { FileReadResult } from '../../types/FileReadResult';
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

    setServerConfig(config: ServerConfig): void {
        this.ssmConfig = config as SsmTargetConfig;
        this.serverConfig = { hostname: config.hostname, protocol: 'ssm', code: config.code || false };
    }

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
            const defaultSsmTimeout = parseInt(process.env.SSM_TIMEOUT || '300000', 10); // default 5m
            const maxMs = (timeout && timeout > 0) ? timeout : defaultSsmTimeout;
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
                        exitCode,
                        success: exitCode === 0,
                        error: exitCode !== 0
                    };
                }
                if (Date.now() - start > maxMs) {
                    return { stdout: '', stderr: 'SSM command timeout', exitCode: 124, success: false, error: true };
                }
                await new Promise(r => setTimeout(r, 1500));
            }
        } catch (e) {
            ssmServerDebug('SSM execute error: ' + String(e));
            return { stdout: '', stderr: String(e), exitCode: 1, success: false, error: true };
        }
    }

    async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        ssmServerDebug(`Executing SSM code: ${code} in language: ${language} (timeout=${timeout ?? 'none'}, dir=${directory ?? 'cwd'})`);
        return { stdout: 'SSM code executed', stderr: '', exitCode: 0, success: true, error: false };
    }

    async createFile(filePath: string, content?: string, backup: boolean = true): Promise<boolean> {
        const actualContent = content ?? '';
        ssmServerDebug(`Creating file on SSM server: ${filePath} (backup=${backup}) contentLength=${actualContent.length}`);
        return true;
    }

    async readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
        const content = await this.getFileContent(filePath);
        return { content, filePath, encoding: 'utf8', truncated: false };
    }

    async updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean> {
        ssmServerDebug(`Updating file on SSM server: ${filePath}`);
        return true;
    }

    async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
        ssmServerDebug(`Amending file on SSM server: ${filePath}`);
        return true;
    }

    async getFileContent(filePath: string): Promise<string> {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('filePath is required');
        }
        const quoted = `'\''${String(filePath).replace(/'/g, `'\''`)}'`;
        const res = await this.executeCommand(`cat ${quoted}`);
        const ok = (res.exitCode ?? 1) === 0 && !res.error;
        if (ok) {
            return res.stdout;
        }
        throw new Error(res.stderr || `Failed to read file: ${filePath}`);
    }

    async getSystemInfo(): Promise<SystemInfo> {
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

    async listFiles(params: { directory?: string; limit?: number; offset?: number; orderBy?: string; recursive?: boolean; typeFilter?: 'files' | 'folders' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        const { directory = '.', limit = 10, offset = 0 } = params;
        ssmServerDebug(`Listing files on SSM server in directory: ${directory}`);
        return {
            items: [
                { name: 'file1.txt', isDirectory: false },
                { name: 'file2.txt', isDirectory: false },
            ],
            total: 2,
            limit,
            offset,
        };
    }

    async presentWorkingDirectory(): Promise<string> {
        return '/home/user';
    }

    async changeDirectory(directory: string): Promise<boolean> {
        ssmServerDebug(`Changing directory on SSM server: ${directory}`);
        return true;
    }
}
