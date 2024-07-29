import { Client } from 'ssh2';
import { SystemInfo } from '../../../types/SystemInfo';
import { execCommand } from './execCommand';

/**
 * Retrieves system information from the remote server using the provided SSH client.
 * @param client - The SSH client instance.
 * @returns A promise that resolves to the system information.
 */
export async function getSystemInfo(client: Client): Promise<SystemInfo> {
  const command = 'uname -a && df -h && free -m';
  const { stdout } = await execCommand(client, command);

  const lines = stdout.split('\n');
  const systemInfo = {
    homeFolder: process.env.HOME || '/',
    type: lines[0] || 'Unknown',
    release: 'N/A',
    platform: lines[0]?.split(' ')[0] || 'N/A',
    architecture: process.arch,
    totalMemory: parseInt(lines[2]?.split(' ')[1], 10) || 0,
    freeMemory: parseInt(lines[2]?.split(' ')[3], 10) || 0,
    uptime: process.uptime(),
    currentFolder: process.cwd(),
  };

  return systemInfo;
}
