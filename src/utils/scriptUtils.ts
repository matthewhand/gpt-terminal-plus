import path from 'path';

/**
 * Retrieves the script path based on the shell type.
 * @param {string} shell - The shell type (bash, python, powershell).
 * @returns {string} - The path to the corresponding script file.
 */
export function getScriptPath(shell: string): string {
  switch (shell) {
    case 'powershell':
      return path.join(__dirname, '../../scripts/remote_system_info.ps1');
    case 'python':
      return path.join(__dirname, '../../scripts/remote_system_info.py');
    case 'bash':
    default:
      return path.join(__dirname, '../../scripts/remote_system_info.sh');
  }
}
