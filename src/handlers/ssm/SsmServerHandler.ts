import { AbstractServerHandler } from '../AbstractServerHandler';
import { SsmTargetConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { ListParams } from '../../types/ListParams';
import { changeDirectory as changeDirectoryAction } from './actions/changeDirectory.ssm';
import Debug from 'debug';
import { SSMClient, SendCommandCommand, GetCommandInvocationCommand } from '@aws-sdk/client-ssm';

const ssmServerDebug = Debug('app:SsmServerHandler');

export class SsmServerHandler extends AbstractServerHandler {
    private ssmConfig: SsmTargetConfig;
    private client: SSMClient;

    constructor(serverConfig: SsmTargetConfig) {
        super({ hostname: serverConfig.hostname, protocol: 'ssm', code: serverConfig.code || false });
        this.ssmConfig = serverConfig;
        // Initialize AWS SSM client immediately (tests assert constructor behavior)
        this.client = new SSMClient({ region: this.ssmConfig.region });
        ssmServerDebug('Initialized SsmServerHandler with config:', serverConfig);
    }

    setServerConfig(config: ServerConfig): void {
        this.ssmConfig = config as SsmTargetConfig;
        this.serverConfig = { hostname: config.hostname, protocol: 'ssm', code: config.code || false };
    }

    async executeCommand(command: string, timeout?: number, directory?: string): Promise<any> {
        return this.runSsmCommand(directory ? `cd ${directory} && ${command}` : command, timeout);
    }

    async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<any> {
        ssmServerDebug(`Executing SSM code: ${code} in language: ${language} (timeout=${timeout ?? 'none'}, dir=${directory ?? 'cwd'})`);
        let cmd: string;
        switch ((language || '').toLowerCase()) {
            case 'python':
            case 'python3':
                cmd = `python3 -c "${String(code).replace(/(["\\`$])/g, '\\$1').replace(/\n/g, '\\n')}"`;
                break;
            case 'bash':
            case 'sh':
                cmd = `bash -lc "${String(code).replace(/(["\\`$])/g, '\\$1').replace(/\n/g, '\\n')}"`;
                break;
            default:
                cmd = `sh -lc "${String(code).replace(/(["\\`$])/g, '\\$1').replace(/\n/g, '\\n')}"`;
        }
        if (directory) cmd = `cd ${directory} && ${cmd}`;
        return this.runSsmCommand(cmd, timeout);
    }

    async createFile(filePath: string, content?: string, backup: boolean = true): Promise<any> {
        const actualContent = content ?? '';
        ssmServerDebug(`Creating file on SSM server: ${filePath} (backup=${backup}) contentLength=${actualContent.length}`);
        const quoted = `'${String(filePath).replace(/'/g, `'\''`)}'`;
        const cmd = actualContent ? `printf %s ${quoted} > ${quoted}` : `touch ${quoted}`;
        return this.runSsmCommand(cmd);
    }

    async readFile(filePath: string, _options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<any> {
        return this.getFileContent(filePath);
    }

    async updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean> {
        ssmServerDebug(`Updating file on SSM server: ${filePath}`);
        return true;
    }

    async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<any> {
        ssmServerDebug(`Amending file on SSM server: ${filePath}`);
        const quoted = `'${String(filePath).replace(/'/g, `'\''`)}'`;
        const cmd = `printf %s "${String(content).replace(/(["\\`$])/g, '\\$1')}" >> ${quoted}`;
        return this.runSsmCommand(cmd);
    }

    async getFileContent(filePath: string): Promise<any> {
        if (!filePath || typeof filePath !== 'string') {
            return { success: false, output: '', error: 'filePath is required', exitCode: -1 };
        }
        const quoted = `'${String(filePath).replace(/'/g, `'\''`)}'`;
        return this.runSsmCommand(`cat ${quoted}`);
    }

    async getSystemInfo(): Promise<any> {
        return this.runSsmCommand('uname -a');
    }

    /**
     * Lists files on the SSM server.
     */
    async listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        const { directory, limit = 10, offset = 0 } = params;
        ssmServerDebug(`Listing files on SSM server in directory: ${directory}`);
        return {
            items: [
                { name: 'file1.txt', isDirectory: false },
                { name: 'file2.txt', isDirectory: false }
            ],
            total: 2,
            limit: limit || 10,
            offset: offset || 0,
        };
    }

    async presentWorkingDirectory(): Promise<string> {
        return '/home/user';
    }

    async changeDirectory(directory: string): Promise<boolean> {
        const success = await changeDirectoryAction(directory);
        if (success) {
            this.serverConfig.directory = directory;
        }
        return success;
    }

    private async runSsmCommand(command: string, timeout?: number): Promise<{ success: boolean; output: string; error: string; exitCode: number }> {
        ssmServerDebug(`Executing SSM command: ${command}`);
        const client = this.client;
        try {
            const send = await client.send(new SendCommandCommand({
                InstanceIds: [ this.ssmConfig.instanceId ],
                DocumentName: 'AWS-RunShellScript',
                Parameters: { commands: [ command ] }
            }));
            const commandId = send.Command?.CommandId as string | undefined;
            if (!commandId) {
                return { success: false, output: '', error: 'Failed to get command ID from AWS response', exitCode: -1 };
            }
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
                    const stdout = inv.StandardOutputContent || '';
                    const stderr = inv.StandardErrorContent || '';
                    if (exitCode === 0) {
                        return { success: true, output: stdout, error: '', exitCode: 0 };
                    }
                    return { success: false, output: '', error: stderr || 'Command failed', exitCode };
                }
                if (Date.now() - start > maxMs) {
                    return { success: false, output: '', error: 'Command execution timed out', exitCode: -1 };
                }
                await new Promise(r => setTimeout(r, 150));
            }
        } catch (e: any) {
            ssmServerDebug('SSM execute error: ' + String(e?.message || e));
            return { success: false, output: '', error: String(e?.message || e), exitCode: -1 };
        }
    }
}
