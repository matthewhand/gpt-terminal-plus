import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import SFTPClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig } from '../../../types/ServerConfig';

const debug = Debug('app:SSHFileOperations');

/**
 * The SSHFileOperations class encapsulates file operations over SSH using the SFTP protocol.
 * It provides methods to create, read, update, delete, and check for the existence of files,
 * as well as listing directory contents on a remote server, ensuring operations are performed
 * securely and efficiently.
 */
class SSHFileOperations {
    private sshClient: Client;
    private config: ServerConfig;

    /**
     * Constructor for SSHFileOperations class.
     * @param {Client} sshClient - SSH Client instance.
     * @param {ServerConfig} config - Configuration for SSH server.
     */
    constructor(sshClient: Client, config: ServerConfig) {
        this.sshClient = sshClient;
        this.config = config;
        debug(`SSHFileOperations created for ${config.username}@${config.host}`);
    }

    /**
     * Connects to the SFTP server.
     * @returns {Promise<SFTPClient>} A promise that resolves to an SFTPClient instance.
     */
    public async connectSFTP(): Promise<SFTPClient> {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.config.host,
            port: this.config.port ?? 22,
            username: this.config.username ?? '',
            privateKey: await this.getPrivateKey(),
        });
        debug('Connected to SFTP server');
        return sftp;
    }

    /**
     * Retrieves the private key for SSH authentication.
     * @returns {Promise<Buffer>} A promise that resolves to the private key.
     */
    private async getPrivateKey(): Promise<Buffer> {
        const privateKeyPath = this.config.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
        try {
            debug(`Reading private key from ${privateKeyPath}`);
            return await fs.readFile(privateKeyPath);
        } catch (error) {
            debug(`Failed to read private key from ${privateKeyPath}: ${error}`);
            throw new Error(`Failed to read private key: ${error}`);
        }
    }

    /**
     * Creates a file on the remote server.
     * @param {string} remotePath - The path of the file to create.
     * @param {Buffer} content - The content to write to the file.
     * @param {boolean} [backup=true] - Whether to create a backup if the file exists.
     * @returns {Promise<void>}
     */
    public async createFile(remotePath: string, content: Buffer, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();
        if (backup) {
            const exists = await this.fileExists(remotePath);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                debug(`Creating backup of existing file: ${remotePath} -> ${backupPath}`);
                await sftp.rename(remotePath, backupPath);
            }
        }
        await sftp.put(content, remotePath);
        debug(`File created at ${remotePath}`);
        await sftp.end();
    }

    /**
     * Deletes a file on the remote server.
     * @param {string} remotePath - The path of the file to delete.
     * @returns {Promise<void>}
     */
    public async deleteFile(remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.delete(remotePath);
        debug(`File deleted at ${remotePath}`);
        await sftp.end();
    }

    /**
     * Checks if a file exists on the remote server.
     * @param {string} remotePath - The path of the file to check.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the file exists.
     */
    public async fileExists(remotePath: string): Promise<boolean> {
        const sftp = await this.connectSFTP();
        try {
            await sftp.stat(remotePath);
            debug(`File exists at ${remotePath}`);
            return true;
        } catch {
            debug(`File does not exist at ${remotePath}`);
            return false;
        } finally {
            await sftp.end();
        }
    }

    /**
     * Uploads a file to the remote server.
     * @param {string} localPath - The local path of the file to upload.
     * @param {string} remotePath - The remote path where the file will be uploaded.
     * @returns {Promise<void>}
     */
    public async uploadFile(localPath: string, remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.put(localPath, remotePath);
        debug(`File uploaded from ${localPath} to ${remotePath}`);
        await sftp.end();
    }

    /**
     * Downloads a file from the remote server.
     * @param {string} remotePath - The remote path of the file to download.
     * @param {string} localPath - The local path where the file will be saved.
     * @returns {Promise<void>}
     */
    public async downloadFile(remotePath: string, localPath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.get(remotePath, localPath);
        debug(`File downloaded from ${remotePath} to ${localPath}`);
        await sftp.end();
    }

    /**
     * Lists files in a remote directory.
     * @param {string} directoryPath - The remote directory path.
     * @returns {Promise<string[]>} A promise that resolves to an array of file names.
     */
    public async listFiles(directoryPath: string): Promise<string[]> {
        const sftp = await this.connectSFTP();
        const fileList = await sftp.list(directoryPath);
        await sftp.end();
        debug(`Files listed in directory ${directoryPath}`);
        return fileList.map(file => file.name);
    }

    /**
     * Updates a file on the remote server.
     * @param {string} remotePath - The path of the file to update.
     * @param {Buffer | string} content - The content to write to the file.
     * @param {boolean} [backup=true] - Whether to create a backup if the file exists.
     * @returns {Promise<void>}
     */
    public async updateFile(remotePath: string, content: Buffer | string, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();

        // Check if a backup is needed and perform it
        if (backup) {
            const exists = await this.fileExists(remotePath);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                debug(`Creating backup of existing file: ${remotePath} -> ${backupPath}`);
                await sftp.rename(remotePath, backupPath);
            }
        }

        // Ensure content is a Buffer before sending
        const bufferContent = Buffer.isBuffer(content) ? content : Buffer.from(content);
        await sftp.put(bufferContent, remotePath);
        debug(`File updated at ${remotePath}`);
        await sftp.end();
    }

    /**
     * Read a file from the remote server.
     * @param {string} remotePath - The remote path of the file.
     * @returns {Promise<Buffer>} A promise that resolves to the file content as a Buffer.
     */
    public async readFile(remotePath: string): Promise<Buffer> {
        const sftp = await this.connectSFTP();
        try {
            const data = await sftp.get(remotePath);
            debug(`File read from ${remotePath}`);
            return data as Buffer; // Ensure Buffer is returned
        } finally {
            await sftp.end();
        }
    }

    /**
     * Lists files in a remote directory.
     * @param {string} remotePath - The remote directory path.
     * @returns {Promise<string[]>} A promise that resolves to an array of file names.
     * @throws {Error} - If listing files fails.
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
     * @returns {Promise<number>} A promise that resolves to the number of files.
     * @throws {Error} - If counting files fails.
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
}

export default SSHFileOperations;
