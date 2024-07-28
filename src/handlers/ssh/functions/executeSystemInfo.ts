import { Client } from 'ssh2';

/**
 * Executes a system info command on a remote SSH server.
 * @param sshClient - The SSH client.
 * @param command - The command to execute.
 * @returns The system info as a string.
 */
export async function executeSystemInfo(sshClient: Client, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let commandOutput = '';
        sshClient.exec(command, (err, stream) => {
            if (err) {
                return reject(err);
            }
            stream.on('data', (data: any) => {
                commandOutput += data.toString();
            }).on('close', () => {
                sshClient.end();
                resolve(commandOutput);
            }).stderr.on('data', (data: any) => {
                console.error('STDERR: ' + data);
                reject(new Error(data.toString()));
            });
        });
    });
}
