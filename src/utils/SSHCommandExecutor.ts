import { Client } from 'ssh2';
import Debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import SFTPClient from 'ssh2-sftp-client';
import * as fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ServerConfig } from '../types/index';

const debug = Debug('app:SSHCommandExecutor');

/**
 * Retrieves the private key for SSH authentication from the specified path.
 * @param config - The server configuration object containing the private key path.
 * @returns A promise that resolves to a Buffer containing the private key.
 */
export async function getPrivateKey(config: ServerConfig): Promise<Buffer> {
    const privateKeyPath = config.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
    try {
        return await fs.readFile(privateKeyPath);
    } catch (error) {
        throw new Error(`Failed to read private key from ${privateKeyPath}: ${error}`);
    }
}

interface CommandExecutionStrategy {
    executeCommand(
        config: ServerConfig,
        client: Client,
        command: string,
        options?: { cwd?: string, timeout?: number, filePath?: string, fileContent?: string }
    ): Promise<{ stdout: string; stderr: string; timeout?: boolean }>
}
/** 
 * Strategy for executing simple commands directly on the SSH client.
 */
class SimpleExecutionStrategy implements CommandExecutionStrategy {
    async executeCommand(config: ServerConfig, client: Client, command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
        const { cwd, timeout = 60000 } = options;
        const escapedCommand = command.replace(/\/g, '\\'); // Escaping backslashes
        const execCommand = cwd ? `cd ${cwd} && ${escapedCommand}` : escapedCommand;

        debug(`[SimpleExecutionStrategy] Executing simple command: ${escapedCommand}`);
        return new Promise((resolve, reject) => {
            let stdout = '';
            let stderr = '';
            const execTimeout = setTimeout(() => {
                debug(`[SimpleExecutionStrategy] Timeout reached for command: ${escapedCommand}`);
                resolve({ stdout, stderr, timeout: true });
            }, timeout);

            client.exec(execCommand, (err, stream) => {
                if (err) {
                    clearTimeout(execTimeout);
                    debug(`[SimpleExecutionStrategy] Execution error: ${err.message}`);
                    return reject(new Error(`Execution error: ${err.message}`));
                }

                stream.on('data', (data: Buffer) => {
                    stdout += data.toString();
                });

                stream.stderr.on('data', (data: Buffer) => {
                    stderr += data.toString();
                });

                stream.on('close', (code: number) => {
                    clearTimeout(execTimeout);
                    if (code === 0) {
                        debug(`[SimpleExecutionStrategy] Command executed successfully: ${escapedCommand}`);
                    } else {
                        debug(`[SimpleExecutionStrategy] Execution failed for command: ${escapedCommand}, Exit Code: ${code}`);
                    }
                    resolve({ stdout, stderr, timeout: false });
                });
            });
        });
    }
}
/** 
 * Strategy for executing advanced commands in a screen session on the SSH client.
 */
class AdvancedExecutionStrategy implements CommandExecutionStrategy {
    async executeCommand(config: ServerConfig, client: Client, command: string, options: { cwd?: string, timeout?: number, filePath?: string, fileContent?: string } = {}): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
        const { cwd, timeout = 60000, filePath, fileContent } = options;
        const uniqueId = uuidv4();
        const logPath = "/tmp/${uniqueId}.log";
        const screenSessionName = "session_${uniqueId}";
        const escapedCommand = command.replace(/\/g, '\\'); // Escaping backslashes
        const execCommand = cwd ? "cd ${cwd} && " : '';
        const screenCommand = "${execCommand}screen -dmSL ${screenSessionName} bash -c '\''${escapedCommand} > ${logPath} 2>&1'\''";

        if (filePath && fileContent) {
            const sftp = new SFTPClient();
            try {
                await sftp.connect({
                    host: config.host,
                    port: config.port ?? 22,
                    username: config.username,
                    privateKey: await getPrivateKey(config),
                });
                debug("[AdvancedExecutionStrategy] Connected to SFTP server. Uploading file to: ${filePath}");
                await sftp.put(Buffer.from(fileContent), filePath);
                debug("[AdvancedExecutionStrategy] File uploaded successfully.");
            } catch (error) {
                debug("[AdvancedExecutionStrategy] Error during SFTP operation: ${error}");
                throw new Error("SFTP operation failed: ${error}");
            } finally {
                await sftp.end();
                debug("[AdvancedExecutionStrategy] SFTP session ended.");
            }
        }

        debug("[AdvancedExecutionStrategy] Executing command in screen session: ${escapedCommand}");
        return new Promise((resolve, reject) => {
            client.exec(screenCommand, (err, stream) => {
                if (err) {
                    debug("[AdvancedExecutionStrategy] Execution error: ${err.message}");
                    return reject(new Error("Execution error: ${err.message}"));
                }

                stream.on('close', (code: number) => {
                    if (code === 0) {
                        debug("[AdvancedExecutionStrategy] Command executed successfully in screen session: ${screenSessionName}");
                    } else {
                        debug("[AdvancedExecutionStrategy] Execution failed for command in screen session: ${screenSessionName}, Exit Code: ${code}");
                    }
                    resolve({ stdout: "Command executed in screen session. Log file: ${logPath}", stderr: '', timeout: false });
                });
            });
        });
    }
}
/** 
 * SSH Command Executor that uses different strategies for command execution.
 */
class SSHCommandExecutor {
    private strategy: CommandExecutionStrategy;

    constructor(private sshClient: Client, private config: ServerConfig, strategyType: 'simple' | 'advanced' = 'simple') {
        if (!config.host || !config.username) {
            throw new Error('SSH configuration incomplete. Host and username required.');
        }
        this.strategy = strategyType === 'simple' ? new SimpleExecutionStrategy() : new AdvancedExecutionStrategy();
        debug(`SSHCommandExecutor initialized for host: ${config.host} with ${strategyType} strategy.`);
    }

    /**
     * Updates the command execution strategy.
     * @param strategy - The new command execution strategy.
     */
    setStrategy(strategy: CommandExecutionStrategy): void {
        this.strategy = strategy;
        debug('SSH command execution strategy has been updated.');
    }

    /**
     * Executes a command on the SSH client using the specified strategy.
     * @param command - The command to execute.
     * @param options - Optional execution options.
     * @returns A promise that resolves to the command's stdout, stderr, and timeout status.
     */
    async executeCommand(command: string, options?: { cwd?: string, timeout?: number, filePath?: string, fileContent?: string }): Promise<{ stdout: string; stderr: string; timeout?: boolean }> {
        debug(`Executing command: ${command}`);
        return this.strategy.executeCommand(this.config, this.sshClient, command, options);
    }
}

export default SSHCommandExecutor;

