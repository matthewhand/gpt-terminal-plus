import config from 'config';
import debug from 'debug';
import { ServerConfig, LocalConfig, SshHostConfig, SsmTargetConfig } from '../types/ServerConfig';
import LocalServerHandler from '../handlers/local/LocalServerHandler';
import SshServer from '../handlers/ssh/SshServerHandler';
import SsmServer from '../handlers/ssm/SsmServerHandler';

const serverManagerDebug = debug('app:ServerManager');

export class ServerManager {
  private serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig);
  constructor(selectedServer: string);
  constructor(param: ServerConfig | string) {
    if (typeof param === 'string') {
      const selectedServer = param;
      serverManagerDebug(`Initializing ServerManager with selected server: ${selectedServer}`);
      const config = ServerManager.getServerConfig(selectedServer);
      if (!config) {
        const errorMsg = `Server configuration for host ${selectedServer} not found`;
        serverManagerDebug(errorMsg);
        throw new Error(errorMsg);
      }
      this.serverConfig = config;
      serverManagerDebug(`ServerManager created for server: ${selectedServer}`);
    } else {
      this.serverConfig = param;
      serverManagerDebug(`ServerManager created with provided configuration for host: ${param.host}`);
    }
  }

  getServerConfig(): ServerConfig {
    serverManagerDebug(`Retrieving server configuration for host: ${this.serverConfig.host}`);
    return this.serverConfig;
  }

  setServerConfig(serverConfig: ServerConfig): void {
    this.serverConfig = serverConfig;
    serverManagerDebug(`Server configuration updated for host: ${serverConfig.host}`);
  }

  createHandler(): LocalServerHandler | SshServer | SsmServer {
    const { protocol, host } = this.serverConfig;
    serverManagerDebug(`Creating handler for protocol: ${protocol}, host: ${host}`);
    
    switch (protocol) {
      case 'local':
        serverManagerDebug(`Creating LocalServer handler for ${host}`);
        return new LocalServerHandler(this.serverConfig as LocalConfig);
      case 'ssh':
        serverManagerDebug(`Creating SshServer handler for ${host}`);
        return new SshServer(this.serverConfig as SshHostConfig);
      case 'ssm':
        serverManagerDebug(`Creating SsmServer handler for ${host}`);
        return new SsmServer(this.serverConfig as SsmTargetConfig);
      default:
        const errorMsg = `Unsupported protocol: ${protocol}`;
        serverManagerDebug(errorMsg);
        throw new Error(errorMsg);
    }
  }

  static listAvailableServers(): ServerConfig[] {
    serverManagerDebug('Listing available servers from configuration');
    
    let localServers: LocalConfig[] = [];
    let sshServers: SshHostConfig[] = [];
    let ssmServers: SsmTargetConfig[] = [];

    // Debug the raw config before processing
    const rawConfig = config.util.toObject();
    serverManagerDebug('Raw configuration loaded: ' + JSON.stringify(rawConfig, null, 2));

    try {
      const localConfig = config.get<LocalConfig[]>('local');
      if (Array.isArray(localConfig)) {
        localServers = localConfig;
        serverManagerDebug(`Loaded local server configurations: ${JSON.stringify(localServers)}`);
      } else if (localConfig && typeof localConfig === 'object') {
        serverManagerDebug('Local server configuration is a single object, converting to array');
        localServers = [localConfig as LocalConfig];
      } else {
        serverManagerDebug('Local server configuration is not an array or object, using default');
        localServers = [{ host: 'localhost', protocol: 'local', code: false }];
      }
    } catch (error) {
      if (error instanceof Error) {
        serverManagerDebug(`Error loading local server configurations: ${error.message}`);
      } else {
        serverManagerDebug('Unknown error occurred while loading local server configurations');
      }
      localServers = [{ host: 'localhost', protocol: 'local', code: false }];
    }

    try {
      const sshConfig = config.get<SshHostConfig[]>('ssh.hosts');
      if (Array.isArray(sshConfig)) {
        sshServers = sshConfig;
        serverManagerDebug(`Loaded SSH server configurations: ${JSON.stringify(sshServers)}`);
      } else {
        serverManagerDebug('SSH server configuration is not an array');
      }
    } catch (error) {
      if (error instanceof Error) {
        serverManagerDebug(`Error loading SSH server configurations: ${error.message}`);
      } else {
        serverManagerDebug('No SSH server configurations found');
      }
    }

    try {
      const ssmConfig = config.get<SsmTargetConfig[]>('ssm.targets');
      if (Array.isArray(ssmConfig)) {
        ssmServers = ssmConfig;
        serverManagerDebug(`Loaded SSM server configurations: ${JSON.stringify(ssmServers)}`);
      } else {
        serverManagerDebug('SSM server configuration is not an array');
      }
    } catch (error) {
      if (error instanceof Error) {
        serverManagerDebug(`Error loading SSM server configurations: ${error.message}`);
      } else {
        serverManagerDebug('No SSM server configurations found');
      }
    }

    const availableServers = [
      ...localServers.map(server => ({ ...server, protocol: 'local' } as LocalConfig)),
      ...sshServers.map(server => ({ ...server, protocol: 'ssh' } as SshHostConfig)),
      ...ssmServers.map(server => ({ ...server, protocol: 'ssm', region: config.get('ssm.region') } as SsmTargetConfig)),
    ];

    serverManagerDebug(`Available servers: ${JSON.stringify(availableServers)}`);
    
    return availableServers;
  }

  static getServerConfig(host: string): ServerConfig | undefined {
    serverManagerDebug(`Searching for server configuration with host: ${host}`);
    const servers = ServerManager.listAvailableServers();
    const foundServer = servers.find(server => server.host === host);
    
    if (foundServer) {
      serverManagerDebug(`Found server configuration: ${JSON.stringify(foundServer)}`);
    } else {
      serverManagerDebug(`Server configuration not found for host: ${host}`);
    }

    return foundServer;
  }
}

export default ServerManager;
