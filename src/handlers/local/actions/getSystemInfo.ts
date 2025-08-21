import os from 'os';
import Debug from 'debug';
import { SystemInfo } from '../../../types/SystemInfo';

const debug = Debug('app:local:getSystemInfo');

/**
 * Retrieve hardened system information for the local server.
 */
export async function getSystemInfo(): Promise<SystemInfo> {
  try {
    const info: SystemInfo = {
      type: 'LocalServer',
      platform: os.platform(),
      architecture: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      currentFolder: process.cwd(),
    };

    debug(`✅ getSystemInfo succeeded: platform=${info.platform}, arch=${info.architecture}, cwd=${info.currentFolder}`);
    return info;
  } catch (err: any) {
    debug(`❌ getSystemInfo failed: ${err.message}`);
    throw err;
  }
}

export default getSystemInfo;
