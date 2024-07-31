import { ServerConfig } from '../types/ServerConfig';
import LocalServer from '../handlers/local/LocalServerImplementation';
import SshServer from '../handlers/ssh/SshServerImplementation';
import SsmServer from '../handlers/ssm/SsmServerImplementation';
import debug from 'debug';

const serverConfigManagerDebug = debug('app:ServerConfigManager');

/**
 * Manages the server configurations and handles the creation of server handlers.
 */
export class ServerConfigManager {
  private serverConfig: ServerConfig;

  /**
   * Initializes the ServerConfigManager with a given server configuration.
   * @param serverConfig - The configuration of the server.
   */
  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    serverConfigManagerDebug('ServerConfigManager created for ' + serverConfig.host);
  }

  /**
   * Retrieves the current server configuration.
   * @returns The current server configuration.
   */
  getServerConfig(): ServerConfig {
    serverConfigManagerDebug('Retrieving server configuration');
    return this.serverConfig;
  }

  /**
   * Updates the server configuration.
   * @param serverConfig - The new server configuration.
   */
  setServerConfig(serverConfig: ServerConfig): void {
    this.serverConfig = serverConfig;
    serverConfigManagerDebug('Server configuration updated');
  }

  /**
   * Creates a handler based on the server configuration's protocol.
   * @returns The appropriate server handler.
   * @throws Will throw an error if the protocol is unsupported.
   */
  createHandler(): LocalServer | SshServer | SsmServer {
    const { protocol } = this.serverConfig;

    switch (protocol) {
      case 'local':
        serverConfigManagerDebug('Creating LocalServer handler for ' + this.serverConfig.host);
        return new LocalServer();
      case 'ssh':
        serverConfigManagerDebug('Creating SshServer handler for ' + this.serverConfig.host);
        return new SshServer();
      case 'ssm':
        serverConfigManagerDebug('Creating SsmServer handler for ' + this.serverConfig.host);
        return new SsmServer();
      default:
        const errorMsg = 'Unsupported protocol: ' + protocol;
        serverConfigManagerDebug(errorMsg);
        throw new Error(errorMsg);
    }
  }
}

export default ServerConfigManager;
