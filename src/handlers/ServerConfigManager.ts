import { ServerConfig } from '../types/ServerConfig';
import { ServerHandler } from '../types/ServerHandler';
import LocalServer from './local/LocalServerHandlerImplementation';
import SshServer from './ssh/SshServerHandlerImplementation';
import SsmServer from './ssm/SsmServerHandlerImplementation';

class ServerConfigManager {
  private config: ServerConfig;
  private handler: ServerHandler;

  constructor(config: ServerConfig) {
    this.config = config;
    this.handler = this.createHandler(config);
  }

  private createHandler(config: ServerConfig): ServerHandler {
    switch (config.protocol) {
      case 'local':
        return new LocalServer(config);
      case 'ssh':
        return new SshServer(config);
      case 'ssm':
        return new SsmServer(config);
      default:
        throw new Error('Invalid server type');
    }
  }

  public getHandler(): ServerHandler {
    return this.handler;
  }
}

export { ServerConfigManager };
