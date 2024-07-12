// src/utils/ServerConfigUtils.ts
import config from 'config';
import { ServerConfig, ServerHandlerInterface } from '../types/index'; // Ensure this interface is correctly defined
import SshServerHandler from '../handlers/SshServerHandler';
import SsmServerHandler from '../handlers/SsmServerHandler';
import LocalServerHandler from '../handlers/LocalServerHandler';
import Debug from 'debug';
import { paginateResponse, PaginatedResponse } from '../utils/PaginationUtils';

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

  // List files method utilizing the pagination utility
  public static async listFiles(host: string, directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<PaginatedResponse<string>> {
    const handler = await this.getInstance(host);
    const { stdout } = await handler.executeCommand(`ls -l ${directory} | tail -n +${offset + 1} | head -n ${limit}`);
    const items = stdout.split('\n').filter(line => line).map(line => {
      const parts = line.split(/\s+/);
      return parts.pop() || "";
    });

    return paginateResponse(items, limit, offset);
  }
}
