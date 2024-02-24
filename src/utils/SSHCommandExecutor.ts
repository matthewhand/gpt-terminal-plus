import { Client } from 'ssh2';
import SFTPClient from 'ssh2-sftp-client';
import Debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import { ServerConfig } from '../types'; // Adjust import path as needed
import * as fs from 'fs/promises';

const debug = Debug('app:SSHCommandExecutor');

class SSHCommandExecutor {
    private sshClient: Client;
    private config: ServerConfig;

    constructor(sshClient: Client, config: ServerConfig) {
        this.sshClient = sshClient;
        this.config = config;
    }

    public async executeCommand(command: string, options: { cwd?: string } = {}): Promise<{ stdout: string; stderr: string }> {
        if (executeViaScript()) {
            debug(`Executing command via script.`);
            return this.executeViaScript(command, options);
        } else {
            debug(`Executing command directly.`);
            return this.executeDirectly(command, options);
        }
    }

    private async executeDirectly(command: string, options: { cwd?: string }): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            this.sshClient.exec(options.cwd ? `cd ${options.cwd} && ${command}` : command, (err, stream) => {
                if (err) return reject(`Direct execution error: ${err.message}`);

                let stdout = '';
                let stderr = '';
                stream.on('data', (data: Buffer) => stdout += data.toString());
                stream.stderr.on('data', (data: Buffer) => stderr += data.toString());

                stream.on('close', (code: number, signal: string) => {
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Command execution failed with code ${code} and signal ${signal}`));
                });
            });
        });
    }

    private async executeViaScript(command: string, options: { cwd?: string }): Promise<{ stdout: string; stderr: string }> {
        const scriptPath = `/tmp/${uuidv4()}.sh`;
        const scriptContent = `#!/bin/bash\n${options.cwd ? `cd ${options.cwd} && ` : ''}${command}`;

        await this.transferScript(scriptPath, scriptContent);
        const executionResult = await this.executeScript(scriptPath);
        if (removeScriptAfterExecution()) {
            await this.cleanupScript(scriptPath).catch(err => debug(`Failed to cleanup script: ${err}`));
        }
        return executionResult; // Ensure we return the result of script execution
    }

    private async transferScript(scriptPath: string, scriptContent: string): Promise<void> {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.config.host,
            port: this.config.port ?? 22,
            username: this.config.username ?? '',
            privateKey: await this.getPrivateKey(),
        });
        await sftp.put(Buffer.from(scriptContent), scriptPath);
        await sftp.end();
    }

    private async getPrivateKey(): Promise<Buffer> {
        if (!this.config.privateKeyPath) {
            throw new Error('No private key path specified in server configuration');
        }
        try {
            const privateKey = await fs.readFile(this.config.privateKeyPath);
            return privateKey;
        } catch (error) {
            debug(`Failed to read private key from ${this.config.privateKeyPath}: ${error}`);
            throw new Error(`Failed to read private key: ${error}`);
        }
    }

    private async executeScript(scriptPath: string): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            this.sshClient.exec(`bash ${scriptPath}`, (err, stream) => {
                if (err) {
                    this.cleanupAfterExecution(scriptPath); // Cleanup before rejecting
                    return reject(`Script execution error: ${err.message}`);
                }
    
                let stdout = '';
                let stderr = '';
                stream.on('data', (data: Buffer) => stdout += data.toString());
                stream.stderr.on('data', (data: Buffer) => stderr += data.toString());
    
                stream.on('close', async (code: number, signal: string) => {
                    await this.cleanupAfterExecution(scriptPath); // Cleanup before resolving or rejecting
                    if (code === 0) {
                        resolve({ stdout, stderr });
                    } else {
                        reject(new Error(`Script execution failed with code ${code} and signal ${signal}`));
                    }
                });
            });
        });
    }
    
    private async cleanupAfterExecution(scriptPath: string): Promise<void> {
        if (removeScriptAfterExecution()) {
            try {
                await this.cleanupScript(scriptPath);
            } catch (err) {
                debug(`Failed to cleanup script: ${err}`);
                // Optionally handle cleanup errors here, e.g., logging or secondary cleanup attempts
            }
        }
    }
    
    private async cleanupScript(scriptPath: string): Promise<void> {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.config.host,
            port: this.config.port ?? 22,
            username: this.config.username ?? '',
            privateKey: await this.getPrivateKey(),
        });
        await sftp.delete(scriptPath);
        await sftp.end();
    }
}

function executeViaScript(): boolean {
    return process.env.EXECUTE_VIA_SCRIPT !== 'false';
}

function removeScriptAfterExecution(): boolean {
    return process.env.REMOVE_SCRIPT_AFTER_EXECUTION !== 'false';
}

export default SSHCommandExecutor;
