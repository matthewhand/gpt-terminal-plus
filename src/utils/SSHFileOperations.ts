import { ServerConfig } from '../types';
import * as fs from 'fs';
import SFTPClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:SSHFileOperations');

class SSHFileOperations {
    private sshClient: Client;
    private serverConfig: ServerConfig;

    constructor(sshClient: Client, serverConfig: ServerConfig) {
        this.sshClient = sshClient;
        this.serverConfig = serverConfig;
    }

    public async createFile(remotePath: string, content: Buffer, backup: boolean = false): Promise<void> {
        const sftp = await this.connectSFTP();
        if (backup) {
            const exists = await this.fileExists(remotePath, sftp);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                await sftp.rename(remotePath, backupPath);
            }
        }
        await sftp.put(content, remotePath);
        await sftp.end();
    }

    public async readFile(remotePath: string): Promise<Buffer> {
        const sftp = await this.connectSFTP();
        // const data = await sftp.get(remotePath, { encoding: null }); // Ensure Buffer is returned
        const data = await sftp.get(remotePath); // Ensure Buffer is returned
        await sftp.end();
        return data as Buffer; // Type assertion to Buffer
    }

    public async updateFile(remotePath: string, content: Buffer, backup: boolean = true): Promise<void> {
        await this.createFile(remotePath, content, backup);
    }

    public async deleteFile(remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.delete(remotePath);
        await sftp.end();
    }

    public async fileExists(remotePath: string, sftp: SFTPClient | null = null): Promise<boolean> {
        const isSftpProvided = sftp !== null;
        sftp = sftp || await this.connectSFTP();
        try {
            await sftp.stat(remotePath);
            return true;
        } catch (error) {
            return false;
        } finally {
            if (!isSftpProvided) await sftp.end();
        }
    }

    private async connectSFTP(): Promise<SFTPClient> {
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
        return sftp;
    }

    public async folderListing(remotePath: string): Promise<string[]> {
        const sftp = await this.connectSFTP();
        try {
            const fileList = await sftp.list(remotePath);
            return fileList.map(file => file.name);
        } finally {
            await sftp.end();
        }
    }

    public async countFiles(remotePath: string): Promise<number> {
        const sftp = await this.connectSFTP();
        try {
            const fileList = await sftp.list(remotePath);
            return fileList.length;
        } finally {
            await sftp.end();
        }
    }

    public async amendFile(remotePath: string, content: string, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();
        if (backup) {
            const exists = await this.fileExists(remotePath, sftp);
            if (exists) {
                const backupPath = `${remotePath}.${Date.now()}.bak`;
                await sftp.rename(remotePath, backupPath);
                debug(`Backup created: ${backupPath}`);
            }
        }

        let existingContent = "";
        try {
            // const buffer = await sftp.get(remotePath, { encoding: 'utf8' });
            const buffer = await sftp.get(remotePath);
            existingContent = buffer.toString();
        } catch (error) {
            debug(`Error retrieving existing content, assuming file might not exist: ${error}`);
        }

        const amendedContent = existingContent + content;
        await sftp.put(Buffer.from(amendedContent), remotePath);
        await sftp.end();
    }
}

export default SSHFileOperations;