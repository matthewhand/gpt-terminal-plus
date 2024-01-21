import * as os from 'os';

export function getSystemInfo(): string {
  const uptimeSeconds = os.uptime();
  const homeFolder = os.homedir();
  const type = os.type();
  const release = os.release();
  const platform = os.platform();
  const architecture = os.arch();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const currentFolder = process.cwd();

  const systemInfo = {
    homeFolder,
    type,
    release,
    platform,
    architecture,
    totalMemory,
    freeMemory,
    uptime: uptimeSeconds,
    currentFolder
  };

  return JSON.stringify(systemInfo);
}
