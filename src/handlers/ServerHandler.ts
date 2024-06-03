import AWS from 'aws-sdk';
import config from 'config';
import { ServerConfig, SystemInfo } from '../types';
import debug from 'debug';
const serverHandlerDebug = debug('app:ServerHandler');
import { v4 as uuidv4 } from 'uuid';

export abstract class ServerHandler {
  protected defaultDirectory: string = "";
  protected serverConfig: ServerConfig;
  protected identifier: string;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
  }

  /**
   * Generates a unique response ID for each operation.
   * @returns A string representing a unique response ID.
   */
  protected generateResponseId(): string {
    return uuidv4();  // Generates a unique ID for each response
  }

  /**
   * Applies pagination to the provided list of items and returns a paginated response.
   * @param items The list of items to paginate.
   * @param totalCount The total count of items across all pages.
   * @param limit The number of items per page.
   * @returns An object containing the paginated items, total pages, and a response ID.
   */
  protected paginateResponse<T>(items: T[], totalCount: number, limit: number): { items: T[], totalPages: number, responseId: string } {
    const totalPages = Math.ceil(totalCount / limit);
    const responseId = this.generateResponseId();
    return {
      items,
      totalPages,
      responseId
    };
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

  setDefaultDirectory(directory: string, callback: (success: boolean) => void): void {
    serverHandlerDebug(`Setting default directory to ${directory}`);
    this.defaultDirectory = directory;
    // Simulate immediate success
    callback(true);
  }

  getDefaultDirectory(): Promise<string> {
    serverHandlerDebug(`Getting default directory: ${this.defaultDirectory}`);
    return Promise.resolve(this.defaultDirectory);
  }

  /**
   * Executes a command on the server and returns the results.
   * @param command The command to be executed.
   * @param options An object containing optional parameters:
   *                - timeout: The maximum time in milliseconds to wait for the command to complete.
   *                - directory: The directory from which the command should be executed.
   *                - linesPerPage: The number of lines per page if output needs pagination.
   * @returns A promise that resolves to an object containing command output details,
   *          and optionally pagination details if linesPerPage is provided.
   */
  abstract executeCommand(
    command: string,
    options: {
      timeout?: number,
      directory?: string,
      linesPerPage?: number
    }
  ): Promise<{
    stdout?: string,
    stderr?: string,
    pages?: string[],
    totalPages?: number,
    responseId?: string
  }>;

  abstract listFiles(directory: string, limit: number, offset: number, orderBy: string): Promise<{ items: string[], totalPages: number, responseId: string }>;

  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  abstract amendFile(filePath: string, content: string): Promise<boolean>;
  abstract getSystemInfo(): Promise<SystemInfo>;
}
