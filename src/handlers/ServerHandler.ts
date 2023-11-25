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
    host = 'localhost';
  }

  const serverConfig = await this.getServerConfig(host); // Add await here
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

  // Abstract methods...
  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;
  abstract setCurrentDirectory(directory: string): boolean;
  abstract getCurrentDirectory(): Promise<string>;
  abstract listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]>;
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  abstract amendFile(filePath: string, content: string): Promise<boolean>;
  abstract getSystemInfo(): Promise<SystemInfo>;
}

