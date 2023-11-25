// utils/remoteSystemInfo.ts
import { readFileSync } from 'fs';
import { join } from 'path';

export function getRemoteSystemInfoScript(): string {
  const scriptPath = join(__dirname, '..', 'scripts', 'remote_system_info.py');
  return readFileSync(scriptPath, 'utf8');
}
