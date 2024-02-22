import * as path from 'path';
import SFTPClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';
import Debug from 'debug';

const debug = Debug('app:SSHFileOperations');

class SSHFileOperations {
    private sshClient: Client;

    constructor(sshClient: Client) {
        this.sshClient = sshClient;
    }

    // Enhanced to optionally backup existing files before overwrite
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
        const data = await sftp.get(remotePath);
        await sftp.end();
        return data;
    }

    // Adjusted to directly call createFile for updates, leveraging backup option
    public async updateFile(remotePath: string, content: Buffer, backup: boolean = true): Promise<void> {
        await this.createFile(remotePath, content, backup);
    }

    public async deleteFile(remotePath: string): Promise<void> {
        const sftp = await this.connectSFTP();
        await sftp.delete(remotePath);
        await sftp.end();
    }

    // New method to check file existence
    public async fileExists(remotePath: string, sftp: SFTPClient = null): Promise<boolean> {
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

    // Utility method for connecting to SFTP
    private async connectSFTP(): Promise<SFTPClient> {
        const sftp = new SFTPClient();
        await sftp.connect(this.getConnectionConfig());
        return sftp;
    }

    private getConnectionConfig() {
        return {
            host: this.sshClient.config.host,
            port: this.sshClient.config.port || 22,
            username: this.sshClient.config.username,
            privateKey: this.sshClient.config.privateKey
        };
    }
}

export default SSHFileOperations;
