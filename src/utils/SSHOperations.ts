import { Client } from 'ssh2';
import Debug from 'debug';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const debug = Debug('app:SSHOperations');

class SSHOperations {
    private sshClient: Client;

    constructor(sshClient: Client) {
        this.sshClient = sshClient;
    }

    async executeCommand(command: string, options: { cwd?: string } = {}): Promise<{ stdout: string; stderr: string }> {
        const exec = promisify(this.sshClient.exec.bind(this.sshClient));
        try {
            const { cwd } = options;
            const fullCommand = cwd ? `cd ${cwd} && ${command}` : command;
            const stream = await exec(fullCommand);
            let stdout = '';
            let stderr = '';

            stream.on('data', (data: Buffer) => { // Specify Buffer as the type for data
                stdout += data.toString();
            });

            stream.stderr.on('data', (data: Buffer) => { // Specify Buffer as the type for data
                stderr += data.toString();
            });

            return new Promise((resolve, reject) => {
                stream.on('close', (code: number) => { // Specify number as the type for code
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Command exited with code ${code}: ${stderr}`));
                });
            });
        } catch (error) {
            debug(`Error executing command: ${command}`, error);
            throw error;
        }
    }
    
    async amendFile(remoteFilePath: string, content: string, backup: boolean = true): Promise<void> {
        const tmpFilePath = `/tmp/${path.basename(remoteFilePath)}.${Date.now()}`;
        const originalContent = await this.readFile(remoteFilePath);
        const newContent = originalContent + '\n' + content;

        if (backup) {
            await this.executeCommand(`cp ${remoteFilePath} ${tmpFilePath}`);
        }

        await this.writeFile(remoteFilePath, newContent);
    }

    async readFile(remoteFilePath: string): Promise<string> {
        const { stdout } = await this.executeCommand(`cat ${remoteFilePath}`);
        return stdout;
    }

    async writeFile(remoteFilePath: string, content: string): Promise<void> {
        const tmpFilePath = `/tmp/${path.basename(remoteFilePath)}.${Date.now()}`;
        fs.writeFileSync(tmpFilePath, content);
        await this.transferFile(tmpFilePath, remoteFilePath);
        fs.unlinkSync(tmpFilePath);
    }

    async transferFile(localPath: string, remotePath: string): Promise<void> {
        // Implement SFTP file transfer logic here
    }

    // Implement additional utility methods as needed...
}

export default SSHOperations;
