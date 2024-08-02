import { AbstractServerHandler } from '../AbstractServerHandler';
import { SystemInfo } from '../../types/SystemInfo';
import debug from 'debug';
import { executeCommand } from './actions/executeCommand';

const ssmServerDebug = debug('app:SsmServer');

class SsmServerHandler extends AbstractServerHandler {
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    ssmServerDebug('Initialized SsmServerHandler with config: ' + JSON.stringify(serverConfig));
  }

  async getSystemInfo(): Promise<SystemInfo> {
    ssmServerDebug('Retrieving system info for SSM server.');
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
    const { stdout } = await executeCommand(this.ssmClient, command);
    return JSON.parse(stdout) as SystemInfo;
  }
}

export default SsmServerHandler;
