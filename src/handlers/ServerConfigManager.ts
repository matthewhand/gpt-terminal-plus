import { ServerConfig } from '../types/ServerConfig';
import LocalServer from '../handlers/local/LocalServerImplementation';
import SshServer from '../handlers/ssh/SshServerImplementation';
import SsmServer from '../handlers/ssm/SsmServerImplementation';
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

  createHandler(): LocalServer | SshServer | SsmServer {
    const { protocol } = this.serverConfig;

    switch (protocol) {
      case 'local':
        return new LocalServer();
      case 'ssh':
        return new SshServer();
      case 'ssm':
        return new SsmServer();
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }
}
