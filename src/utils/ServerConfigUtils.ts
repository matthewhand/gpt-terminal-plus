// src/utils/ServerConfigUtils.ts
import config from 'config';
import { ServerConfig, ServerHandlerInterface } from '../types'; // Ensure this interface is correctly defined
import SshServerHandler from '../handlers/SshServerHandler';
import SsmServerHandler from '../handlers/SsmServerHandler';
import LocalServerHandler from '../handlers/LocalServerHandler';
import Debug from 'debug';

const serverHandlerDebug = Debug('app:ServerConfigUtils');

export class ServerConfigUtils {
  private static serverConfigs: ServerConfig[] = config.get<ServerConfig[]>('serverConfig') || [];
  // Changed to interface for better type safety and flexibility
  private static instances: Record<string, ServerHandlerInterface> = {};

  public static listAvailableServers(): ServerConfig[] {
    serverHandlerDebug('Listing available servers...');
    return this.serverConfigs;
  }

  // Updated to return a Promise of ServerHandlerInterface
  public static async getInstance(host: string): Promise<ServerHandlerInterface> {
    serverHandlerDebug(`Fetching instance for host: ${host}`);
    if (!host) throw new Error('Host is undefined.');

    if (!this.instances[host]) {
      const serverConfig = this.serverConfigs.find(config => config.host === host);
      if (!serverConfig) throw new Error(`Server config not found for host: ${host}`);
      this.instances[host] = this.initializeHandler(serverConfig); // Use dynamic initialization
    }
    return this.instances[host];
  }

  // Utility method to initialize a handler based on the server config
  private static initializeHandler(serverConfig: ServerConfig): ServerHandlerInterface {
    switch (serverConfig.protocol) {
      case 'ssh':
        return new SshServerHandler(serverConfig);
      case 'ssm':
        return new SsmServerHandler(serverConfig);
      case 'local':
      default:
        return new LocalServerHandler(serverConfig);
    }
  }

  // Method to update the server configuration dynamically
  public static updateCurrentServerConfig(host: string, newConfig: Partial<ServerConfig>): void {
    serverHandlerDebug(`Updating server configuration for host: ${host}`);
    const index = this.serverConfigs.findIndex(config => config.host === host);
    if (index !== -1) {
      this.serverConfigs[index] = { ...this.serverConfigs[index], ...newConfig };
      delete this.instances[host]; // Invalidate the cache to reflect updates
    } else {
      throw new Error(`Server config for host '${host}' not found.`);
    }
  }
}
