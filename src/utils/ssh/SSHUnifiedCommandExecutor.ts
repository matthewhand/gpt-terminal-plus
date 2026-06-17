import { Client } from 'ssh2';
import SFTPClient from 'ssh2-sftp-client';

class SSHUnifiedCommandExecutor {
    private sshClient: Client;
    private sftpClient: SFTPClient;
    private readonly config: any;

    constructor(config: any) {
        this.config = config;
        this.sshClient = new Client();
        this.sftpClient = new SFTPClient();
        this.sshClient.on('ready', () => {
            console.log('SSH Client is ready');
        }).connect(config);
    }

    public async executeCommand(command: string, options: { cwd?: string } = {}): Promise<{ stdout: string; stderr: string }> {
        const fullCommand = options.cwd ? `cd ${options.cwd} && ${command}` : command;

        return new Promise((resolve, reject) => {
            this.sshClient.exec(fullCommand, (err, stream) => {
                if (err) return reject(err);

                let stdout = '';
                let stderr = '';

                stream.on('data', (data: Buffer) => {
                    stdout += data.toString();
                });

                stream.stderr.on('data', (data: Buffer) => {
                    stderr += data.toString();
                });

                stream.on('close', (code: number) => {
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Command exited with code ${code}: ${stderr}`));
                });
            });
        });
    }

    public async transferFile(localPath: string, remotePath: string): Promise<void> {
        await this.sftpClient.connect(this.config);
        await this.sftpClient.put(localPath, remotePath);
        await this.sftpClient.end();
    }

    // Additional methods for file operations, system info retrieval, etc., can be added here.
}

export default SSHUnifiedCommandExecutor;

