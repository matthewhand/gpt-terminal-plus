import config from 'config';
import debug from 'debug';
import { ServerConfig, LocalServerConfig, SshHostConfig, SsmTargetConfig } from '../types/ServerConfig';
import { LocalServerHandler } from '../handlers/local/LocalServerHandler';
import { SshServerHandler } from '../handlers/ssh/SshServerHandler';
import { SsmServerHandler } from '../handlers/ssm/SsmServerHandler';

const serverManagerDebug = debug('app:ServerManager');

export class ServerManager {
  private serverConfig: ServerConfig;

  constructor(selectedHostname: string) {
    serverManagerDebug('Initializing ServerManager with hostname: ' + selectedHostname);

    this.serverConfig = ServerManager.getServerConfig(selectedHostname) || ServerManager.getDefaultLocalServerConfig();
    serverManagerDebug('ServerManager created with config for hostname: ' + selectedHostname);
  }

  getServerConfig(): ServerConfig {
    serverManagerDebug('Returning current server configuration for hostname: ' + this.serverConfig.hostname);
    return this.serverConfig;
  }

  setServerConfig(serverConfig: ServerConfig): void {
    if (!serverConfig || !serverConfig.hostname) {
      serverManagerDebug('Attempted to set invalid server configuration.');
      throw new Error('Invalid server configuration.');
    }

    this.serverConfig = serverConfig;
    serverManagerDebug('Server configuration updated for hostname: ' + serverConfig.hostname);
  }

  createHandler(): LocalServerHandler | SshServerHandler | SsmServerHandler {
    const protocol: string = this.serverConfig.protocol || 'local';
    const hostname: string = this.serverConfig.hostname || 'localhost';

    switch (protocol) {
      case 'local':
        serverManagerDebug('Creating LocalServerHandler for hostname: ' + hostname);
        return new LocalServerHandler(this.serverConfig as LocalServerConfig);
      case 'ssh':
        serverManagerDebug('Creating SshServerHandler for hostname: ' + hostname);
        return new SshServerHandler(this.serverConfig as SshHostConfig);
      case 'ssm':
        serverManagerDebug('Creating SsmServerHandler for hostname: ' + hostname);
        return new SsmServerHandler(this.serverConfig as SsmTargetConfig);
      default:
        throw new Error('Unsupported server protocol: ' + protocol);
    }
  }

  static listAvailableServers(): ServerConfig[] {
    serverManagerDebug('Listing available servers from configuration');

    let localConfig: LocalServerConfig | undefined;
    try {
      localConfig = config.get<LocalServerConfig>('local');
      serverManagerDebug('Loaded local config: ' + JSON.stringify(localConfig));
    } catch (error) {
      serverManagerDebug('Local config not found or invalid: ' + (error as Error).message);
      localConfig = ServerManager.getDefaultLocalServerConfig();
    }

    let sshConfigs: SshHostConfig[] | undefined = [];
    try {
      sshConfigs = config.get<SshHostConfig[]>('ssh.hosts');
      serverManagerDebug('Loaded SSH configs: ' + JSON.stringify(sshConfigs));
    } catch (error) {
      serverManagerDebug('SSH config not found or invalid: ' + (error as Error).message);
    }

    let ssmConfigs: SsmTargetConfig[] = [];
    try {
      ssmConfigs = config.get<SsmTargetConfig[]>('ssm.targets').map((target: SsmTargetConfig): SsmTargetConfig => {
        return {
          ...target,
          protocol: 'ssm'
        };
      });
      serverManagerDebug('Loaded SSM configs: ' + JSON.stringify(ssmConfigs));
    } catch (error) {
      serverManagerDebug('SSM config not found or invalid: ' + (error as Error).message);
    }

    const availableServers: ServerConfig[] = [];

    if (localConfig && localConfig.hostname) {
      availableServers.push(localConfig);
    }
    if (sshConfigs) {
      availableServers.push(...sshConfigs);
    }
    if (ssmConfigs) {
      availableServers.push(...ssmConfigs);
    }

    return availableServers;
  }

  static getServerConfig(hostname: string): ServerConfig | undefined {
    serverManagerDebug('Searching for server configuration with hostname: ' + hostname);

    const availableServers = ServerManager.listAvailableServers();
    const foundServer = availableServers.find(server => server.hostname === hostname);

    if (!foundServer) {
      serverManagerDebug('Server configuration not found for hostname: ' + hostname);
      return ServerManager.getDefaultLocalServerConfig();
    }

    return foundServer;
  }

  static getDefaultLocalServerConfig(): LocalServerConfig {
    serverManagerDebug('Loading default local server configuration');

    const defaultLocalServerConfig: LocalServerConfig = {
      protocol: 'local',
      hostname: 'localhost',
      code: false
    };

    serverManagerDebug('Default local server config: ' + JSON.stringify(defaultLocalServerConfig));
    return defaultLocalServerConfig;
  }
}
