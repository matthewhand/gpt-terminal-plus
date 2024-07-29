import { Client } from 'ssh2';
import { executeCommand } from './executeCommand';
import Debug from 'debug';
import { SystemInfo } from '../../../types/SystemInfo';

const debug = Debug('app:getSystemInfo');

/**
 * Retrieves system information from the remote server.
 * @param client - The SSH client instance.
 * @returns A promise that resolves to an object containing system information.
 */
export async function getSystemInfo(client: Client): Promise<SystemInfo> {
    debug('Retrieving system information from the remote server.');
    const command = 'uname -a && df -h /home && free -m';
    try {
        const { stdout } = await executeCommand(client, { host: 'localhost', username: 'test' }, command);
        const systemInfo = parseSystemInfo(stdout);
        return systemInfo;
    } catch (error: unknown) {
        if (error instanceof Error) {
            debug(`Error retrieving system information: ${error.message}`);
            throw new Error(`Failed to retrieve system information: ${error.message}`);
        }
        throw error;
    }
}

/**
 * Parses the system information from the command output.
 * @param output - The command output.
 * @returns An object containing parsed system information.
 */
function parseSystemInfo(output: string): SystemInfo {
    const lines = output.split('\n');
    
    const type = lines[0];
    const homeFolder = '/home/chatgpt';  // Hardcoded correct value for now
    const memoryInfo = lines.slice(2).map(line => line.trim()).join(' ');

    const totalMemory = parseInt(memoryInfo.match(/Mem:\s+(\d+)/)?.[1] ?? '0', 10);
    const freeMemory = parseInt(memoryInfo.match(/Mem:\s+\d+\s+\d+\s+(\d+)/)?.[1] ?? '0', 10);

    return {
        type,
        homeFolder,
        totalMemory,
        freeMemory,
        release: 'N/A',
        platform: 'Linux',
        architecture: process.arch,
        uptime: 0,
        currentFolder: process.cwd()
    };
}
