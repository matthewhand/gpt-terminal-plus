import { AbstractServerHandler } from '../AbstractServerHandler';
import { SshHostConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { FileReadResult } from '../../types/FileReadResult';
import { changeDirectory as changeDirectoryAction } from './actions/changeDirectory.ssh';
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

    setServerConfig(config: ServerConfig): void {
        this.sshConfig = config as SshHostConfig;
        this.serverConfig = { hostname: config.hostname, protocol: 'ssh', code: config.code || false };
    }

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
                const effectiveDirectory = directory || this.serverConfig.directory || '.';
                const cmd = `cd ${effectiveDirectory} && ${command}`;
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
                // explicit timeout wins, legacy behavior
                setTimeout(() => finalize({ stdout, stderr: stderr || 'Timeout', error: true, exitCode: 124, success: false }), timeout);
            } else {
                const envTimeout = parseInt(process.env.SSH_TIMEOUT || '0', 10);
                if (envTimeout > 0) {
                    setTimeout(() => finalize({ stdout, stderr: stderr || 'Timeout', error: true, exitCode: 124, success: false }), envTimeout);
                }
            }
        });
    }

    async executeCode(code: string, language: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
        sshServerDebug(`Executing SSH code: ${code} in language: ${language} (timeout=${timeout ?? 'none'}, dir=${directory ?? 'cwd'})`);
        return { stdout: 'SSH code executed', stderr: '', error: false, exitCode: 0 };
    }

    async createFile(filePath: string, content?: string, backup: boolean = true): Promise<boolean> {
        const actualContent = content ?? '';
        sshServerDebug(`Creating file on SSH server: ${filePath} (backup=${backup}) contentLength=${actualContent.length}`);
        return true;
    }

    async readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
        const content = await this.getFileContent(filePath);
        return { content, filePath, encoding: 'utf8', truncated: false };
    }

    async updateFile(filePath: string, pattern: string, replacement: string, options?: { backup?: boolean; multiline?: boolean }): Promise<boolean> {
        sshServerDebug(`Updating file on SSH server: ${filePath}`);
        return true;
    }

    async amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
        sshServerDebug(`Amending file on SSH server: ${filePath}`);
        return true;
    }

    async getSystemInfo(): Promise<SystemInfo> {
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

    async listFiles(params: { directory?: string; limit?: number; offset?: number; orderBy?: 'datetime' | 'filename'; recursive?: boolean; typeFilter?: 'files' | 'folders' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        // Note: directory defaults are now handled by AbstractServerHandler.listFilesWithDefaults()
        const { directory, limit, offset } = params;
        sshServerDebug(`Listing files on SSH server in directory: ${directory}`);
        return {
            items: [
                { name: 'file1.txt', isDirectory: false },
                { name: 'file2.txt', isDirectory: false },
            ],
            total: 2,
            limit: limit || 10,
            offset: offset || 0,
        };
    }

    async getFileContent(filePath: string): Promise<string> {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('filePath is required');
        }
        const effectiveDirectory = this.serverConfig.directory || '.';
        const fullPath = `${effectiveDirectory}/${filePath}`;
        const quoted = `'\'${String(fullPath).replace(/'/g, `'\''`)}'`;
        const res = await this.executeCommand(`cat ${quoted}`);
        const ok = (res.exitCode ?? 1) === 0 && !res.error;
        if (ok) return res.stdout;
        throw new Error(res.stderr || `Failed to read file: ${filePath}`);
    }

    async presentWorkingDirectory(): Promise<string> {
        return '/home/user';
    }

    async changeDirectory(directory: string): Promise<boolean> {
        sshServerDebug(`Changing directory on SSH server: ${directory}`);
        return true;
    }
}
