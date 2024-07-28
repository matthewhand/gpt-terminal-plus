import config from 'config';
import { ServerConfig, ServerHandlerInterface } from '../types/index';
import SshServerHandler from '../handlers/SshServerHandler';
import { SsmServerModule } from '../handlers/ssm/SsmServerModule';
import LocalServerHandler from '../handlers/LocalServerHandler';
import Debug from 'debug';
import * as AWS from 'aws-sdk';

const serverHandlerDebug = Debug('app:ServerConfigUtils');

// Define a default configuration
const defaultServerConfig: ServerConfig[] = [
  {
    host: "localhost",
    privateKeyPath: "/path/to/private/key",
    keyPath: "/path/to/key",
    posix: true,
    systemInfo: "python",
    port: 22,
    code: true,
    username: "user",
    protocol: "local",
    shell: "/bin/bash",
    region: "us-west-2",
    instanceId: "i-1234567890abcdef0",
    homeFolder: "/home/user",
    containerId: 1,
    tasks: ["task1", "task2"],
    scriptFolder: "/scripts",
    defaultFolder: "/home/user",
    ssmClient: new AWS.SSM()
  }
];

/**
 * Utility class for managing server configurations and handlers.
 */
export class ServerConfigUtils {
  private static serverConfigs: ServerConfig[] = config.has('serverConfig') ? config.get<ServerConfig[]>('serverConfig') : defaultServerConfig;
  private static instances: Record<string, ServerHandlerInterface> = {};

  /**
   * Lists available server configurations.
   * @returns An array of server configurations.
   */
  public static listAvailableServers(): ServerConfig[] {
    serverHandlerDebug('Listing available servers...');
    return this.serverConfigs;
  }

  /**
   * Retrieve the server configuration based on the provided server name.
   * @param server - The name of the server.
   * @returns The server configuration if found, otherwise undefined.
   */
  public static getServerConfig(server: string): ServerConfig | undefined {
    return this.serverConfigs.find(config => config.host === server);
  }

  /**
   * Gets an instance of a server handler based on the host.
   * @param host - The host name of the server.
   * @returns A promise that resolves to the server handler instance.
   */
  public static async getInstance(host: string): Promise<ServerHandlerInterface> {
    serverHandlerDebug(`Fetching instance for host: ${host}`);
    if (!host) throw new Error('Host is undefined.');

    if (!this.instances[host]) {
      const serverConfig = this.getServerConfig(host);
      if (!serverConfig) throw new Error(`Server config not found for host: ${host}`);
      this.instances[host] = await this.initializeHandler(serverConfig);
    }
    return this.instances[host];
  }

  /**
   * Initializes a handler based on the server configuration.
   * @param serverConfig - The server configuration.
   * @returns The initialized server handler.
   */
  private static async initializeHandler(serverConfig: ServerConfig): Promise<ServerHandlerInterface> {
    switch (serverConfig.protocol) {
      case 'ssh':
        return await SshServerHandler.getInstance(serverConfig);
      case 'ssm':
        return new SsmServerModule(serverConfig.ssmClient as AWS.SSM, serverConfig.instanceId as string);
      case 'local':
        return new LocalServerHandler(serverConfig);
      default:
        throw new Error(`Unsupported protocol: ${serverConfig.protocol}`);
    }
  }

  /**
   * Updates the current server configuration dynamically.
   * @param host - The host name of the server.
   * @param newConfig - The new configuration details.
   */
  public static updateCurrentServerConfig(host: string, newConfig: Partial<ServerConfig>): void {
    serverHandlerDebug(`Updating server configuration for host: ${host}`);
    const index = this.serverConfigs.findIndex(config => config.host === host);
    if (index !== -1) {
      this.serverConfigs[index] = { ...this.serverConfigs[index], ...newConfig };
      delete this.instances[host];
    } else {
      throw new Error(`Server config for host '${host}' not found.`);
    }
  }
}
