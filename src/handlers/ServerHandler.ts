import AWS from 'aws-sdk';
import config from 'config';
import { ServerConfig, SystemInfo } from '../types';
import debug from 'debug';
const serverHandlerDebug = debug('app:ServerHandler');

export abstract class ServerHandler {
  protected currentDirectory: string = "";
  protected serverConfig: ServerConfig;
  protected identifier: string;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
  }

  // Method to list available servers
  public static listAvailableServers(): ServerConfig[] {
    const servers: ServerConfig[] = config.get('serverConfig');
    if (!servers || servers.length === 0) {
      throw new Error('No server configurations available.');
    }
    return servers;
  }

  public static async getInstance(host: string): Promise<ServerHandler> {
    if (!host) {
      throw new Error('Host is undefined.');
    }
  
    const serverConfig = await this.getServerConfig(host);
    if (!serverConfig) {
      throw new Error(`Server configuration not found for host: ${host}`);
    }
  
    serverHandlerDebug(`Retrieved server config for host ${host}:`, serverConfig);

    if (host === 'localhost') {
      const { default: LocalServerHandler } = await import('./LocalServerHandler');
      return new LocalServerHandler(serverConfig);
    } else {
      switch (serverConfig.protocol) { // serverConfig is now resolved
        case 'ssh':
          const { default: SshServerHandler } = await import('./SshServerHandler');
          return new SshServerHandler(serverConfig);
        case 'ssm':
          const { default: SsmServerHandler } = await import('./SsmServerHandler');
          return new SsmServerHandler(serverConfig);
        default:
          throw new Error(`Unsupported protocol: ${serverConfig.protocol}`);
      }
    }
  }

  private static async getServerConfig(host: string): Promise<ServerConfig> {
    const servers = this.listAvailableServers();
    const serverConfig = servers.find(configItem => configItem.host === host);
    if (!serverConfig) {
      throw new Error(`Server with host '${host}' not in predefined list.`);
    }

    // Check if it's an SSM server without an instanceId
    if (serverConfig.protocol === 'ssm' && !serverConfig.instanceId) {
      const ec2 = new AWS.EC2({ region: serverConfig.region });
      const params = {
        Filters: [{ Name: 'tag:Name', Values: [host] }]
      };

      try {

        const response = await ec2.describeInstances(params).promise();
        if (!response.Reservations || response.Reservations.length === 0) {
          throw new Error(`No EC2 instance found with name '${host}'`);
        }
        const instances = response.Reservations[0].Instances;
        if (!instances || instances.length === 0) {
          throw new Error(`No EC2 instances found for reservation with name '${host}'`);
        }
        const instanceId = instances[0].InstanceId;
        if (!instanceId) {
          throw new Error(`Instance ID not found for EC2 instance with name '${host}'`);
        }

        serverConfig.instanceId = instanceId;

      } catch (error) {
        console.error(`Error retrieving instance ID for server '${host}':`, error);
        throw error;
      }
    }

    return serverConfig;
  }

  setCurrentDirectory(directory: string): boolean {
    this.currentDirectory = directory;
    return true;
  }

  getCurrentDirectory(): Promise<string> {
    return Promise.resolve(this.currentDirectory);
  }

  // Abstract methods declarations (to be implemented by derived classes)
  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;
  async listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]> {
    throw new Error("listFiles operation is not supported by this server handler.");
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = false): Promise<boolean> {
    throw new Error("createFile operation is not supported by this server handler.");
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = false): Promise<boolean> {
    throw new Error("updateFile operation is not supported by this server handler.");
  }

  async amendFile(filePath: string, content: string, backup: boolean = false): Promise<boolean> {
    throw new Error("amendFile operation is not supported by this server handler.");
  }  
  
  abstract getSystemInfo(): Promise<SystemInfo>;
}