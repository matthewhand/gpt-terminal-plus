import { ServerConfig } from '../types';
import * as fs from 'fs';
import SFTPClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:SSHFileOperations');

/**
 * Class for performing file operations via SSH.
 */
class SSHFileOperations {
    private sshClient: Client;
    private serverConfig: ServerConfig;

    /**
     * Constructor for SSHFileOperations.
     * @param {Client} sshClient - The SSH client.
     * @param {ServerConfig} serverConfig - The server configuration.
     */
    constructor(sshClient: Client, serverConfig: ServerConfig) {
        this.sshClient = sshClient;
        this.serverConfig = serverConfig;
    }

    /**
     * Creates a file on the remote server.
     * @param {string} remotePath - The remote path where the file will be created.
     * @param {Buffer} content - The content to be written to the file.
     * @param {boolean} [backup=false] - Whether to create a backup if the file already exists.
     * @returns {Promise<void>}
     */
    public async createFile(remotePath: string, content: Buffer, backup: boolean = false): Promise<void> {
        const sftp = await this.connectSFTP();
        try {
            debug(`Creating file at ${remotePath} with backup=${backup}`);
            if (backup) {
                await this.backupFile(remotePath, sftp);
            }
            await sftp.put(content, remotePath);
            debug(`File created at ${remotePath}`);
        } catch (error) {
            debug(`Error creating file at ${remotePath}: ${error}`);
            throw new Error(`Failed to create file at ${remotePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await sftp.end();
        }
    }

    /**
     * Reads a file from the remote server.
     * @param {string} remotePath - The remote path of the file to be read.
     * @returns {Promise<Buffer>} - The content of the file.
     */
    public async readFile(remotePath: string): Promise<Buffer> {
        const sftp = await this.connectSFTP();
        try {
            debug(`Reading file at ${remotePath}`);
            const data = await sftp.get(remotePath);
            debug(`Read file at ${remotePath}`);
            return data as Buffer; // Ensure Buffer is returned
        } catch (error) {
            debug(`Error reading file at ${remotePath}: ${error}`);
            throw new Error(`Failed to read file at ${remotePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await sftp.end();
        }
    }

    /**
     * Updates a file on the remote server.
     * @param {string} remotePath - The remote path of the file to be updated.
     * @param {Buffer} content - The new content to be written to the file.
     * @param {boolean} [backup=true] - Whether to create a backup of the existing file.
     * @returns {Promise<void>}
     */
    public async updateFile(remotePath: string, content: Buffer, backup: boolean = true): Promise<void> {
        debug(`Updating file at ${remotePath} with backup=${backup}`);
        await this.createFile(remotePath, content, backup);
    }

    /**
     * Deletes a file from the remote server.
     * @param {string} remotePath - The remote path of the file to be deleted.
     * @returns {Promise<void>}
     */
    public async deleteFile(remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        try {
            debug(`Deleting file at ${remotePath}`);
            await sftp.delete(remotePath);
            debug(`Deleted file at ${remotePath}`);
        } catch (error) {
            debug(`Error deleting file at ${remotePath}: ${error}`);
            throw new Error(`Failed to delete file at ${remotePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await sftp.end();
        }
    }

    /**
     * Checks if a file exists on the remote server.
     * @param {string} remotePath - The remote path of the file.
     * @param {SFTPClient} [sftp=null] - Optional SFTP client instance.
     * @returns {Promise<boolean>} - Whether the file exists.
     */
    public async fileExists(remotePath: string, sftp: SFTPClient | null = null): Promise<boolean> {
        const isSftpProvided = sftp !== null;
        sftp = sftp || await this.connectSFTP();
        try {
            debug(`Checking if file exists at ${remotePath}`);
            await sftp.stat(remotePath);
            debug(`File exists at ${remotePath}`);
            return true;
        } catch (error) {
            debug(`File does not exist at ${remotePath}: ${error}`);
            return false;
        } finally {
            if (!isSftpProvided) await sftp.end();
        }
    }

    /**
     * Lists files in a remote directory.
     * @param {string} remotePath - The remote directory path.
     * @returns {Promise<string[]>} - The list of file names.
     */
    public async folderListing(remotePath: string): Promise<string[]> {
        const sftp = await this.connectSFTP();
        try {
            debug(`Listing files in directory ${remotePath}`);
            const fileList = await sftp.list(remotePath);
            debug(`Listed files in directory ${remotePath}`);
            return fileList.map(file => file.name);
        } catch (error) {
            debug(`Error listing files in directory ${remotePath}: ${error}`);
            throw new Error(`Failed to list files in directory ${remotePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await sftp.end();
        }
    }

    /**
     * Counts the number of files in a remote directory.
     * @param {string} remotePath - The remote directory path.
     * @returns {Promise<number>} - The number of files.
     */
    public async countFiles(remotePath: string): Promise<number> {
        const sftp = await this.connectSFTP();
        try {
            debug(`Counting files in directory ${remotePath}`);
            const fileList = await sftp.list(remotePath);
            debug(`Counted files in directory ${remotePath}`);
            return fileList.length;
        } catch (error) {
            debug(`Error counting files in directory ${remotePath}: ${error}`);
            throw new Error(`Failed to count files in directory ${remotePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await sftp.end();
        }
    }

    /**
     * Amends a file on the remote server by appending content to it.
     * @param {string} remotePath - The remote path of the file.
     * @param {string} content - The content to append.
     * @param {boolean} [backup=true] - Whether to create a backup of the existing file.
     * @returns {Promise<void>}
     */
    public async amendFile(remotePath: string, content: string, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();
        try {
            debug(`Amending file at ${remotePath} with backup=${backup}`);
            if (backup) {
                await this.backupFile(remotePath, sftp);
            }

            let existingContent = "";
            try {
                const buffer = await sftp.get(remotePath);
                existingContent = buffer.toString();
                debug(`Retrieved existing content from ${remotePath}`);
            } catch (error) {
                debug(`Error retrieving existing content for ${remotePath}: ${error}`);
            }

            const amendedContent = existingContent + content;
            await sftp.put(Buffer.from(amendedContent), remotePath);
            debug(`Amended file at ${remotePath}`);
        } catch (error) {
            debug(`Error amending file at ${remotePath}: ${error}`);
            throw new Error(`Failed to amend file at ${remotePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await sftp.end();
        }
    }

    /**
     * Connects to the SFTP server.
     * @returns {Promise<SFTPClient>} - The connected SFTP client.
     */
    private async connectSFTP(): Promise<SFTPClient> {
        if (!this.serverConfig.privateKeyPath) {
            throw new Error('Private key path is not defined in server configuration.');
        }
        const privateKey = fs.readFileSync(this.serverConfig.privateKeyPath);
        const sftp = new SFTPClient();
        try {
            debug(`Connecting to SFTP server at ${this.serverConfig.host}:${this.serverConfig.port}`);
            await sftp.connect({
                host: this.serverConfig.host,
                port: this.serverConfig.port || 22,
                username: this.serverConfig.username,
                privateKey: privateKey,
            });
            debug(`Connected to SFTP server at ${this.serverConfig.host}:${this.serverConfig.port}`);
            return sftp;
        } catch (error) {
            debug(`Error connecting to SFTP server: ${error}`);
            throw new Error(`Failed to connect to SFTP server: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Backs up a file on the remote server.
     * @param {string} remotePath - The remote path of the file.
     * @param {SFTPClient} sftp - The SFTP client instance.
     * @returns {Promise<void>}
     */
    private async backupFile(remotePath: string, sftp: SFTPClient): Promise<void> {
        try {
            debug(`Backing up file at ${remotePath}`);
            const exists = await this.fileExists(remotePath, sftp);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                await sftp.rename(remotePath, backupPath);
                debug(`Backup created at ${backupPath}`);
            } else {
                debug(`File at ${remotePath} does not exist, no backup created`);
            }
        } catch (error) {
            debug(`Backup failed for ${remotePath}: ${error}`);
        }
    }
}

export default SSHFileOperations;
