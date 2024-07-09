import { v4 as uuidv4 } from 'uuid';
import { Client } from 'ssh2';
import { ServerConfig, SystemInfo } from '../types';
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
    private fileOperations: SSHFileOperations;
    private systemInfoRetriever: SSHSystemInfoRetriever;

    /**
     * Constructor for SshServerHandler.
     * @param {ServerConfig} serverConfig - The server configuration.
     */
    constructor(serverConfig: ServerConfig) {
        super(serverConfig);
        this.sshClient = new Client();
        this.fileOperations = new SSHFileOperations(this.sshClient, serverConfig);
        this.systemInfoRetriever = new SSHSystemInfoRetriever(this.serverConfig);
        this.setupSSHClient();
    }

    /**
     * Sets up the SSH client with event listeners.
     */
    private setupSSHClient(): void {
        this.sshClient.on('ready', async () => {
            debugLog("SSH Client is ready");
            await this.initializeUtilities();
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
    private async initializeUtilities(): Promise<void> {
        const remoteScriptFolder = await this.systemInfoRetriever.determineRemoteScriptFolder();
        this.serverConfig.scriptFolder = remoteScriptFolder;
        debugLog(`Initialized utilities with remote script folder: ${remoteScriptFolder}`);
    }

    /**
     * Creates a temporary script file on the remote server.
     * @param {string} content - The content of the script.
     * @returns {Promise<string>} - The path to the temporary script file.
     */
    private async createRemoteTempFile(content: string): Promise<string> {
        const tempFileName = `temp_script_${Date.now()}.sh`;
        const tempFilePath = `${this.serverConfig.scriptFolder}/${tempFileName}`;

        await this.fileOperations.createFile(tempFilePath, Buffer.from(content), false);
        debugLog(`Created remote temp file: ${tempFilePath}`);
        return tempFilePath;
    }

    /**
     * Executes a command on the remote server.
     * @param {string} command - The command to run.
     * @param {object} options - The options for command execution.
     * @param {number} [options.timeout] - The timeout for the command execution.
     * @param {string} [options.directory] - The directory to set as the current working directory.
     * @param {number} [options.linesPerPage] - The number of lines per page for paginated output.
     * @returns {Promise<object>} - The result of the command execution.
     */
    public async executeCommand(command: string, options: { timeout?: number, directory?: string, linesPerPage?: number } = {}): Promise<{
        stdout?: string,
        stderr?: string,
        pages?: string[],
        totalPages?: number,
        responseId?: string
    }> {
        debugLog(`Executing command: ${command} with options: ${JSON.stringify(options)}`);
        const scriptContent = options.directory ? `cd ${options.directory} && ${command}` : command;
        const remoteTempFilePath = await this.createRemoteTempFile(scriptContent);

        const shell = this.serverConfig.shell || 'bash';
        const execCommand = `${shell} ${remoteTempFilePath}`;

        const { stdout, stderr } = await this.runCommandWithRetries(execCommand, { timeout: options.timeout });

        const pages: string[] = [];
        let totalPages = 0;
        if (options.linesPerPage && stdout) {
            const lines = stdout.split('\n');
            for (let i = 0; i < lines.length; i += options.linesPerPage) {
                pages.push(lines.slice(i, i + options.linesPerPage).join('\n'));
            }
            totalPages = pages.length;
        }

        await this.fileOperations.deleteFile(remoteTempFilePath);
        debugLog(`Command execution completed with responseId: ${uuidv4()}`);

        return {
            stdout,
            stderr,
            pages,
            totalPages,
            responseId: uuidv4()
        };
    }

    /**
     * Runs a command with retries in case of failure.
     * @param {string} command - The command to run.
     * @param {object} options - The options for command execution.
     * @param {number} [options.timeout] - The timeout for the command execution.
     * @returns {Promise<object>} - The result of the command execution.
     */
    private async runCommandWithRetries(command: string, options: { timeout?: number } = {}): Promise<{ stdout: string, stderr: string }> {
        const retries = 3;
        const delay = 5000;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                debugLog(`Running command attempt ${attempt}: ${command}`);
                return await this.runCommand(command, options);
            } catch (error) {
                debugLog(`Attempt ${attempt} to run command failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                if (attempt === retries) {
                    throw new Error('All command execution attempts failed');
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error('Command execution failed after retries');
    }

    /**
     * Runs a command on the remote server.
     * @param {string} command - The command to run.
     * @param {object} options - The options for command execution.
     * @param {number} [options.timeout] - The timeout for the command execution.
     * @returns {Promise<object>} - The result of the command execution.
     */
    private runCommand(command: string, options: { timeout?: number } = {}): Promise<{ stdout: string, stderr: string }> {
        // TODO handle timeout
        return new Promise((resolve, reject) => {
            this.sshClient.exec(command, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }

                let stdout = '';
                let stderr = '';
                stream.on('data', (data: Buffer) => { stdout += data.toString(); });
                stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

                stream.on('close', (code: number) => {
                    debugLog(`Command stream closed with code: ${code}`);
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
     * Retrieves system information from the remote server.
     * @returns {Promise<SystemInfo>} - The system information.
     */
    async getSystemInfo(): Promise<SystemInfo> {
        debugLog("Retrieving system information from the remote server");

        const localScriptPath = join(__dirname, '..', 'scripts', this.systemInfoRetriever.getSystemInfoScript());
        const remoteScriptPath = `${this.serverConfig.scriptFolder}/${this.systemInfoRetriever.getSystemInfoScript()}`;

        try {
            await this.fileOperations.createFile(remoteScriptPath, Buffer.from(await this.readLocalFile(localScriptPath)), false);
            debugLog(`Transferred system info script to remote path: ${remoteScriptPath}`);

            const shell = this.serverConfig.shell || 'bash';
            const command = shell === 'powershell' ? `powershell -File ${remoteScriptPath}` : `${shell} ${remoteScriptPath}`;
            const result = await this.executeCommand(command, { timeout: 60 });

            await this.fileOperations.deleteFile(remoteScriptPath);
            debugLog(`Deleted remote system info script: ${remoteScriptPath}`);

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
            const content = await fs.readFile(filePath, 'utf8');
            debugLog(`Read local file: ${filePath}`);
            return content;
        } catch (error) {
            debugLog(`Error reading local file ${filePath}: ${error}`);
            throw new Error(`Failed to read local file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            debugLog(`Listed ${files.length} files from directory: ${directory}`);
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
            debugLog(`File created at ${directory}/${filename}`);
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
            debugLog(`File updated at ${filePath}`);
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
            debugLog(`File amended at ${filePath}`);
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
            const { stdout, stderr } = await this.executeCommand(checkDirCommand);
            if (stdout) { 
                const currentDir = stdout.trim();
                debugLog(`Set default directory: ${currentDir}`);
                if (!stderr && (
                    this.serverConfig.posix ?
                    currentDir === directory :
                    currentDir.replace(/\\$/, '').toLowerCase() === directory.toLowerCase().replace(/\\$/, '')
                )) {
                    super.setDefaultDirectory(directory);
                    return true;
                }
            }
            return false;
        } catch (error) {
            debugLog(`Error setting working directory: ${error}`);
            return false;
        }
    }
}

export default SshServerHandler;
