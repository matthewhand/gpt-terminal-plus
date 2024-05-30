import { Client } from 'ssh2';
import Debug from 'debug';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
// import { SFTPClient } from 'ssh2-sftp-client';

const debug = Debug('app:SSHOperations');

/**
 * Class for performing SSH operations.
 */
class SSHOperations {
    private sshClient: Client;

    /**
     * Constructor for SSHOperations.
     * @param {Client} sshClient - The SSH client.
     */
    constructor(sshClient: Client) {
        this.sshClient = sshClient;
    }

    /**
     * Execute a command on the remote server.
     * @param {string} command - The command to execute.
     * @param {Object} [options] - Additional options.
     * @param {string} [options.cwd] - The current working directory.
     * @returns {Promise<{ stdout: string; stderr: string }>} - The command output.
     */
    async executeCommand(command: string, options: { cwd?: string } = {}): Promise<{ stdout: string; stderr: string }> {
        const exec = promisify(this.sshClient.exec.bind(this.sshClient));
        try {
            const { cwd } = options;
            const fullCommand = cwd ? `cd ${cwd} && ${command}` : command;
            const stream = await exec(fullCommand);
            let stdout = '';
            let stderr = '';

            stream.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            stream.stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            return new Promise((resolve, reject) => {
                stream.on('close', (code: number) => {
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Command exited with code ${code}: ${stderr}`));
                });
            });
        } catch (error) {
            debug(`Error executing command: ${command}`, error);
            throw error;
        }
    }

    // /**
    //  * Append content to a file on the remote server.
    //  * @param {string} remoteFilePath - The remote file path.
    //  * @param {string} content - The content to append.
    //  * @param {boolean} [backup=true] - Whether to create a backup of the file.
    //  * @returns {Promise<void>}
    //  */
    // async amendFile(remoteFilePath: string, content: string, backup: boolean = true): Promise<void> {
    //     const tmpFilePath = `/tmp/${path.basename(remoteFilePath)}.${Date.now()}`;
    //     const originalContent = await this.readFile(remoteFilePath);
    //     const newContent = originalContent + '\n' + content;

    //     if (backup) {
    //         await this.executeCommand(`cp ${remoteFilePath} ${tmpFilePath}`);
    //     }

    //     await this.writeFile(remoteFilePath, newContent);
    // }

    // /**
    //  * Read a file from the remote server.
    //  * @param {string} remoteFilePath - The remote file path.
    //  * @returns {Promise<string>} - The file content.
    //  */
    // async readFile(remoteFilePath: string): Promise<string> {
    //     const { stdout } = await this.executeCommand(`cat ${remoteFilePath}`);
    //     return stdout;
    // }

    // /**
    //  * Write content to a file on the remote server.
    //  * @param {string} remoteFilePath - The remote file path.
    //  * @param {string} content - The content to write.
    //  * @returns {Promise<void>}
    //  */
    // async writeFile(remoteFilePath: string, content: string): Promise<void> {
    //     const tmpFilePath = `/tmp/${path.basename(remoteFilePath)}.${Date.now()}`;
    //     fs.writeFileSync(tmpFilePath, content);
    //     await this.transferFile(tmpFilePath, remoteFilePath);
    //     fs.unlinkSync(tmpFilePath);
    // }

}

export default SSHOperations;
