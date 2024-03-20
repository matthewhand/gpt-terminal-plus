import { Client } from 'ssh2';
import Debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import SFTPClient from 'ssh2-sftp-client';
import { ServerConfig } from '../types';
import * as fs from 'fs/promises';

const debug = Debug('app:SSHCommandExecutor');

interface CommandExecutionStrategy {
    executeCommand(config: ServerConfig, client: Client, command: string, options?: { cwd?: string, timeout?: number }): Promise<{ stdout: string; stderr: string, timeout?: boolean }>;
}

class ScriptBasedExecutionStrategy implements CommandExecutionStrategy {
    async executeCommand(config: ServerConfig, client: Client, command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string, timeout?: boolean }> {
        const { cwd, timeout = 60000 } = options;
        const scriptPath = `/tmp/${uuidv4()}.sh`;
        const scriptContent = `#!/bin/bash\n${cwd ? `cd ${cwd} && ` : ''}${command}`;
        
        debug(`Creating script for command execution: ${command}`);
        const sftp = new SFTPClient();
        
        try {
            await sftp.connect({
                host: config.host,
                port: config.port ?? 22,
                username: config.username,
                privateKey: await this.getPrivateKey(config),
            });
            debug(`Connected to SFTP server. Uploading script to: ${scriptPath}`);
            
            await sftp.put(Buffer.from(scriptContent), scriptPath);
            debug(`Script uploaded successfully.`);
        } catch (error) {
            debug(`Error during SFTP operation: ${error instanceof Error ? error.message : error}`);
            throw new Error(`SFTP operation failed: ${error instanceof Error ? error.message : error}`);
        } finally {
            await sftp.end();
        }

        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            const execTimeout = setTimeout(() => {
                debug(`Timeout reached for command: ${command}`);
                resolve({ stdout, stderr, timeout: true });
            }, timeout);

            client.exec(`bash ${scriptPath}`, (err, stream) => {
                if (err) {
                    clearTimeout(execTimeout);
                    debug(`Execution error for command: ${command}, Error: ${err.message}`);
                    return reject(new Error(`Execution error: ${err.message}`));
                }

                stream.on('data', (data: Buffer) => stdout += data.toString());
                stream.stderr.on('data', (data: Buffer) => stderr += data.toString());

                stream.on('close', async (code: number) => {
                    clearTimeout(execTimeout);
                    if (code === 0) {
                        debug(`Command executed successfully: ${command}`);
                        resolve({ stdout, stderr, timeout: false });
                    } else {
                        debug(`Execution failed for command: ${command}, Exit Code: ${code}`);
                        reject(new Error(`Execution failed with code ${code}`));
                    }
                    // Cleanup script from the server if needed
                });
            });
        });
    }

    private async getPrivateKey(config: ServerConfig): Promise<Buffer> {
        if (!config.privateKeyPath) {
            debug('Private key path is not specified in the server configuration.');
            throw new Error('Private key path not specified.');
        }
        try {
            return await fs.readFile(config.privateKeyPath);
        } catch (error) {
            debug(`Error reading private key: ${error instanceof Error ? error.message : error}`);
            throw new Error(`Failed to read private key: ${error instanceof Error ? error.message : error}`);
        }
    }
}

class SSHCommandExecutor {
    private strategy: CommandExecutionStrategy;

    constructor(private sshClient: Client, private config: ServerConfig) {
        if (!config.host || !config.username) {
            debug('SSH configuration is incomplete. Host and username are required.');
            throw new Error('SSH configuration incomplete. Host and username required.');
        }
        this.strategy = new ScriptBasedExecutionStrategy();
        debug(`SSHCommandExecutor initialized for host: ${config.host}`);
    }

    setStrategy(strategy: CommandExecutionStrategy): void {
        this.strategy = strategy;
        debug('SSH command execution strategy has been updated.');
    }

    async executeCommand(command: string, options?: { cwd?: string, timeout?: number }): Promise<{ stdout: string; stderr: string, timeout?: boolean }> {
        debug(`Executing command: ${command}`);
        // Pass config and sshClient directly to the strategy
        return this.strategy.executeCommand(this.config, this.sshClient, command, options);
    }
}

export default SSHCommandExecutor;
