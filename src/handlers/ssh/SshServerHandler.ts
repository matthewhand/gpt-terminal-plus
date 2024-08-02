import { AbstractServerHandler } from '../AbstractServerHandler';
import { SystemInfo } from '../../types/SystemInfo';
import debug from 'debug';
import { executeCommand } from './actions/executeCommand';

const sshServerDebug = debug('app:SshServer');

class SshServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    sshServerDebug('Initialized SshServerHandler with config: ' + JSON.stringify(serverConfig));
  }

  async getSystemInfo(): Promise<SystemInfo> {
    sshServerDebug('Retrieving system info for SSH server.');
    const shell = this.serverConfig.shell || 'bash';
    let command: string;
    switch (shell) {
      case 'powershell':
        command = 'powershell src/scripts/remote_system_info.ps1';
        break;
      case 'python':
        command = 'python src/scripts/remote_system_info.py';
        break;
      case 'bash':
      default:
        command = 'bash src/scripts/remote_system_info.sh';
        break;
    }
    const { stdout } = await executeCommand(this.sshClient, command);
    return JSON.parse(stdout) as SystemInfo;
  }
}

export default SshServerHandler;
