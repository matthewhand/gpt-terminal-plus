import { ServerConfig } from '../types';
import { Client } from 'ssh2';
import SFTPClient from 'ssh2-sftp-client';
import Debug from 'debug';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const debug = Debug('app:SSHCommandExecutor');

class SSHCommandExecutor {
    private sshClient: Client;
    private serverConfig: ServerConfig;
    private isConnected: boolean = false;  // Flag to track connection status

    constructor(sshClient: Client, serverConfig: ServerConfig) {
        this.sshClient = sshClient;
        this.serverConfig = serverConfig;
        this.setupListeners();
    }

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

    private async ensureConnected(): Promise<void> {
        if (this.isConnected) {
            return Promise.resolve();
        }
        return this.connectWithRetry(3); // Try to connect up to 3 times with retries
    }

    private async connectWithRetry(retries: number, delay = 5000): Promise<void> {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await new Promise<void>((resolve, reject) => { // Explicitly type the Promise as void
                    if (this.isConnected) {
                        resolve(); // Correctly resolving without any value
                    } else {
                        this.sshClient.connect({
                            host: this.serverConfig.host,
                            port: this.serverConfig.port || 22,
                            username: this.serverConfig.username,
                            privateKey: fs.readFileSync(this.serverConfig.privateKeyPath || '/root/.ssh/id_rsa'),
                        });
                        this.sshClient.once('ready', resolve);
                        this.sshClient.once('error', reject);
                    }
                });
                break; // Connection was successful, break the loop
            } catch (error) {
                debug(`Attempt ${attempt} to connect failed: ${error}`);
                if (attempt === retries) {
                    throw new Error('All connection attempts failed');
                }
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
            }
        }
    }
        
    public async transferAndExecuteScript(localScriptPath: string, remoteScriptPath: string, command: string) {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.serverConfig.host,
            port: this.serverConfig.port || 22,
            username: this.serverConfig.username,
            privateKey: fs.readFileSync(this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa')),
        });

        await sftp.put(localScriptPath, remoteScriptPath);
        await sftp.end();

        await this.executeRemoteCommand(`${command} ${remoteScriptPath}`);
        await this.executeRemoteCommand(`rm -f ${remoteScriptPath}`);
    }

    public async retrieveScriptOutput(remoteScriptPath: string): Promise<string> {
        const { stdout } = await this.executeRemoteCommand(`cat ${remoteScriptPath}`);
        return stdout;
    }

    public async executeRemoteCommand(command: string): Promise<{ stdout: string; stderr: string }> {
        await this.ensureConnected(); // Ensure connection before running the command
        return new Promise((resolve, reject) => {
            this.sshClient.exec(command, (err, stream) => {
                if (err) reject(err);

                let stdout = '';
                let stderr = '';
                stream.on('data', (data: Buffer) => { stdout += data.toString(); });
                stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

                stream.on('close', (code: number) => {
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Remote command exited with code ${code}`));
                });
            });
        });
    }


    /**
     * Executes a command on the remote server and returns the command output.
     * This method now leverages executeRemoteCommand for all executions.
     * @param command The command to execute.
     * @param options Options object containing optional cwd (current working directory) and timeout.
     * @returns A promise that resolves with the command output, including stdout and stderr.
     */
    public async runCommand(command: string, options: { cwd?: string, timeout?: number } = {}): Promise<{ stdout: string; stderr: string }> {
        await this.ensureConnected(); // Ensure connection before running the command
        const commandToRun = options.cwd ? `cd ${options.cwd} && ${command}` : command; // TODO handle non-posix
        try {
            return await this.executeRemoteCommand(commandToRun);
        } catch (error) {
            debug(`Error executing command via executeRemoteCommand: ${error}`);
            throw error;
        }
    }

    public async transferFile(localPath: string, remotePath: string): Promise<void> {
        await this.ensureConnected(); // Ensure connection before running the command
        // Check if privateKeyPath is defined or throw an error
        if (!this.serverConfig.privateKeyPath) {
            throw new Error('Private key path is not defined in server configuration.');
        }
        const privateKey = fs.readFileSync(this.serverConfig.privateKeyPath); // Safely read the private key

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

    public async amendFile(remotePath: string, content: string, backup: boolean = true): Promise<void> {
        await this.ensureConnected(); // Ensure connection before running the command
        // Check if privateKeyPath is defined or throw an error
        if (!this.serverConfig.privateKeyPath) {
            throw new Error('Private key path is not defined in server configuration.');
        }
        const privateKey = fs.readFileSync(this.serverConfig.privateKeyPath); // Safely read the private key        
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.serverConfig.host,
            port: this.serverConfig.port || 22,
            username: this.serverConfig.username,
            privateKey: privateKey,
        });

        if (backup) {
            const backupPath = `${remotePath}.${uuidv4()}.bak`;
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
