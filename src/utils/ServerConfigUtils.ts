import debug from 'debug';
import config from 'config';
import { ServerConfig } from '../types';
import { ServerHandler } from '../handlers/ServerHandler';

const serverHandlerDebug = debug('app:ServerConfigUtils');

export class ServerConfigUtils {
  private static serverConfigs: ServerConfig[] = config.get('serverConfig');

  /**
   * Fetches and returns the list of server configurations.
   * 
   * @returns {ServerConfig[]} An array of server configurations.
   */
  public static listAvailableServers(): ServerConfig[] {
    serverHandlerDebug('Attempting to list available server configurations...');
    try {
      const servers: ServerConfig[] = config.get('serverConfig');

      if (!servers || !Array.isArray(servers) || servers.length === 0) {
        serverHandlerDebug('No server configurations found or loaded from configuration.');
        return [];
      }

      serverHandlerDebug(`Loaded server configurations: ${JSON.stringify(servers, null, 2)}`);
      return servers;
    } catch (error) {
      serverHandlerDebug(`Error loading server configurations: ${error}`);
      throw new Error('Failed to load server configurations.');
    }
  }

  public static async getInstance(host: string): Promise<ServerHandler> {
    serverHandlerDebug(`Attempting to get server instance for host: ${host}`);
    if (!host) {
      throw new Error('Host is undefined.');
    }

    try {
      const serverConfig = await ServerConfigUtils.getServerConfig(host);
      serverHandlerDebug(`Retrieved server config for host ${host}: ${JSON.stringify(serverConfig)}`);
    
      let handler: ServerHandler;
      if (host === 'localhost') {
        const { default: LocalServerHandler } = await import('../handlers/LocalServerHandler');
        handler = new LocalServerHandler(serverConfig);
      } else {
        switch (serverConfig.protocol) {
          case 'ssh':
            const { default: SshServerHandler } = await import('../handlers/SshServerHandler');
            handler = new SshServerHandler(serverConfig);
            break;
          case 'ssm':
            const { default: SsmServerHandler } = await import('../handlers/SsmServerHandler');
            handler = new SsmServerHandler(serverConfig);
            break;
          default:
            throw new Error(`Unsupported protocol: ${serverConfig.protocol}`);
        }
      }
      serverHandlerDebug(`Server handler instantiated successfully for ${host}`);
      return handler;
    } catch (error) {
      serverHandlerDebug(`Failed to get server instance for host: ${host}, Error: ${error}`);
      throw error;
    }
  }

  private static async getServerConfig(host: string): Promise<ServerConfig> {
    serverHandlerDebug(`Fetching server configuration for host: ${host}`);
    const servers = ServerConfigUtils.listAvailableServers();
    const serverConfig = servers.find(configItem => configItem.host === host);
    if (!serverConfig) {
      serverHandlerDebug(`Server configuration not found for host: ${host}`);
      throw new Error(`Server with host '${host}' not in predefined list.`);
    }
    return serverConfig;
  }

  public static updateCurrentServerConfig(host: string, newConfig: Partial<ServerConfig>): void {
    serverHandlerDebug(`Updating server configuration for host: ${host}`);
    const index = this.serverConfigs.findIndex((config) => config.host === host);
    if (index !== -1) {
      this.serverConfigs[index] = { ...this.serverConfigs[index], ...newConfig };
      serverHandlerDebug(`Server configuration updated for host: ${host}`);
    } else {
      serverHandlerDebug(`Server configuration for host '${host}' not found. Update failed.`);
      throw new Error(`Server config for host '${host}' not found.`);
    }
  }
}
