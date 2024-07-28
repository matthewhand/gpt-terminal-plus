import { Client } from 'ssh2';
import { createPaginatedResponse } from '../../../utils/PaginationUtils';
import { getCurrentFolder } from '../../../utils/GlobalStateHelper';
import { PaginatedResponse } from '../../../types/index';

/**
 * Lists files in a specified directory on a remote SSH server.
 * @param sshClient - The SSH client.
 * @param directory - The directory to list files in.
 * @param limit - Maximum number of files to return.
 * @param offset - Number of files to skip before starting to collect the result set.
 * @param orderBy - Criteria to order files by.
 * @returns A paginated response containing files in the directory.
 */
export async function listFiles(sshClient: Client, directory: string = '', limit: number = 42, offset: number = 0, orderBy: 'filename' | 'datetime' = 'filename'): Promise<PaginatedResponse> {
    const targetDirectory = directory || getCurrentFolder();
    return new Promise((resolve, reject) => {
        sshClient.exec('ls -l ' + targetDirectory, (err, stream) => {
            if (err) {
                return reject(err);
            }
            let commandOutput = '';
            stream.on('data', (data: any) => {
                commandOutput += data.toString();
            }).on('close', () => {
                const files = commandOutput.split('\n').slice(1); // Skip the total line
                resolve(createPaginatedResponse(files, limit, offset));
            }).stderr.on('data', (data: any) => {
                console.error('STDERR: ' + data);
                reject(new Error(data.toString()));
            });
        });
    });
}
