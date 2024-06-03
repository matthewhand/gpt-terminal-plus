import { v4 as uuidv4 } from 'uuid';
import { Client } from 'ssh2';
import { ServerConfig, SystemInfo } from '../types';
import SSHCommandExecutor from '../utils/SSHCommandExecutor';
import SSHFileOperations from '../utils/SSHFileOperations';
import { ServerHandler } from './ServerHandler';
import debug from 'debug';
import { join } from 'path';
import { homedir } from 'os';
import { readFileSync } from 'fs';
import { SystemInfoRetriever } from '../interfaces/SystemInfoRetriever';
import SSHSystemInfoRetriever from '../utils/SSHSystemInfoRetriever';

const debugLog = debug('app:SshServerHandler');

export class SshServerHandler extends ServerHandler {
    private sshClient: Client;
    private commandExecutor: SSHCommandExecutor;
    private fileOperations: SSHFileOperations;
    private systemInfoRetriever: SystemInfoRetriever;

    /**
     * Constructor for SshServerHandler.
     * @param {ServerConfig} serverConfig - The server configuration.
     */
    constructor(serverConfig: ServerConfig) {
        super(serverConfig);
        this.sshClient = new Client();
        this.setupSSHClient();
        this.commandExecutor = new SSHCommandExecutor(this.sshClient, this.serverConfig);
        this.fileOperations = new SSHFileOperations(this.sshClient, this.serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.serverConfig);
    }

    /**
     * Sets up the SSH client with event listeners.
     */
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

