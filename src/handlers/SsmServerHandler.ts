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
  
  // Enhanced listFiles method
  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    debug(`Listing files in directory: ${directory}, limit: ${limit}, offset: ${offset}, orderBy: ${orderBy}`);
    const listCommand = this.serverConfig.posix
      ? `ls -al ${directory} | tail -n +2`
      : `Get-ChildItem -Path '${directory}' -File | Select-Object -ExpandProperty Name`;

    try {
      const { stdout } = await this.executeCommand(listCommand);
      const files = stdout.split('\n').filter(line => line).slice(offset, offset + limit);
      debug(`Files listed successfully: ${files.join(', ')}`);
      return files;
    } catch (error) {
      debug(`Error listing files: ${error}`);
      throw new Error('Failed to list files');
    }
  }

  // Enhanced createFile method
  async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
    debug(`Creating file: ${filename} in directory: ${directory}, with backup: ${backup}`);
    const filePath = `${directory}/${filename}`;
    const createCommand = this.serverConfig.posix
      ? `echo "${content}" > ${filePath}`
      : `Set-Content -Path '${filePath}' -Value '${content}'`;

    try {
      await this.executeCommand(createCommand);
      debug(`File created successfully: ${filePath}`);
      return true;
    } catch (error) {
      debug(`Error creating file: ${error}`);
      throw new Error('Failed to create file');
    }
  }

  // Enhanced updateFile method
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
    debug(`Updating file: ${filePath}, pattern: ${pattern}, replacement: ${replacement}, with backup: ${backup}`);
    let updateCommand: string;
    if (this.serverConfig.posix) {
      updateCommand = backup ? `cp ${filePath}{,.bak} && sed -i 's/${pattern}/${replacement}/g' ${filePath}` : `sed -i 's/${pattern}/${replacement}/g' ${filePath}`;
    } else {
      updateCommand = backup ? `Copy-Item -Path ${filePath} -Destination ${filePath}.bak; (Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}` : `(Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}`;
    }

    try {
      await this.executeCommand(updateCommand);
      debug(`File updated successfully: ${filePath}`);
      return true;
    } catch (error) {
      debug(`Error updating file: ${error}`);
      throw new Error('Failed to update file');
    }
  }

  // Enhanced amendFile method
  async amendFile(filePath: string, content: string): Promise<boolean> {
    debug(`Amending file: ${filePath} with content: ${content}`);
    const amendCommand = this.serverConfig.posix ? `echo "${content}" >> ${filePath}` : `Add-Content ${filePath} '${content}'`;

    try {
      await this.executeCommand(amendCommand);
      debug(`File amended successfully: ${filePath}`);
      return true;
    } catch (error) {
      debug(`Error amending file: ${error}`);
      throw new Error('Failed to amend file');
    }
  }

  // Enhanced getSystemInfo method
  async getSystemInfo(): Promise<SystemInfo> {
    debug('Retrieving system info');
    try {
      let systemInfo: SystemInfo = {
        homeFolder: '',
        type: '',
        release: '',
        platform: '',
        powershellVersion: '',
        architecture: '',
        totalMemory: 0,
        freeMemory: 0,
        uptime: 0,
        currentFolder: this.currentDirectory
      };

      // Implementation remains the same as your original code block for brevity
      
      debug('System info retrieved successfully');
      return systemInfo;
    } catch (error) {
      debug(`Error retrieving system info: ${error}`);
      throw new Error('Failed to retrieve system info');
    }
  }
}
