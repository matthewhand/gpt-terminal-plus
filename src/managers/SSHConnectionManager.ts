import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig, SystemInfo } from '../types/index';
import fs from 'fs/promises';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';

// Initialize Debug for logging
const debug = Debug('app:SSHConnectionManager');

class SSHConnectionManager {
    // A static property to hold instances of connection managers indexed by server identifiers
    private static instances: Record<string, SSHConnectionManager> = {};

    // Properties for the SSH client, command executor, and file operations utilities
    private conn: Client;
    private commandExecutor: SSHCommandExecutor | null = null;
    private fileOperations: SSHFileOperations | null = null;
    private serverConfig: ServerConfig;

    // Private constructor to enforce singleton pattern
    private constructor(serverConfig: ServerConfig) {
        this.conn = new Client();
        this.serverConfig = serverConfig;
        this.initializeUtilities();
        this.setupListeners();
        this.connect();
    }

    // Initializes utilities for command execution and file operations
    private initializeUtilities() {
        this.commandExecutor = new SSHCommandExecutor(this.conn, this.serverConfig);
        this.fileOperations = new SSHFileOperations(this.conn, this.serverConfig);
    }

    // Sets up event listeners for the SSH client to log various connection states
    private setupListeners() {
        this.conn.on('ready', () => debug('SSH Connection is ready.'))
                 .on('error', (err) => debug(`SSH Connection error: ${err.message}`))
                 .on('end', () => debug('SSH Connection has ended.'));
    }

    // Connects to the SSH server using the provided server configuration
    private async connect() {
        try {
            // Attempt to read the private key from a path, falling back to a default if not specified
            const privateKeyPath = this.serverConfig.privateKeyPath ?? 'path/to/default/privateKey';
            const privateKey = await fs.readFile(privateKeyPath);
            this.conn.connect({
                host: this.serverConfig.host,
                port: this.serverConfig.port || 22,
                username: this.serverConfig.username,
                privateKey: privateKey.toString(),
            });
        } catch (error) {
            debug(`Error connecting to SSH server: ${error}`);
        }
    }

    // Static method to get an instance of SSHConnectionManager for a given server configuration
    public static async getInstance(serverConfig: ServerConfig): Promise<SSHConnectionManager> {
        const identifier = `${serverConfig.host}:${serverConfig.port}`;
        if (!this.instances[identifier]) {
            const instance = new SSHConnectionManager(serverConfig);
            this.instances[identifier] = instance;
        }
        return this.instances[identifier];
    }

    // Executes a command on the remote SSH server and returns the result
    public async executeCommand(command: string, options?: { cwd?: string; timeout?: number; }): Promise<{ stdout: string; stderr: string; }> {
        if (!this.commandExecutor) {
            throw new Error('Command executor is not initialized.');
        }
        return this.commandExecutor.executeCommand(command, options);
    }

    // Lists files in a specified directory on the remote server
    public async listFiles(directory: string): Promise<string[]> {
        if (!this.fileOperations) {
            throw new Error('File operations utility is not initialized.');
        }
        return this.fileOperations.listFiles(directory);
    }

    // Updates a file on the remote server with the provided content
    public async updateFile(remotePath: string, content: string, backup: boolean = true): Promise<void> {
        if (!this.fileOperations) {
            throw new Error('File operations utility is not initialized.');
        }
        await this.fileOperations.updateFile(remotePath, content, backup);
    }

    // Uploads a local file to the remote server
    public async uploadFile(localPath: string, remotePath: string): Promise<void> {
        if (!this.fileOperations) {
            throw new Error('File operations utility is not initialized.');
        }
        await this.fileOperations.uploadFile(localPath, remotePath);
    }

    // Downloads a file from the remote server to the local filesystem
    public async downloadFile(remotePath: string, localPath: string): Promise<void> {
        if (!this.fileOperations) {
            throw new Error('File operations utility is not initialized.');
        }
        await this.fileOperations.downloadFile(remotePath, localPath);
    }

    // Placeholder for a method to retrieve system information from the remote server
    public async getSystemInfo(): Promise<SystemInfo> {
        throw new Error('Method getSystemInfo() is not implemented.');
    }

    // Disconnects the SSH connection
    public disconnect(): void {
        debug('Disconnecting from SSH server.');
        this.conn.end();
    }

    // Checks if the SSH connection is currently active
    public isConnected(): boolean {
        return this.conn !== null;
    }
}

export default SSHConnectionManager;
