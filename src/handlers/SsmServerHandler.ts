import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import AWS from 'aws-sdk';

export default class SsmServerHandler extends ServerHandler {
  private ssmClient: AWS.SSM;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.ssmClient = new AWS.SSM({ region: serverConfig.region });
  }

  async executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.serverConfig.instanceId) {
      throw new Error('Instance ID is undefined');
    }

    const fullCommand = this.currentDirectory ? `cd ${this.currentDirectory}; ${command}` : command;
    const params = {
      InstanceIds: [this.serverConfig.instanceId],
      DocumentName: 'AWS-RunShellScript',
      Parameters: { commands: [fullCommand] },
    };
    const commandResponse = await this.ssmClient.sendCommand(params).promise();
    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
	      throw new Error('Failed to retrieve command response or CommandId is undefined');
    }
    return this.fetchCommandResult(commandResponse.Command.CommandId, this.serverConfig.instanceId);
  }

  private async fetchCommandResult(commandId: string, instanceId: string): Promise<{ stdout: string; stderr: string }> {
    let retries = 10;
    while (retries > 0) {
      const result = await this.ssmClient.getCommandInvocation({
        CommandId: commandId,
        InstanceId: instanceId,
      }).promise();
      if (['Success', 'Failed'].includes(result.Status)) {
        return {
          stdout: result.StandardOutputContent || '',
          stderr: result.StandardErrorContent || ''
        };
      }
      retries--;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Timeout while waiting for command result');
  }

  // Simplify other methods due to SSM limitations
  setCurrentDirectory(directory: string): boolean {
    this.currentDirectory = directory;
    return true;
  }

  async getCurrentDirectory(): Promise<string> {
    return this.currentDirectory;
  }

  async listFiles(directory: string): Promise<string[]> {
    return this.executeCommand(`ls -1 ${directory}`).then(res => res.stdout.split('\n').filter(Boolean));
  }

  // For createFile, updateFile, and amendFile, provide a warning or limited functionality
  async createFile(directory: string, filename: string, content: string): Promise<boolean> {
    console.warn('SSM createFile operation is limited');
    return this.executeCommand(`echo "${content}" > ${directory}/${filename}`).then(() => true);
  }

  async updateFile(filePath: string, pattern: string, replacement: string): Promise<boolean> {
    console.warn('SSM updateFile operation is not supported');
    return false;
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    console.warn('SSM amendFile operation is not supported');
    return false;
  }

  async getSystemInfo(): Promise<SystemInfo> {
    console.warn('SSM getSystemInfo may have limited data');
    // Implement a basic system info retrieval, or return a fixed structure
    // based on the expected environment
    return this.executeCommand('uname -a').then(res => this.parseSystemInfo(res.stdout));
  }

  private parseSystemInfo(info: string): SystemInfo {
    // Parse the system info string into the SystemInfo structure
    // This is a placeholder implementation
    return {
      homeFolder: '',
      type: '',
      release: '',
      platform: '',
      cpuArchitecture: '',
      totalMemory: 0,
      freeMemory: 0,
      uptime: 0,
      currentFolder: this.currentDirectory,
    };
  }
}

