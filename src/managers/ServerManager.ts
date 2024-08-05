import config from 'config';
import debug from 'debug';
import { ServerConfig, LocalConfig, SshHostConfig, SsmTargetConfig } from '../types/ServerConfig';
import LocalServerImplementation from '../handlers/local/LocalServerImplementation';
import SshServer from '../handlers/ssh/SshServerImplementation';
import SsmServer from '../handlers/ssm/SsmServerImplementation';

const serverManagerDebug = debug('app:ServerManager');

export class ServerManager {
  private serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig);
  constructor(selectedServer: string);
  constructor(param: ServerConfig | string) {
    if (typeof param === 'string') {
      const selectedServer = param;
      const config = ServerManager.getServerConfig(selectedServer);
      if (!config) {
        const errorMsg = `Server configuration for host ${selectedServer} not found`;
        serverManagerDebug(errorMsg);
        throw new Error(errorMsg);
      }
      this.serverConfig = config;
      serverManagerDebug('ServerManager created for ' + selectedServer);
    } else {
      this.serverConfig = param;
      serverManagerDebug('ServerManager created for ' + param.host);
    }
  }

  getServerConfig(): ServerConfig {
    serverManagerDebug('Retrieving server configuration');
    return this.serverConfig;
  }

  setServerConfig(serverConfig: ServerConfig): void {
    this.serverConfig = serverConfig;
    serverManagerDebug('Server configuration updated');
  }

  createHandler(): LocalServerImplementation | SshServer | SsmServer {
    const { protocol } = this.serverConfig;
    switch (protocol) {
      case 'local':
        serverManagerDebug('Creating LocalServer handler for ' + this.serverConfig.host);
        return new LocalServerImplementation(this.serverConfig as LocalConfig);
      case 'ssh':
        serverManagerDebug('Creating SshServer handler for ' + this.serverConfig.host);
        return new SshServer(this.serverConfig as SshHostConfig);
      case 'ssm':
        serverManagerDebug('Creating SsmServer handler for ' + this.serverConfig.host);
        return new SsmServer(this.serverConfig as SsmTargetConfig);
      default:
        const errorMsg = 'Unsupported protocol: ' + protocol;
        serverManagerDebug(errorMsg);
        throw new Error(errorMsg);
    }
  }

  static listAvailableServers(): ServerConfig[] {
    let localServers: LocalConfig[] = [];
    let sshServers: SshHostConfig[] = [];
    let ssmServers: SsmTargetConfig[] = [];

    try {
      const localConfig = config.get<LocalConfig[]>('local');
      if (Array.isArray(localConfig)) {
        localServers = localConfig;
      } else {
        serverManagerDebug('Local server configuration is not an array, using default');
        localServers = [{ host: 'localhost', protocol: 'local', code: false }];
      }
    } catch (error) {
      serverManagerDebug('No local server configurations found, defaulting to hardcoded local configuration');
      localServers = [{ host: 'localhost', protocol: 'local', code: false }];
    }

    try {
      const sshConfig = config.get<SshHostConfig[]>('ssh.hosts');
      if (Array.isArray(sshConfig)) {
        sshServers = sshConfig;
      } else {
        serverManagerDebug('SSH server configuration is not an array');
      }
    } catch (error) {
      serverManagerDebug('No SSH server configurations found');
    }

    try {
      const ssmConfig = config.get<SsmTargetConfig[]>('ssm.targets');
      if (Array.isArray(ssmConfig)) {
        ssmServers = ssmConfig;
      } else {
        serverManagerDebug('SSM server configuration is not an array');
      }
    } catch (error) {
      serverManagerDebug('No SSM server configurations found');
    }

    serverManagerDebug('Listing available servers');
    
    return [
      ...localServers.map(server => ({ ...server, protocol: 'local' } as LocalConfig)),
      ...sshServers.map(server => ({ ...server, protocol: 'ssh' } as SshHostConfig)),
      ...ssmServers.map(server => ({ ...server, protocol: 'ssm', region: config.get('ssm.region') } as SsmTargetConfig)),
    ];
  }

  static getServerConfig(host: string): ServerConfig | undefined {
    const servers = ServerManager.listAvailableServers();
    serverManagerDebug('Searching for server with host: ' + host);
    const foundServer = servers.find(server => server.host === host);
    if (foundServer) {
      serverManagerDebug('Found server: ' + foundServer.host);
    } else {
      serverManagerDebug('Server not found: ' + host);
    }
    return foundServer;
  }
}

export default ServerManager;
