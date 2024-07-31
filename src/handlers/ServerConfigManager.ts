import { ServerConfig } from '../types/ServerConfig';
import { LocalServerHandler } from '../handlers/local/LocalServerHandler';
import { SshServerHandler } from '../handlers/ssh/SshServerHandler';
import { SsmServerHandler } from '../handlers/ssm/SsmServerHandler';
import debug from 'debug';

const serverConfigManagerDebug = debug('app:ServerConfigManager');

export class ServerConfigManager {
  private serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    serverConfigManagerDebug(`ServerConfigManager created for ${serverConfig.host}`);
  }

  getServerConfig(): ServerConfig {
    serverConfigManagerDebug('Retrieving server configuration');
    return this.serverConfig;
  }

  setServerConfig(serverConfig: ServerConfig): void {
    this.serverConfig = serverConfig;
    serverConfigManagerDebug('Server configuration updated');
  }

  createHandler(): LocalServerHandler | SshServerHandler | SsmServerHandler {
    const { protocol } = this.serverConfig;

    switch (protocol) {
      case 'local':
        return new LocalServerHandler(this.serverConfig);
      case 'ssh':
        return new SshServerHandler(this.serverConfig);
      case 'ssm':
        return new SsmServerHandler(this.serverConfig);
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }
}
