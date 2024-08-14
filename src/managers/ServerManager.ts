import config from 'config';
import debug from 'debug';
import { ServerConfig, LocalConfig, SshHostConfig, SsmTargetConfig } from '../types/ServerConfig';
import LocalServerHandler from '../handlers/local/LocalServerHandler';
import SshServerHandler from '../handlers/ssh/SshServerHandler';
import SsmServerHandler from '../handlers/ssm/SsmServerHandler';

const serverManagerDebug = debug('app:ServerManager');

export class ServerManager {
  private serverConfig: ServerConfig;

  /**
   * Initializes the ServerManager with the configuration for the specified hostname.
   * @param {string} selectedHostname - The hostname for which the server configuration is required.
   * @throws {Error} - If the server configuration is not found.
   */
  constructor(selectedHostname: string) {
    serverManagerDebug('Initializing ServerManager with hostname: ' + selectedHostname);

    const config = ServerManager.getServerConfig(selectedHostname);
    if (!config) {
      serverManagerDebug('No server configuration found for hostname: ' + selectedHostname);
      throw new Error('Server configuration for ' + selectedHostname + ' not found.');
    }

    this.serverConfig = config;
    serverManagerDebug('ServerManager created with config for hostname: ' + selectedHostname);
  }

  /**
   * Returns the current server configuration.
   * @returns {ServerConfig} - The current server configuration.
   */
  getServerConfig(): ServerConfig {
    serverManagerDebug('Returning current server configuration for hostname: ' + this.serverConfig.hostname);
    return this.serverConfig;
  }

  /**
   * Sets a new server configuration.
   * @param {ServerConfig} serverConfig - The new server configuration.
   * @throws {Error} - If the server configuration is invalid.
   */
  setServerConfig(serverConfig: ServerConfig): void {
    if (!serverConfig || !serverConfig.hostname) {
      serverManagerDebug('Attempted to set invalid server configuration.');
      throw new Error('Invalid server configuration.');
    }

    this.serverConfig = serverConfig;
    serverManagerDebug('Server configuration updated for hostname: ' + serverConfig.hostname);
  }

  /**
   * Creates the appropriate server handler based on the server configuration.
   * @returns {LocalServerHandler | SshServerHandler | SsmServerHandler} - The server handler instance.
   * @throws {Error} - If the protocol is unsupported.
   */
  createHandler(): LocalServerHandler | SshServerHandler | SsmServerHandler {
    const protocol: string = this.serverConfig.protocol;
    const hostname: string = this.serverConfig.hostname;
    serverManagerDebug('Creating handler for protocol: ' + protocol + ', hostname: ' + hostname);

    switch (protocol) {
      case 'local':
        serverManagerDebug('Creating LocalServerHandler for hostname: ' + hostname);
        return new LocalServerHandler(this.serverConfig as LocalConfig);
      case 'ssh':
        serverManagerDebug('Creating SshServerHandler for hostname: ' + hostname);
        return new SshServerHandler(this.serverConfig as SshHostConfig);
      case 'ssm':
        serverManagerDebug('Creating SsmServerHandler for hostname: ' + hostname);
        return new SsmServerHandler(this.serverConfig as SsmTargetConfig);
      default:
        const errorMsg: string = 'Unsupported protocol: ' + protocol + ' for hostname: ' + hostname;
        serverManagerDebug(errorMsg);
        throw new Error(errorMsg);
    }
  }

