import { v4 as uuidv4 } from 'uuid';
import { Client } from 'ssh2';
import { ServerConfig, SystemInfo } from '../types';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';
import { ServerHandler } from './ServerHandler';
import debug from 'debug';
import { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';

const debugLog = debug('app:SshServerHandler');

export class SshServerHandler extends ServerHandler {
    private sshClient: Client;
    private commandExecutor: SSHCommandExecutor;
    private fileOperations: SSHFileOperations;
    private systemInfoRetriever: SSHSystemInfoRetriever;

    constructor(serverConfig: ServerConfig) {
        super(serverConfig);
        this.sshClient = new Client();
        this.setupSSHClient();
        this.commandExecutor = new SSHCommandExecutor(this.sshClient, this.serverConfig);
        this.fileOperations = new SSHFileOperations(this.sshClient, this.serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.sshClient, this.serverConfig);
    }

    private setupSSHClient(): void {
        this.sshClient.on('ready', () => {
            debugLog("SSH Client is ready");
            this.initializeUtilities();
        }).on('error', (err: Error) => {
            debugLog(`SSH Client Error: ${err.message}`);
        }).on('close', () => {
            debugLog("SSH Client Connection Closed");
        });

        try {
            this.sshClient.connect({
                host: this.serverConfig.host,
                port: this.serverConfig.port || 22,
                username: this.serverConfig.username,
                privateKey: this.loadPrivateKey()
            });
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error during SSH connection setup';
            debugLog(`Failed to connect SSH client: ${errorMsg}`);
            console.error('SSH connection failed:', errorMsg);
        }
    }

    async executeCommand(command: string, options: { timeout?: number, directory?: string, linesPerPage?: number } = {}): Promise<{
        stdout?: string,
        stderr?: string,
        pages?: string[],
        totalPages?: number,
        responseId?: string
    }> {
        // Method implementation
        const effectiveTimeout = options.timeout || 30;
        const commandToRun = options.directory ? `cd ${options.directory} && ${command}` : command;

        try {
            const { stdout, stderr } = await this.commandExecutor.runCommand(commandToRun, { timeout: effectiveTimeout });

            if (options.linesPerPage && stdout) {
                const lines = stdout.split('\n');
                const pages = [];
                for (let i = 0; i < lines.length; i += options.linesPerPage) {
                    pages.push(lines.slice(i, i + options.linesPerPage).join('\n'));
                }
                return {
                    stdout,
                    stderr,
                    pages,
                    totalPages: pages.length,
                    responseId: uuidv4()  // Ensuring each session has a unique response ID
                };
            }

            return {
                stdout,
                stderr,
                responseId: uuidv4()  // Ensuring a unique response ID for tracking
            };
        } catch (error) {
            debugLog(`Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }


    private loadPrivateKey(): Buffer {
        const defaultKeyPath = join(homedir(), '.ssh', 'id_rsa');
        const keyPath = this.serverConfig.privateKeyPath || defaultKeyPath;
        try {
            return readFileSync(keyPath);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error reading private key';
            debugLog(`Error loading private key from ${keyPath}: ${errorMsg}`);
            throw new Error(`Failed to load private key from ${keyPath}: ${errorMsg}`);
        }
    }

    private initializeUtilities(): void {
        this.commandExecutor = new SSHCommandExecutor(this.sshClient, this.serverConfig);
        this.fileOperations = new SSHFileOperations(this.sshClient, this.serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.sshClient, this.serverConfig);
    }
    // This part of the code handles system information retrieval and other file operations
    async getSystemInfo(): Promise<SystemInfo> {
        debugLog("Retrieving system information from the remote server");
        try {
            return await this.systemInfoRetriever.getSystemInfo();
        } catch (error) {
            debugLog(`Error retrieving system info: ${error}`);
            return this.systemInfoRetriever.getDefaultSystemInfo();
        }
    }

    async listFiles(directory: string, limit: number = 10, offset: number = 0, orderBy: string = 'filename'): Promise<{ items: string[], totalPages: number, responseId: string }> {
        debugLog(`Listing files in directory: ${directory} with limit: ${limit}, offset: ${offset}, orderBy: ${orderBy}`);
        try {
            const files = await this.fileOperations.folderListing(directory);
            const totalFiles = await this.fileOperations.countFiles(directory);
            const totalPages = Math.ceil(totalFiles / limit);
            return {
                items: files,
                totalPages: totalPages,
                responseId: uuidv4()
            };
        } catch (error) {
            debugLog('Error listing files:', error);
            throw new Error('Failed to list files');
        }
    }

    async createFile(directory: string, filename: string, content: string, backup: boolean = false): Promise<boolean> {
        debugLog(`Creating file at ${directory}/${filename} with backup: ${backup}`);
        try {
            await this.fileOperations.createFile(`${directory}/${filename}`, Buffer.from(content), backup);
            return true;
        } catch (error) {
            debugLog(`Error creating file: ${error}`);
            return false;
        }
    }

    async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
        debugLog(`Updating file at ${filePath} with pattern: ${pattern}`);
        try {
            const content = await this.fileOperations.readFile(filePath);
            const newContent = content.toString().replace(new RegExp(pattern, 'g'), replacement);
            await this.fileOperations.updateFile(filePath, Buffer.from(newContent), backup);
            return true;
        } catch (error) {
            debugLog(`Error updating file: ${error}`);
            return false;
        }
    }

    async amendFile(filePath: string, content: string): Promise<boolean> {
        debugLog(`Amending file at ${filePath}`);
        try {
            const existingContent = await this.fileOperations.readFile(filePath);
            const newContent = existingContent.toString() + content;
            await this.fileOperations.updateFile(filePath, Buffer.from(newContent), false);
            return true;
        } catch (error) {
            debugLog(`Error amending file: ${error}`);
            return false;
        }
    }
}

export default SshServerHandler;