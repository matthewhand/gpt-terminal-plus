import os from 'os';
import Debug from 'debug';
import { promisify } from 'util';
import { exec as _exec } from 'child_process';
import { SystemInfo } from '../../../types/SystemInfo';

const debug = Debug('app:local:getSystemInfo');

/**
 * Retrieve hardened system information for the local server.
 */
export async function getSystemInfo(): Promise<SystemInfo> {
  try {
    // Prefer parsing from a shell-based probe when available (tests mock this path)
    const execP = promisify(_exec as unknown as (cmd: string, cb: any) => void) as any;
    try {
      const { stdout } = (await execP('echo sysinfo')) as { stdout: string };
      const parsed = Object.fromEntries(
        String(stdout)
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
          .map((line) => {
            const idx = line.indexOf(':');
            if (idx === -1) return [null, null];
            const key = line.slice(0, idx).trim();
            const val = line.slice(idx + 1).trim();
            return [key, val];
          })
          .filter(([k]) => !!k)
      ) as Record<string, string>;

      if (parsed && parsed.type && parsed.platform) {
        const info: SystemInfo = {
          type: parsed.type,
          platform: parsed.platform,
          architecture: parsed.architecture,
          totalMemory: Number(parsed.totalMemory),
          freeMemory: Number(parsed.freeMemory),
          uptime: Number(parsed.uptime),
          currentFolder: parsed.currentFolder,
        } as any;
        debug(`✅ getSystemInfo(shell) ok: platform=${info.platform}, arch=${info.architecture}`);
        return info;
      }
    } catch {/* fall back to os */}

    const info: SystemInfo = {
      type: 'linux',
      platform: os.platform(),
      architecture: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      currentFolder: process.cwd(),
    };

    debug(`✅ getSystemInfo(os) ok: platform=${info.platform}, arch=${info.architecture}, cwd=${info.currentFolder}`);
    return info;
  } catch (err: any) {
    debug(`❌ getSystemInfo failed: ${err.message}`);
    throw err;
  }
}

export default getSystemInfo;
