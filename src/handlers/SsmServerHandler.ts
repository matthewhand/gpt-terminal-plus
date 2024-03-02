import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import * as AWS from 'aws-sdk';
import Debug from 'debug';

const debug = Debug('app:SsmServerHandler');

export default class SsmServerHandler extends ServerHandler {
  private ssmClient: AWS.SSM;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.ssmClient = new AWS.SSM({ region: serverConfig.region || 'us-west-2' });
    debug('SSM Server Handler initialized for:', serverConfig.host);
  }
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {

    debug('Executing command:', command, 'on directory:', directory);
    if (!command) {
      throw new Error('No command provided for execution.');
    }
    if (!this.serverConfig.instanceId) {
      throw new Error('Instance ID is undefined. Unable to execute command.');
    }
    
    if (!command) {
      throw new Error('No command provided for execution.');
    }
    if (!this.serverConfig.instanceId) {
      throw new Error('Instance ID is undefined. Unable to execute command.');
    }

    const documentName = this.serverConfig.posix ? 'AWS-RunShellScript' : 'AWS-RunPowerShellScript';
    const formattedCommand = this.serverConfig.posix
      ? (directory ? `cd ${directory}; ${command}` : command)
      : (directory ? `Set-Location -Path '${directory}'; ${command}` : command);

    const params = {
      InstanceIds: [this.serverConfig.instanceId],
      DocumentName: documentName,
      Parameters: { commands: [formattedCommand] },
    };

    const commandResponse = await this.ssmClient.sendCommand(params).promise();

    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
      throw new Error('Failed to retrieve command response or CommandId is undefined. Command execution failed.');
    }

    return await this.fetchCommandResult(commandResponse.Command.CommandId, this.serverConfig.instanceId);
  }

  private async fetchCommandResult(commandId: string, instanceId: string): Promise<{ stdout: string; stderr: string }> {
    let retries = 10;
    while (retries > 0) {
      const result = await this.ssmClient.getCommandInvocation({
        CommandId: commandId,
        InstanceId: instanceId,
      }).promise();
  
      // Check if the command result is available and the status is final
      if (result && result.Status && ['Success', 'Failed', 'Cancelled', 'TimedOut'].includes(result.Status)) {
        return {
          stdout: result.StandardOutputContent ? result.StandardOutputContent.trim() : '',
          stderr: result.StandardErrorContent ? result.StandardErrorContent.trim() : ''
        };
      }
      retries--;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Timeout while waiting for command result');
  }
  
  // Updated listFiles method
  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    debug(`Listing files in directory: ${directory}, limit: ${limit}, offset: ${offset}, orderBy: ${orderBy}`);
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const allFiles = await this.fileOperations.listFiles(directory);

      // Placeholder for orderBy implementation, assuming allFiles is an array of filenames
      let orderedFiles = allFiles;
      if (orderBy === "datetime") {
        // Implement sorting by datetime if metadata available
        debug('Ordering by datetime not implemented.');
      } else {
        orderedFiles = allFiles.sort();
      }

      const slicedFiles = orderedFiles.slice(offset, offset + limit);
      return slicedFiles;
    } catch (error) {
      debug(`Error listing files in ${directory}: ${error}`);
      throw new Error('Failed to list files.');
    }
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<void> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this.fileOperations.createFile(path.join(directory, filename), content, backup);
      debug(`File ${filename} created successfully in ${directory}.`);
    } catch (error) {
      debug(`Error creating file ${filename} in ${directory}: ${error}`);
      throw new Error('Failed to create file.');
    }
  }

  async readFile(remotePath: string): Promise<string> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const content = await this.fileOperations.readFile(remotePath);
      debug(`File ${remotePath} read successfully.`);
      return content;
    } catch (error) {
      debug(`Error reading file ${remotePath}: ${error}`);
      throw new Error('Failed to read file.');
    }
  }

  async updateFile(remotePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<void> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this.fileOperations.updateFile(remotePath, pattern, replacement, backup);
      debug(`File ${remotePath} updated successfully.`);
    } catch (error) {
      debug(`Error updating file ${remotePath}: ${error}`);
      throw new Error('Failed to update file.');
    }
  }

  // Continue with other methods such as deleteFile, fileExists, getSystemInfo, and amendFile.
  async deleteFile(remotePath: string): Promise<void> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this.fileOperations.deleteFile(remotePath);
      debug(`File ${remotePath} deleted successfully.`);
    } catch (error) {
      debug(`Error deleting file ${remotePath}: ${error}`);
      throw new Error('Failed to delete file.');
    }
  }

  async fileExists(remotePath: string): Promise<boolean> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      const exists = await this.fileOperations.fileExists(remotePath);
      debug(`File ${remotePath} exists check: ${exists}`);
      return exists;
    } catch (error) {
      debug(`Error checking if file ${remotePath} exists: ${error}`);
      throw new Error('Failed to check if file exists.');
    }
  }

  async getSystemInfo(): Promise<SystemInfo> {
    if (!this.systemInfoRetriever) {
      debug('SSHSystemInfoRetriever not initialized.');
      throw new Error("SSHSystemInfoRetriever is not initialized.");
    }

    try {
      const systemInfo = await this.systemInfoRetriever.getSystemInfo();
      debug('System information retrieved successfully:', systemInfo);
      return systemInfo;
    } catch (error) {
      debug('Error retrieving system information:', error);
      throw new Error('Failed to retrieve system information.');
    }
  }

  async amendFile(filePath: string, content: string, backup: boolean = true): Promise<void> {
    if (!this.fileOperations) {
      debug('SSHFileOperations not initialized.');
      throw new Error("SSHFileOperations is not initialized.");
    }

    try {
      await this.fileOperations.amendFile(filePath, content, backup);
      debug(`File ${filePath} amended successfully.`);
    } catch (error) {
      debug(`Error amending file ${filePath}: ${error}`);
      throw new Error('Failed to amend file.');
    }
  }

  async executeCommand(command: string, timeout: number = 60000, directory?: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.commandExecutor) {
      debug('SSHCommandExecutor not initialized.');
      throw new Error("SSHCommandExecutor is not initialized.");
    }

    try {
      const { stdout, stderr } = await this.commandExecutor.executeCommand(command, { cwd: directory, timeout });
      debug(`Command executed successfully: ${command}`);
      return { stdout, stderr };
    } catch (error) {
      debug(`Error executing command ${command}: ${error}`);
      throw new Error('Failed to execute command.');
    }
  }
}
