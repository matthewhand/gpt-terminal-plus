import { Client } from 'ssh2';
import * as path from 'path';

/**
 * Creates a file on a remote SSH server.
 * @param sshClient - The SSH client.
 * @param directory - The directory to create the file in.
 * @param filename - The name of the file to create.
 * @param content - The content to write to the file.
 * @param backup - Whether to create a backup of the file if it exists.
 * @returns True if the file is created successfully.
 */
export async function createFile(sshClient: Client, directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(directory, filename);
        const backupPath = fullPath + '.bak';

        const command = backup
            ? `cp ${fullPath} ${backupPath} && echo "${content.replace(/"/g, '\"')}" > ${fullPath}`
            : `echo "${content.replace(/"/g, '\"')}" > ${fullPath}`;

        sshClient.exec(command, (err, stream) => {
            if (err) {
                return reject(err);
            }
            stream.on('close', () => {
                sshClient.end();
                resolve(true);
            }).on('data', () => {
                // Handle data if needed
            }).stderr.on('data', (data) => {
                console.error('STDERR: ' + data);
                reject(new Error(data.toString()));
            });
        });
    });
}