    /**
     * Executes a command on the remote server.
     * @param {string} command - The command to run.
     * @param {object} options - The options for command execution.
     * @param {number} [options.timeout] - The timeout for the command execution.
     * @param {string} [options.directory] - The directory to set as the current working directory.
     * @param {string} [options.path] - The path to set as the current working directory.
     * @param {number} [options.linesPerPage] - The number of lines per page for paginated output.
     * @returns {Promise<object>} - The result of the command execution.
     */
    async executeCommand(command: string, options: { timeout?: number, directory?: string, path?: string, linesPerPage?: number } = {}): Promise<{
        stdout?: string,
        stderr?: string,
        pages?: string[],
        totalPages?: number,
        responseId?: string
    }> {
        const effectiveTimeout = options.timeout || 30;
        const workingDir = options.directory || options.path;
        const commandToRun = workingDir ? `cd ${workingDir} && ${command}` : command;

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
                    responseId: uuidv4()
                };
            }

            return {
                stdout,
                stderr,
                responseId: uuidv4()
            };
        } catch (error) {
            debugLog(`Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    /**
     * Loads the private key from the specified path or default path.
     * @returns {Buffer} - The loaded private key.
     */
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

    /**
     * Initializes utility classes for SSH operations.
     */
    private initializeUtilities(): void {
        this.commandExecutor = new SSHCommandExecutor(this.sshClient, this.serverConfig);
        this.fileOperations = new SSHFileOperations(this.sshClient, this.serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.serverConfig);
    }

     /**
     * Retrieves system information from the remote server.
     * @returns {Promise<SystemInfo>} - The system information.
     */
     async getSystemInfo(): Promise<SystemInfo> {
        debugLog("Retrieving system information from the remote server");

        const localScriptPath = join(__dirname, '..', 'scripts', this.systemInfoRetriever.getSystemInfoScript()); // Local script path
        let remoteScriptPath = `/tmp/${this.systemInfoRetriever.getSystemInfoScript()}`; // Default remote script path for POSIX

        try {
            // Check if the /tmp directory exists for POSIX systems, if not use the home directory
            if (this.serverConfig.posix) {
                const tmpExists = await this.checkRemotePathExists('/tmp');
                if (!tmpExists) {
                    remoteScriptPath = `${this.serverConfig.homeFolder}/${this.systemInfoRetriever.getSystemInfoScript()}`;
                }
            } else {
                // For non-POSIX systems, use the home directory
                remoteScriptPath = `${this.serverConfig.homeFolder}/${this.systemInfoRetriever.getSystemInfoScript()}`;
            }

            // Transfer the script to the remote server
            await this.fileOperations.createFile(remoteScriptPath, Buffer.from(await this.readLocalFile(localScriptPath)), false);

            const command = this.serverConfig.shell === 'powershell' ? `powershell -File ${remoteScriptPath}` : `bash ${remoteScriptPath}`;
            const result = await this.executeCommand(command, { timeout: 60 });

            // Clean up the script after execution (optional)
            await this.fileOperations.deleteFile(remoteScriptPath);

            return JSON.parse(result.stdout || '{}');
        } catch (error) {
            debugLog(`Error retrieving system info: ${error}`);
            return this.systemInfoRetriever.getDefaultSystemInfo();
        }
    }

    /**
     * Reads a local file and returns its content as a string.
     * @param {string} filePath - The path of the file to read.
     * @returns {Promise<string>} - The content of the file.
     */
    private async readLocalFile(filePath: string): Promise<string> {
        const fs = require('fs').promises;
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            debugLog(`Error reading local file ${filePath}: ${error}`);
            throw new Error(`Failed to read local file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Checks if a remote path exists.
     * @param {string} remotePath - The remote path to check.
     * @returns {Promise<boolean>} - True if the path exists, otherwise false.
     */
    private async checkRemotePathExists(remotePath: string): Promise<boolean> {
        try {
            return await this.fileOperations.fileExists(remotePath);
        } catch (error) {
            debugLog(`Error checking remote path ${remotePath}: ${error}`);
            return false;
        }
    }

    /**
     * Lists files in a remote directory.
     * @param {string} directory - The remote directory path.
     * @param {number} [limit=10] - The maximum number of files to return.
     * @param {number} [offset=0] - The offset for file listing.
     * @param {string} [orderBy='filename'] - The criteria to order the files by.
     * @returns {Promise<object>} - The list of files and pagination info.
     */
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

    /**
     * Creates a file on the remote server.
     * @param {string} directory - The remote directory path.
     * @param {string} filename - The name of the file to create.
     * @param {string} content - The content to write to the file.
     * @param {boolean} [backup=false] - Whether to create a backup if the file already exists.
     * @returns {Promise<boolean>} - Whether the file was created successfully.
     */
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

    /**
     * Updates a file on the remote server.
     * @param {string} filePath - The remote file path.
     * @param {string} pattern - The pattern to replace.
     * @param {string} replacement - The replacement text.
     * @param {boolean} [backup=true] - Whether to create a backup of the existing file.
     * @returns {Promise<boolean>} - Whether the file was updated successfully.
     */
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

    /**
     * Appends content to a file on the remote server.
     * @param {string} filePath - The remote file path.
     * @param {string} content - The content to append.
     * @returns {Promise<boolean>} - Whether the file was amended successfully.
     */
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

    /**
     * Sets the default working directory on the remote server.
     * @param {string} directory - The directory to set as the default.
     * @returns {Promise<boolean>} - Whether the default directory was set successfully.
     */
    async setDefaultDirectory(directory: string): Promise<boolean> {
        const checkDirCommand = this.serverConfig.posix ? `cd ${directory} && pwd` : `cd /d ${directory} && echo %cd%`;

        try {
            const { stdout, stderr } = await this.commandExecutor.runCommand(checkDirCommand);
            const currentDir = stdout.trim();
            if (!stderr && (
                this.serverConfig.posix ?
                currentDir === directory :
                currentDir.replace(/\\$/, '').toLowerCase() === directory.toLowerCase().replace(/\\$/, '')
            )) {
                this.defaultDirectory = directory;
                return true;
            }
            return false;
        } catch (error) {
            debugLog(`Error setting working directory: ${error}`);
            return false;
        }
    }
}

export default SshServerHandler;
