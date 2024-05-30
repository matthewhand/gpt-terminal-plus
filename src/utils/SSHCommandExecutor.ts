import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import Debug from 'debug';
import SFTPClient from 'ssh2-sftp-client';
import { ServerConfig } from '../types';

const debug = Debug('app:SSHCommandExecutor');

/**
 * Class to execute commands on a remote server via SSH.
 */
class SSHCommandExecutor {
    private sshClient: Client;
    private serverConfig: ServerConfig;
    private isConnected: boolean;

    /**
     * Constructor for SSHCommandExecutor.
     * @param {Client} sshClient - The SSH client.
     * @param {ServerConfig} serverConfig - Configuration for the server.
     */
    constructor(sshClient: Client, serverConfig: ServerConfig) {
        this.sshClient = sshClient;
        this.serverConfig = serverConfig;
        this.isConnected = false;
        this.setupListeners();
    }

    /**
     * Set up event listeners for the SSH client.
     */
    private setupListeners(): void {
        this.sshClient.on('ready', () => {
            debug('SSH Client connected successfully.');
            this.isConnected = true;
        }).on('error', (err) => {
            debug('SSH Client connection error:', err);
            this.isConnected = false;
        }).on('end', () => {
            this.isConnected = false;
        }).on('close', () => {
            this.isConnected = false;
        });
    }

    /**
     * Ensure the SSH connection is established.
     * @returns {Promise<void>}
     */
    private async ensureConnected(): Promise<void> {
        if (this.isConnected) {
            return Promise.resolve();
        }
        return this.connectWithRetry(3); // Retry connection 3 times
    }

    /**
     * Connect to the SSH server with retries.
     * @param {number} retries - Number of retries.
     * @param {number} [delay=5000] - Delay between retries in milliseconds.
     * @returns {Promise<void>}
     */
    private async connectWithRetry(retries: number, delay = 5000): Promise<void> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await new Promise<void>((resolve, reject) => {
                    if (this.isConnected) {
                        resolve();
                    } else {
                        this.sshClient.connect({
                            host: this.serverConfig.host,
                            port: this.serverConfig.port || 22,
                            username: this.serverConfig.username,
                            privateKey: fs.readFileSync(this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa')),
                        });
                        this.sshClient.once('ready', () => {
                            this.isConnected = true;
                            resolve();
                        });
                        this.sshClient.once('error', reject);
                    }
                });
                break; // Connection was successful, break the loop
            } catch (error) {
                debug(`Attempt ${attempt} to connect failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                if (attempt === retries) {
                    throw new Error('All connection attempts failed');
                }
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
            }
        }
    }

    /**
     * Run a command on the remote server.
     * @param {string} command - The command to run.
     * @param {Object} [options] - Optional settings for command execution.
     * @param {string} [options.cwd] - Directory to change to before running the command.
     * @param {number} [options.timeout] - Timeout for the command execution.
     * @returns {Promise<{ stdout: string; stderr: string }>}
     */
    public async runCommand(command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string }> {
        await this.ensureConnected(); // Ensure connection before running the command
        const commandToRun = options.cwd ? `cd ${options.cwd} && ${command}` : command;

        return new Promise((resolve, reject) => {
            this.sshClient.exec(commandToRun, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }

                let stdout = '';
                let stderr = '';
                stream.on('data', (data: Buffer) => { stdout += data.toString(); });
                stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

                stream.on('close', (code: number) => {
                    if (code === 0) {
                        resolve({ stdout, stderr });
                    } else {
                        reject(new Error(`Remote command exited with code ${code}`));
                    }
                });
            });
        });
    }

    /**
     * Transfer a file to the remote server.
     * @param {string} localPath - The local path of the file.
     * @param {string} remotePath - The remote path where the file should be transferred.
     * @returns {Promise<void>}
     */
    public async transferFile(localPath: string, remotePath: string): Promise<void> {
        await this.ensureConnected(); // Ensure connection before running the command
        const privateKey = fs.readFileSync(this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa'));

        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.serverConfig.host,
            port: this.serverConfig.port || 22,
            username: this.serverConfig.username,
            privateKey: privateKey
        });

        await sftp.put(localPath, remotePath);
        await sftp.end();
    }

    /**
     * Amend a file on the remote server.
     * @param {string} remotePath - The remote path of the file.
     * @param {string} content - The content to append to the file.
     * @param {boolean} [backup=true] - Whether to create a backup of the file.
     * @returns {Promise<void>}
     */
    public async amendFile(remotePath: string, content: string, backup: boolean = true): Promise<void> {
        await this.ensureConnected(); // Ensure connection before running the command
        const privateKey = fs.readFileSync(this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa'));

        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.serverConfig.host,
            port: this.serverConfig.port || 22,
            username: this.serverConfig.username,
            privateKey: privateKey,
        });

        if (backup) {
            const backupPath = `${remotePath}.${Date.now()}.bak`;
            await sftp.rename(remotePath, backupPath);
            debug(`Backup created: ${backupPath}`);
        }

        let existingContent = "";
        try {
            const buffer = await sftp.get(remotePath);
            existingContent = buffer.toString('utf8');
        } catch (error) {
            debug(`Error retrieving existing content: ${error}`);
            // Assuming file might not exist, hence ignoring error
        }

        const amendedContent = existingContent + content;
        await sftp.put(Buffer.from(amendedContent), remotePath);

        await sftp.end();
    }
}

export default SSHCommandExecutor;
