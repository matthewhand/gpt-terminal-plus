import { join } from 'path';

export function getScriptPath(shellType: string): string {
  const scriptsDir = join(__dirname, '..', 'scripts');
  switch (shellType.toLowerCase()) {
    case 'powershell':
      return join(scriptsDir, 'remote_system_info.ps1');
    case 'python':
      return join(scriptsDir, 'remote_system_info.py');
    case 'bash':
    case 'sh':
      return join(scriptsDir, 'remote_system_info.sh');
    case 'typescript':
    case 'ts':
      return join(scriptsDir, 'remote_system_info.ts');
    case 'javascript':
    case 'js':
    default:
      return join(scriptsDir, 'remote_system_info.js');
  }
}