  /**
   * Lists all available server configurations.
   * This method checks the configuration for local, SSH, and SSM servers.
   * @returns {ServerConfig[]} - The list of available servers.
   */
  static listAvailableServers(): ServerConfig[] {
    serverManagerDebug('Listing available servers from configuration');

    // Load and validate local configuration
    let localConfig: LocalConfig | undefined;
    try {
      localConfig = config.get<LocalConfig>('local');
      serverManagerDebug('Loaded local config: ' + JSON.stringify(localConfig));
    } catch (error) {
      serverManagerDebug('Local config not found or invalid: ' + (error as Error).message);
      serverManagerDebug('Resorting to default local server configuration...');
      localConfig = ServerManager.getDefaultLocalConfig();
    }

    // Load SSH configurations, handle missing config
    let sshConfigs: SshHostConfig[] | undefined = [];
    try {
      sshConfigs = config.get<SshHostConfig[]>('ssh.hosts');
      serverManagerDebug('Loaded SSH configs: ' + JSON.stringify(sshConfigs));
    } catch (error) {
      serverManagerDebug('SSH config not found or invalid: ' + (error as Error).message);
    }

    // Load and process SSM configurations, handle missing config
    let ssmConfigs: SsmTargetConfig[] = [];
    try {
      ssmConfigs = config.get<SsmTargetConfig[]>('ssm.targets').map((target: SsmTargetConfig): SsmTargetConfig => {
        serverManagerDebug('Processing SSM target: ' + JSON.stringify(target));
        return {
          ...target,
          protocol: 'ssm' as const,
          region: config.get<string>('ssm.region'),
        };
      });
      serverManagerDebug('Processed SSM configs: ' + JSON.stringify(ssmConfigs));
    } catch (error) {
      serverManagerDebug('SSM config not found or invalid: ' + (error as Error).message);
    }

    // Combine all configurations into the available servers list
    const availableServers: ServerConfig[] = [];

    if (localConfig && localConfig.hostname) {
      serverManagerDebug('Adding local server to available servers: ' + localConfig.hostname);
      availableServers.push({ ...localConfig, protocol: 'local' as const });
    } else {
      serverManagerDebug('Invalid or missing local server configuration.');
    }

    if (Array.isArray(sshConfigs) && sshConfigs.length > 0) {
      sshConfigs.forEach((server: SshHostConfig): void => {
        if (server.hostname) {
          serverManagerDebug('Adding SSH server to available servers: ' + server.hostname);
          availableServers.push({ ...server, protocol: 'ssh' as const });
        } else {
          serverManagerDebug('Skipping invalid SSH server configuration: ' + JSON.stringify(server));
        }
      });
    } else {
      serverManagerDebug('No valid SSH server configurations found.');
    }

    if (Array.isArray(ssmConfigs) && ssmConfigs.length > 0) {
      ssmConfigs.forEach((server: SsmTargetConfig): void => {
        if (server.hostname && server.instanceId) {
          serverManagerDebug('Adding SSM server to available servers: ' + server.hostname);
          availableServers.push(server);
        } else {
          serverManagerDebug('Skipping invalid SSM server configuration: ' + JSON.stringify(server));
        }
      });
    } else {
      serverManagerDebug('No valid SSM server configurations found.');
    }

    serverManagerDebug('Final list of available servers: ' + JSON.stringify(availableServers));
    return availableServers;
  }

  /**
   * Retrieves the server configuration for the specified hostname.
   * If no matching configuration is found, a default local configuration is returned.
   * @param {string} hostname - The hostname for which to retrieve the configuration.
   * @returns {ServerConfig | undefined} - The server configuration for the given hostname.
   */
  static getServerConfig(hostname: string): ServerConfig | undefined {
    serverManagerDebug('Searching for server configuration with hostname: ' + hostname);

    const servers: ServerConfig[] = ServerManager.listAvailableServers();
    serverManagerDebug('Available servers to search: ' + JSON.stringify(servers));

    const foundServer: ServerConfig | undefined = servers.find((server: ServerConfig) =>
      server.protocol === 'local'
        ? hostname === 'localhost' || hostname === server.hostname
        : server.hostname === hostname
    );

    if (foundServer) {
      serverManagerDebug('Found server configuration: ' + JSON.stringify(foundServer));
    } else {
      serverManagerDebug('Server configuration not found for hostname: ' + hostname);
      serverManagerDebug('Resorting to default local server configuration.');
      return ServerManager.getDefaultLocalConfig();
    }

    return foundServer;
  }

  /**
   * Returns a default local server configuration.
   * @returns {LocalConfig} - The default local server configuration.
   */
  static getDefaultLocalConfig(): LocalConfig {
    serverManagerDebug('Loading default local server configuration');

    const defaultLocalConfig: LocalConfig = {
      protocol: 'local',
      hostname: 'localhost',
      code: false
    };

    serverManagerDebug('Default local server config: ' + JSON.stringify(defaultLocalConfig));
    return defaultLocalConfig;
  }
}

export default ServerManager;
