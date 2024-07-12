import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import SFTPClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig } from '../types/index';

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

    constructor(sshClient: Client, config: ServerConfig) {
        this.sshClient = sshClient;
        this.config = config;
    }

    public async connectSFTP(): Promise<SFTPClient> {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.config.host,
            port: this.config.port ?? 22,
            username: this.config.username ?? '',
            privateKey: await this.getPrivateKey(),
        });
        return sftp;
    }

    private async getPrivateKey(): Promise<Buffer> {
        const privateKeyPath = this.config.privateKeyPath ?? path.join(os.homedir(), '.ssh', 'id_rsa');
        try {
            return await fs.readFile(privateKeyPath);
        } catch (error) {
            debug(`Failed to read private key from ${privateKeyPath}: ${error}`);
            throw new Error(`Failed to read private key: ${error}`);
        }
    }

    public async createFile(remotePath: string, content: Buffer, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();
        if (backup) {
            const exists = await this.fileExists(remotePath);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                await sftp.rename(remotePath, backupPath);
            }
        }
        await sftp.put(content, remotePath);
        await sftp.end();
    }

    // public async readFile(remotePath: string): Promise<Buffer> {
    //     const sftp = await this.connectSFTP();
    //     try {
    //         // Specify encoding as null to ensure a Buffer is returned
    //         const data: Buffer = await sftp.get(remotePath, { encoding: null });
    //         return data;
    //     } finally {
    //         await sftp.end();
    //     }
    // }
    
    public async deleteFile(remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.delete(remotePath);
        await sftp.end();
    }

    public async fileExists(remotePath: string): Promise<boolean> {
        const sftp = await this.connectSFTP();
        try {
            await sftp.stat(remotePath);
            return true;
        } catch {
            return false;
        } finally {
            await sftp.end();
        }
    }
    
    async uploadFile(localPath: string, remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.put(localPath, remotePath);
        await sftp.end();
    }
    
    async downloadFile(remotePath: string, localPath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.get(remotePath, localPath);
        await sftp.end();
    }  

    // /**
    //  * Appends content to a file on the remote server, optionally creating a backup of the original file.
    //  * @param {string} remotePath - The path to the file on the remote server.
    //  * @param {Buffer} content - The content to append to the file.
    //  * @param {boolean} backup - Whether to create a backup of the existing file before appending.
    //  * @returns {Promise<void>} A promise that resolves when the operation is complete.
    //  */
    // public async amendFile(remotePath: string, content: Buffer | string, backup: boolean = true): Promise<void> {
    //     const sftp = await this.connectSFTP();
    //     if (backup && await this.fileExists(remotePath)) {
    //         const backupPath = `${remotePath}.${Date.now()}.bak`;
    //         await sftp.rename(remotePath, backupPath);
    //     }
    //     let existingContent = "";
    //     try {
    //         const buffer = await sftp.get(remotePath);

    //         existingContent = buffer.toString('utf8');
    //     } catch (error) {
    //         debug(`File ${remotePath} not found, creating new one.`);
    //     }
    //     const amendedContent = Buffer.from(existingContent + (Buffer.isBuffer(content) ? content.toString('utf8') : content));
    //     await sftp.put(amendedContent, remotePath);
    //     await sftp.end();
    // }
    
    public async listFiles(directoryPath: string): Promise<string[]> {
        const sftp = await this.connectSFTP();
        const fileList = await sftp.list(directoryPath);
        await sftp.end();
        return fileList.map(file => file.name);
    }
    
    public async updateFile(remotePath: string, content: Buffer | string, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();
    
        // Check if a backup is needed and perform it
        if (backup) {
            const exists = await this.fileExists(remotePath);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                await sftp.rename(remotePath, backupPath);
            }
        }
    
        // Ensure content is a Buffer before sending
        const bufferContent = Buffer.isBuffer(content) ? content : Buffer.from(content);
        await sftp.put(bufferContent, remotePath);
        await sftp.end();
    }

    /**
     * Read a file from the remote server.
     * @param {string} remotePath - The remote path of the file.
     * @returns {Promise<Buffer>}
     */
    public async readFile(remotePath: string): Promise<Buffer> {
        const sftp = await this.connectSFTP();
        try {
            const data = await sftp.get(remotePath);
            return data as Buffer; // Ensure Buffer is returned
        } finally {
            await sftp.end();
        }
    }

        /**
     * Lists files in a remote directory.
     * @param {string} remotePath - The remote directory path.
     * @returns {Promise<string[]>} - The list of file names.
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
     * @returns {Promise<number>} - The number of files.
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