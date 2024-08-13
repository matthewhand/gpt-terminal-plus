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
   * Constructs a ServerManager instance.
   * Can be initialized with a hostname.
   * @param {string} selectedHostname - The server hostname.
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
   * Retrieves the current server configuration.
   * @returns {ServerConfig} The server configuration.
   */
  getServerConfig(): ServerConfig {
    serverManagerDebug('Returning current server configuration for hostname: ' + this.serverConfig.hostname);
    return this.serverConfig;
  }

  /**
   * Updates the server configuration.
   * @param {ServerConfig} serverConfig - The new server configuration.
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
   * Creates and returns the appropriate server handler based on the protocol.
   * @returns {LocalServerHandler | SshServerHandler | SsmServerHandler} The server handler.
   */
  createHandler(): LocalServerHandler | SshServerHandler | SsmServerHandler {
    const { protocol, hostname } = this.serverConfig;
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
        const errorMsg = 'Unsupported protocol: ' + protocol + ' for hostname: ' + hostname;
        serverManagerDebug(errorMsg);
        throw new Error(errorMsg);
    }
  }

  /**
   * Lists all available servers by combining local, SSH, and SSM configurations.
   * @returns {ServerConfig[]} An array of available server configurations.
   */
  static listAvailableServers(): ServerConfig[] {
    serverManagerDebug('Listing available servers from configuration');

    const localConfig = config.get<LocalConfig>('local');
    const sshConfigs = config.get<SshHostConfig[]>('ssh.hosts');
    const ssmConfigs = config.get<SsmTargetConfig[]>('ssm.targets').map(target => ({
      ...target,
      protocol: 'ssm' as const, // Ensure protocol is treated as a literal type
      region: config.get<string>('ssm.region'),
    }));

    const availableServers: ServerConfig[] = [];

    if (localConfig && localConfig.hostname) {
      availableServers.push({ ...localConfig, protocol: 'local' as const });
    } else {
      serverManagerDebug('Invalid or missing local server configuration.');
    }

    if (Array.isArray(sshConfigs) && sshConfigs.length > 0) {
      sshConfigs.forEach(server => {
        if (server.hostname) {
          availableServers.push({ ...server, protocol: 'ssh' as const });
        } else {
          serverManagerDebug('Skipping invalid SSH server configuration.');
        }
      });
    } else {
      serverManagerDebug('No valid SSH server configurations found.');
    }

    if (Array.isArray(ssmConfigs) && ssmConfigs.length > 0) {
      ssmConfigs.forEach(server => {
        if (server.hostname && server.instanceId) {
          availableServers.push(server); // Now correctly typed as SsmTargetConfig
        } else {
          serverManagerDebug('Skipping invalid SSM server configuration.');
        }
      });
    } else {
      serverManagerDebug('No valid SSM server configurations found.');
    }

    serverManagerDebug('Available servers: ' + JSON.stringify(availableServers));
    return availableServers;
  }

  /**
   * Retrieves the server configuration for the given hostname.
   * @param {string} hostname - The hostname to search for.
   * @returns {ServerConfig | undefined} The server configuration, or undefined if not found.
   */
  static getServerConfig(hostname: string): ServerConfig | undefined {
    serverManagerDebug('Searching for server configuration with hostname: ' + hostname);

    const servers = ServerManager.listAvailableServers();

    const foundServer = servers.find(server =>
      server.protocol === 'local'
        ? hostname === 'localhost' || hostname === server.hostname
        : server.hostname === hostname
    );

    console.log('Found Server Configuration:', foundServer); // Debug statement
    console.log('Available Servers:', servers); // Debug statement

    if (foundServer) {
      serverManagerDebug('Found server configuration: ' + JSON.stringify(foundServer));
    } else {
      serverManagerDebug('Server configuration not found for hostname: ' + hostname);
    }

    return foundServer;
  }
}

export default ServerManager;
