import { AbstractServerHandler } from '../AbstractServerHandler';
import { SshHostConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import Debug from 'debug';
import fs from 'fs';
// Using runtime require for ssh2 Client to avoid type-only import issues with jest mocks

const sshServerDebug = Debug('app:SshServerHandler');

export class SshServerHandler extends AbstractServerHandler {
    private sshConfig: SshHostConfig;

    constructor(serverConfig: SshHostConfig) {
        super({ hostname: serverConfig.hostname, protocol: 'ssh', code: serverConfig.code || false });
        this.sshConfig = serverConfig;
        sshServerDebug('Initialized SshServerHandler with config:', serverConfig);
    }

    /**
     * Sets the server configuration.
     */
    setServerConfig(config: ServerConfig): void {
        this.sshConfig = config as SshHostConfig;
        this.serverConfig = { hostname: config.hostname, protocol: 'ssh', code: config.code || false };
    }

    /**
     * Executes a command on the SSH server.
     */
    async executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        sshServerDebug(`Executing SSH command: ${command}`);
        return new Promise<ExecutionResult>((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { Client: SSHClient } = require('ssh2');
            const conn = new SSHClient();
            const key = this.sshConfig.privateKeyPath ? fs.readFileSync(this.sshConfig.privateKeyPath, 'utf8') : undefined;
            const opts: any = {
                host: this.sshConfig.hostname,
                port: this.sshConfig.port || 22,
                username: this.sshConfig.username,
                privateKey: key
            };
            let stdout = '';
            let stderr = '';
            let settled = false;

            const finalize = (result: ExecutionResult) => {
                if (!settled) {
                    settled = true;
                    try { conn.end(); } catch { /* ignore */ }
                    resolve(result);
                }
            };

            conn.on('ready', () => {
                const cmd = directory ? `cd ${directory} && ${command}` : command;
                conn.exec(cmd, (err: Error | null, stream: any) => {
                    if (err) {
                        sshServerDebug('SSH exec error: ' + err.message);
                        return finalize({ stdout: '', stderr: err.message, error: true, exitCode: 1, success: false });
                    }
                    stream.on('close', (code: number) => {
                        const exit = code ?? 1;
                        finalize({ stdout, stderr, error: exit !== 0, exitCode: exit, success: exit === 0 });
                    });
                    stream.on('data', (data: Buffer) => { stdout += data.toString(); });
                    stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });
                });
            }).on('error', (e: unknown) => {
                sshServerDebug('SSH conn error: ' + String(e));
                finalize({ stdout: '', stderr: String(e), error: true, exitCode: 1, success: false });
            }).connect(opts);

            if (timeout && timeout > 0) {
                setTimeout(() => finalize({ stdout, stderr: stderr || 'Timeout', error: true, exitCode: 124, success: false }), timeout);
            }
        });
    }

    /**
     * Executes code in a specified language on the SSH server.
     */
    async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        // Placeholder implementation; align with abstract signature
        sshServerDebug(`Executing SSH code: ${code} in language: ${language} (timeout=${timeout ?? 'none'}, dir=${directory ?? 'cwd'})`);
        return { stdout: 'SSH code executed', stderr: '', error: false, exitCode: 0 };
    }

    /**
     * Creates a file on the SSH server.
     */
    async createFile(filePath: string, content?: string, backup: boolean = true): Promise<boolean> {
        const actualContent = content ?? '';
        // Placeholder for SSH file creation; align with AbstractServerHandler signature
        sshServerDebug(`Creating file on SSH server: ${filePath} (backup=${backup}) contentLength=${actualContent.length}`);
        return true;
    }

    

    /**
     * Retrieves system information for the SSH server.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        // Placeholder for SSH system info retrieval
        return {
            type: 'SshServer',
            platform: 'linux',
            architecture: 'x64',
            totalMemory: 16384,
            freeMemory: 8192,
            uptime: 123456,
            currentFolder: '/home/user',
        };
    }

    /**
     * Lists files on the SSH server.
     */
    async listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: string }): Promise<PaginatedResponse<string>> {
        const { directory, limit = 10, offset = 0 } = params;
        sshServerDebug(`Listing files on SSH server in directory: ${directory}`);
        // Placeholder implementation
        return {
            items: ['file1.txt', 'file2.txt'],
            total: 2,
            limit,
            offset,
        };
    }

    /**
     * Retrieve a file's content over SSH.
     */
    async getFileContent(filePath: string): Promise<string> {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('filePath is required');
        }
        const quoted = `'${String(filePath).replace(/'/g, `'\\''`)}'`;
        const res = await this.executeCommand(`cat ${quoted}`);
        const ok = (res.exitCode ?? 1) === 0 && !res.error;
        if (ok) return res.stdout;
        throw new Error(res.stderr || `Failed to read file: ${filePath}`);
    }

    /**
     * Retrieves the present working directory on the SSH server.
     */
    async presentWorkingDirectory(): Promise<string> {
        // Placeholder for SSH working directory retrieval
        return '/home/user';
    }
}
