import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import SFTPClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig } from '../types';

const debug = Debug('app:SSHFileOperations');

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

    public async readFile(remotePath: string): Promise<Buffer> {
        const sftp = await this.connectSFTP();
        try {
          // Attempt to fetch the data directly, assuming it will be a Buffer
          const data = await sftp.get(remotePath) as Buffer; // Type assertion
          return data;
        } finally {
          await sftp.end();
        }
      } 
      
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

    public async amendFile(remotePath: string, content: Buffer, backup: boolean = true): Promise<void> {
        const sftp = await this.connectSFTP();
        if (backup && await this.fileExists(remotePath)) {
            const backupPath = `${remotePath}.${Date.now()}.bak`;
            await sftp.rename(remotePath, backupPath);
        }
        let existingContent = "";
        try {
            const buffer = await sftp.get(remotePath);
            existingContent = buffer.toString('utf8');
        } catch (error) {
            debug(`File ${remotePath} not found, creating new one.`);
        }
        const amendedContent = Buffer.from(existingContent + content.toString('utf8'));
        await sftp.put(amendedContent, remotePath);
        await sftp.end();
    }

    public async listFiles(directoryPath: string): Promise<string[]> {
        const sftp = await this.connectSFTP();
        const fileList = await sftp.list(directoryPath);
        await sftp.end();
        return fileList.map(file => file.name);
    }
}

export default SSHFileOperations;
