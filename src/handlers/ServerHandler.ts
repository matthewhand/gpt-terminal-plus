import AWS from 'aws-sdk';
import config from 'config';
import { CommandConfig, ServerConfig, SystemInfo } from '../types';
import debug from 'debug';
const serverHandlerDebug = debug('app:ServerHandler');
import { v4 as uuidv4 } from 'uuid';

/**
 * Abstract class representing a server handler.
 * @abstract
 */
export abstract class ServerHandler {
  protected defaultDirectory: string = "";
  protected serverConfig: ServerConfig;
  protected identifier: string;

  /**
   * Creates an instance of ServerHandler.
   * @param {ServerConfig} serverConfig - The server configuration.
   */
  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
  }

  /**
   * Generates a unique response ID for each operation.
   * @returns {string} A string representing a unique response ID.
   */
  protected generateResponseId(): string {
    return uuidv4();  // Generates a unique ID for each response
  }

  /**
   * Applies pagination to the provided list of items and returns a paginated response.
   * @template T
   * @param {T[]} items - The list of items to paginate.
   * @param {number} totalCount - The total count of items across all pages.
   * @param {number} limit - The number of items per page.
   * @returns {{ items: T[], totalPages: number, responseId: string }} An object containing the paginated items, total pages, and a response ID.
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

  /**
   * Lists available servers from the configuration.
   * @static
   * @returns {ServerConfig[]} An array of server configurations.
   * @throws {Error} If no server configurations are available.
   */
  public static listAvailableServers(): ServerConfig[] {
    const servers: ServerConfig[] = config.get('serverConfig');
    if (!servers || servers.length === 0) {
      throw new Error('No server configurations available.');
    }
    return servers;
  }

  /**
   * Lists available commands from the configuration.
   * @static
   * @returns {CommandConfig[]} An array of command configurations.
   * @throws {Error} If no command configurations are available.
   */
  public static listAvailableCommands(): CommandConfig[] {
    const commands: CommandConfig[] = config.get('commands');
    if (!commands || commands.length === 0) {
      throw new Error('No command configurations available.');
    }
    return commands;
  }

  /**
   * Retrieves a ServerHandler instance for the specified host.
   * @static
   * @param {string} host - The host to retrieve the server handler for.
   * @returns {Promise<ServerHandler>} A promise that resolves to a ServerHandler instance.
   * @throws {Error} If the host is undefined or the server configuration is not found.
   */
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

  /**
   * Retrieves the server configuration for the specified host.
   * @static
   * @param {string} host - The host to retrieve the server configuration for.
   * @returns {Promise<ServerConfig>} A promise that resolves to a ServerConfig object.
   * @throws {Error} If the server configuration is not found or an error occurs while retrieving the instance ID.
   */
  public static async getServerConfig(host: string): Promise<ServerConfig> {
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

  /**
   * Sets the default directory.
   * @param {string} directory - The directory to set as the default.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  async setDefaultDirectory(directory: string): Promise<boolean> {
    serverHandlerDebug(`Setting default directory to ${directory}`);
    this.defaultDirectory = directory;
    // Simulate immediate success
    return Promise.resolve(true);
  }

  /**
   * Gets the default directory.
   * @returns {Promise<string>} A promise that resolves to the default directory.
   */
  getDefaultDirectory(): Promise<string> {
    serverHandlerDebug(`Getting default directory: ${this.defaultDirectory}`);
    return Promise.resolve(this.defaultDirectory);
  }

  /**
   * Executes a command on the server and returns the results.
   * @abstract
   * @param {string} command - The command to be executed.
   * @param {Object} options - An object containing optional parameters:
   * @param {number} [options.timeout] - The maximum time in milliseconds to wait for the command to complete.
   * @param {string} [options.directory] - The directory from which the command should be executed.
   * @param {number} [options.linesPerPage] - The number of lines per page if output needs pagination.
   * @returns {Promise<{ stdout?: string, stderr?: string, pages?: string[], totalPages?: number, responseId?: string }>} A promise that resolves to an object containing command output details, and optionally pagination details if linesPerPage is provided.
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

  /**
   * Lists files in the specified directory.
   * @abstract
   * @param {string} directory - The directory to list files in.
   * @param {number} limit - The maximum number of files to return.
   * @param {number} offset - The offset for pagination.
   * @param {string} orderBy - The order by criteria.
   * @returns {Promise<{ items: string[], totalPages: number, responseId: string }>} A promise that resolves to an object containing the list of files, total pages, and a response ID.
   */
  abstract listFiles(directory: string, limit: number, offset: number, orderBy: string): Promise<{ items: string[], totalPages: number, responseId: string }>;

  /**
   * Creates a file with the specified content.
   * @abstract
   * @param {string} directory - The directory to create the file in.
   * @param {string} filename - The name of the file to create.
   * @param {string} content - The content to write to the file.
   * @param {boolean} backup - Whether to create a backup of the existing file.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;

  /**
   * Updates a file by replacing a pattern with a replacement string.
   * @abstract
   * @param {string} filePath - The path of the file to update.
   * @param {string} pattern - The text pattern to be replaced.
   * @param {string} replacement - The new text to replace the pattern.
   * @param {boolean} backup - Whether to create a backup of the file before updating.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;

  /**
   * Appends content to a file.
   * @abstract
   * @param {string} filePath - The path of the file to append content to.
   * @param {string} content - The content to append to the file.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  abstract amendFile(filePath: string, content: string): Promise<boolean>;

  /**
   * Retrieves system information.
   * @abstract
   * @returns {Promise<SystemInfo>} A promise that resolves to an object containing system information.
   */
  abstract getSystemInfo(): Promise<SystemInfo>;
}
