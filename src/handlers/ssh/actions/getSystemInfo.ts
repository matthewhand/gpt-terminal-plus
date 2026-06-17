import { Client } from 'ssh2';
import { SystemInfo } from '../../../types/SystemInfo';
import Debug from 'debug';
import { escapeSpecialChars } from '../../../common/escapeSpecialChars';

const debug = Debug('app:getSystemInfo');

/**
 * Retrieves system information from the remote server using the specified shell and script.
 * @param {Client} client - The SSH client instance.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @param {string} scriptPath - The path to the script.
 * @returns {Promise<SystemInfo>} - The system information.
 */
export async function getSystemInfo(client: Client, shell: string, scriptPath: string): Promise<SystemInfo> {
    // Validate inputs
    if (!client || !(client instanceof Client)) {
        const errorMessage = 'SSH client must be provided and must be an instance of Client.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (!shell || typeof shell !== 'string') {
        const errorMessage = 'Shell must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }
    if (!scriptPath || typeof scriptPath !== 'string') {
        const errorMessage = 'Script path must be provided and must be a string.';
        debug(errorMessage);
        throw new Error(errorMessage);
    }

    const escapedShell = escapeSpecialChars(shell);
    const escapedScriptPath = escapeSpecialChars(scriptPath);

    debug('Executing command: ' + escapedShell + ' ' + escapedScriptPath);

    return new Promise((resolve, reject) => {
        client.exec(escapedShell + ' ' + escapedScriptPath, (err, stream) => {
            if (err) {
                debug('Execution error: ' + err.message);
                return reject(new Error('Execution error: ' + err.message));
            }

            let stdout = '';
            let stderr = '';

            stream.on('close', (code: number, signal: string) => {
                debug('Command completed with code:', code, 'stdout:', stdout, 'stderr:', stderr);
                if (code !== 0) {
                    debug('Command failed with code ' + code + ', signal ' + signal + ', stderr: ' + stderr);
                    reject(new Error('Command failed with code ' + code + ', signal ' + signal + ', stderr: ' + stderr));
                } else {
                    try {
                        if (stdout.trim() === '') {
                            throw new Error('Empty stdout');
                        }
                        const systemInfo = JSON.parse(stdout) as SystemInfo;
                        debug('Retrieved system information: ' + JSON.stringify(systemInfo));
                        resolve(systemInfo);
                    } catch (error) {
                        debug('Failed to parse JSON: ' + (error as Error).message);
                        reject(new Error('Failed to parse JSON: ' + (error as Error).message));
                    }
                }
            }).on('data', (data: Buffer) => {
                stdout += data.toString();
            }).stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });
        });
    });
}
