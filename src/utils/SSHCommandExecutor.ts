import { Client } from 'ssh2';
import SFTPClient from 'ssh2-sftp-client';
import Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const debug = Debug('app:SSHCommandExecutor');

class SSHCommandExecutor {
    private sshClient: Client;

    constructor(sshClient: Client) {
        this.sshClient = sshClient;
    }

    public async executeCommand(command: string, options: { cwd?: string } = {}): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            this.sshClient.exec(options.cwd ? `cd ${options.cwd} && ${command}` : command, (err, stream) => {
                if (err) return reject(err);

                let stdout = '';
                let stderr = '';
                stream.on('data', (data) => { stdout += data.toString(); });
                stream.stderr.on('data', (data) => { stderr += data.toString(); });

                stream.on('close', (code, signal) => {
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Command execution failed with code ${code} and signal ${signal}`));
                });
            });
        });
    }

    public async transferFile(localPath: string, remotePath: string): Promise<void> {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.sshClient.config.host,
            port: this.sshClient.config.port || 22,
            username: this.sshClient.config.username,
            privateKey: this.sshClient.config.privateKey,
        });

        await sftp.put(localPath, remotePath);
        await sftp.end();
    }

    public async amendFile(remotePath: string, content: string, backup: boolean = true): Promise<void> {
        // Example logic to amend a file; adjust as needed
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.sshClient.config.host,
            port: this.sshClient.config.port || 22,
            username: this.sshClient.config.username,
            privateKey: this.sshClient.config.privateKey,
        });

        if (backup) {
            const backupPath = `${remotePath}.${uuidv4()}.bak`;
            await sftp.rename(remotePath, backupPath);
            debug(`Backup created: ${backupPath}`);
        }

        let existingContent = "";
        try {
            const buffer = await sftp.get(remotePath);
            existingContent = buffer.toString('utf8');
        } catch (error) {
            debug(`Error retrieving existing content: ${error}`);
            // Assuming file might not exist, hence ignoring error
        }

        const amendedContent = existingContent + content;
        await sftp.put(Buffer.from(amendedContent), remotePath);

        await sftp.end();
    }
}

export default SSHCommandExecutor;
