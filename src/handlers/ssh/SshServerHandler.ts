import { AbstractServerHandler } from '../AbstractServerHandler';
import { SshHostConfig, ServerConfig } from '../../types/ServerConfig';
import { ExecutionResult } from '../../types/ExecutionResult';
import { SystemInfo } from '../../types/SystemInfo';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import Debug from 'debug';
import fs from 'fs';
import { Client } from 'ssh2';

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
            const conn = new Client();
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
                conn.exec(cmd, (err, stream) => {
                    if (err) {
                        sshServerDebug('SSH exec error: ' + err.message);
                        return finalize({ stdout: '', stderr: err.message, error: true, exitCode: 1 });
                    }
                    stream.on('close', (code: number) => {
                        finalize({ stdout, stderr, error: (code ?? 1) !== 0, exitCode: code ?? 1 });
                    });
                    stream.on('data', (data: Buffer) => { stdout += data.toString(); });
                    stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });
                });
            }).on('error', (e) => {
                sshServerDebug('SSH conn error: ' + String(e));
                finalize({ stdout: '', stderr: String(e), error: true, exitCode: 1 });
            }).connect(opts);

            if (timeout && timeout > 0) {
                setTimeout(() => finalize({ stdout, stderr: stderr || 'Timeout', error: true, exitCode: 124 }), timeout);
            }
        });
    }

    /**
     * Executes code in a specified language on the SSH server.
     */
    async executeCode(code: string, language: string): Promise<ExecutionResult> {
        // Placeholder implementation
        sshServerDebug(`Executing SSH code: ${code} in language: ${language}`);
        return { stdout: 'SSH code executed', stderr: '', error: false, exitCode: 0 };
    }

    /**
     * Creates a file on the SSH server.
     */
    async createFile(filePath: string): Promise<boolean> {
        // Placeholder for SSH file creation
        sshServerDebug(`Creating file on SSH server: ${filePath}`);
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
    async listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
        const { directory, limit = 10, offset = 0 } = params;
        sshServerDebug(`Listing files on SSH server in directory: ${directory}`);
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
     * Retrieves the present working directory on the SSH server.
     */
    async presentWorkingDirectory(): Promise<string> {
        // Placeholder for SSH working directory retrieval
        return '/home/user';
    }
}
