import config from 'config';
import debug from 'debug';
import { ServerConfig, LocalServerConfig, SshHostConfig, SsmTargetConfig } from '../types/ServerConfig';
import { LocalServerHandler } from '../handlers/local/LocalServerHandler';
import { SshServerHandler } from '../handlers/ssh/SshServerHandler';
import { SsmServerHandler } from '../handlers/ssm/SsmServerHandler';

const serverManagerDebug = debug('app:ServerManager');

export class ServerManager {
  private static instance: ServerManager;
  private servers: Map<string, ServerConfig> = new Map();

  private constructor() {
    serverManagerDebug('Initializing ServerManager singleton');
    this.loadServersFromConfig();
  }

  static getInstance(): ServerManager {
    if (!ServerManager.instance) {
      ServerManager.instance = new ServerManager();
    }
    return ServerManager.instance;
  }

  private loadServersFromConfig(): void {
    serverManagerDebug('Loading servers from configuration');

    // Load local config
    try {
      const localConfig = config.get<LocalServerConfig>('local');
      if (localConfig && localConfig.hostname) {
        this.servers.set(localConfig.hostname, localConfig);
      }
    } catch {
      serverManagerDebug('Local config not found, using default');
      const defaultLocal = ServerManager.getDefaultLocalServerConfig();
      this.servers.set(defaultLocal.hostname, defaultLocal);
    }

    // Load SSH configs
    try {
      const sshConfigs = config.get<SshHostConfig[]>('ssh.hosts') || [];
      sshConfigs.forEach(config => {
        if (config.hostname) {
          this.servers.set(config.hostname, config);
        }
      });
    } catch {
      serverManagerDebug('SSH configs not found');
    }

    // Load SSM configs
    try {
      const ssmConfigs = config.get<SsmTargetConfig[]>('ssm.targets') || [];
      ssmConfigs.forEach(config => {
        if (config.hostname) {
          this.servers.set(config.hostname, config);
        }
      });
    } catch {
      serverManagerDebug('SSM configs not found');
    }
  }

  addServer(serverConfig: ServerConfig): void {
    if (!serverConfig || !serverConfig.hostname) {
      throw new Error('Invalid server configuration');
    }
    this.servers.set(serverConfig.hostname, serverConfig);
    serverManagerDebug('Added server: ' + serverConfig.hostname);
  }

  removeServer(hostname: string): boolean {
    const deleted = this.servers.delete(hostname);
    if (deleted) {
      serverManagerDebug('Removed server: ' + hostname);
    }
    return deleted;
  }

  listServers(): ServerConfig[] {
    return Array.from(this.servers.values());
  }

  getServerConfig(hostname: string): ServerConfig | undefined {
    return this.servers.get(hostname);
  }

  createHandler(hostname: string): LocalServerHandler | SshServerHandler | SsmServerHandler {
    const serverConfig = this.getServerConfig(hostname);
    if (!serverConfig) {
      throw new Error('Server not found: ' + hostname);
    }

    const protocol = serverConfig.protocol || 'local';

    switch (protocol) {
      case 'local':
        serverManagerDebug('Creating LocalServerHandler for hostname: ' + hostname);
        return new LocalServerHandler(serverConfig as LocalServerConfig);
      case 'ssh':
        serverManagerDebug('Creating SshServerHandler for hostname: ' + hostname);
        return new SshServerHandler(serverConfig as SshHostConfig);
      case 'ssm':
        serverManagerDebug('Creating SsmServerHandler for hostname: ' + hostname);
        return new SsmServerHandler(serverConfig as SsmTargetConfig);
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
      code: false,
      directory: '.'
    };

    serverManagerDebug('Default local server config: ' + JSON.stringify(defaultLocalServerConfig));
    return defaultLocalServerConfig;
  }
}
