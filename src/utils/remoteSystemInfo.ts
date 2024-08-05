// utils/remoteSystemInfo.ts
import { readFileSync } from 'fs';
import { join } from 'path';

export function getRemoteSystemInfoScript(): string {
  const scriptPath = join(__dirname, '..', 'scripts', 'remote_system_info.py');
const scriptPathTs = join(__dirname, '..', 'scripts', 'remote_system_info.ts');  const scriptPathJs = join(__dirname, '..', 'scripts', 'remote_system_info.js');
  return readFileSync(scriptPath, 'utf8');
}
