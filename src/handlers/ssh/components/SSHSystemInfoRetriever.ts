import { exec } from 'child_process';
import util from 'util';
import { SSHConnectionConfig } from '@types';
import { SystemInfo } from '@types';
import { parseUptime } from '@utils/uptimeUtils';
import { parseDiskUsage } from '@utils/diskUtils';
import { parseMemoryUsage } from '@utils/memoryUtils';
import { parseCPUUsage } from '@utils/cpuUtils';

const execPromise = util.promisify(exec);

/**
 * Retrieves system information from a remote SSH server.
 * @param {SSHConnectionConfig} config - The SSH connection configuration.
 * @returns {Promise<SystemInfo>} - A promise that resolves to the system information.
 */
export const getSystemInfo = async (config: SSHConnectionConfig): Promise<SystemInfo> => {
  try {
    const [uptime, diskUsage, memoryUsage, cpuUsage] = await Promise.all([
      execPromise('uptime'),
      execPromise('df -h'),
      execPromise('free -m'),
      execPromise('mpstat')
    ]);

    return {
      uptime: parseUptime(uptime.stdout),
      diskUsage: parseDiskUsage(diskUsage.stdout),
      memoryUsage: parseMemoryUsage(memoryUsage.stdout),
      cpuUsage: parseCPUUsage(cpuUsage.stdout)
    };
  } catch (error) {
    throw new Error(`Failed to retrieve system info: ${error.message}`);
  }
};
