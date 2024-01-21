import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import * as AWS from 'aws-sdk';

export default class SsmServerHandler extends ServerHandler {
  private ssmClient: AWS.SSM;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.ssmClient = new AWS.SSM({ region: serverConfig.region || 'us-west-2' });
  }

  async executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    if (!command) {
      throw new Error('No command provided for execution.');
    }
    if (!this.serverConfig.instanceId) {
      throw new Error('Instance ID is undefined. Unable to execute command.');
    }

    const sanitizedCommand = this.sanitizeCommand(command);
    const fullCommand = this.currentDirectory ? `cd ${this.currentDirectory}; ${sanitizedCommand}` : sanitizedCommand;
    const params = {
      InstanceIds: [this.serverConfig.instanceId],
      DocumentName: 'AWS-RunShellScript',
      Parameters: { commands: [fullCommand] },
    };
    const commandResponse = await this.ssmClient.sendCommand(params).promise();

    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
      throw new Error('Failed to retrieve command response or CommandId is undefined. Command execution failed.');
    }
    return this.fetchCommandResult(commandResponse.Command.CommandId, this.serverConfig.instanceId);
  }

  private sanitizeCommand(command: string): string {
    return command.replace(/[^a-zA-Z0-9_\-.\s]/g, '');
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

  async getSystemInfo(): Promise<SystemInfo> {
    if (this.serverConfig.posix) {
      try {
        const uptimeCommand = 'cat /proc/uptime | cut -d " " -f 1';
        const memoryCommand = 'free -m | grep Mem';
        const diskUsageCommand = 'df -h | grep /$';
        const osInfoCommand = 'cat /etc/os-release';
        const cpuInfoCommand = 'lscpu | grep "Model name"';

        const uptimeResult = await this.executeCommand(uptimeCommand);
        const memoryResult = await this.executeCommand(memoryCommand);
        const diskUsageResult = await this.executeCommand(diskUsageCommand);
        const osInfoResult = await this.executeCommand(osInfoCommand);
        const cpuInfoResult = await this.executeCommand(cpuInfoCommand);

        const uptimeInSeconds = parseFloat(uptimeResult.stdout.trim());
        const memoryInfo = memoryResult.stdout.split(/\s+/);
        const diskUsageInfo = diskUsageResult.stdout.split(/\s+/);
        const osInfo: { [key: string]: string } = osInfoResult.stdout.split('\n').reduce((acc, line) => {
          const [key, value] = line.split('=');
          if (key && value) {
            acc[key.trim()] = value.replace(/"/g, '').trim();
          }
          return acc;
        }, {});
        const cpuModel = cpuInfoResult.stdout.split(':')[1].trim();

        return {
          uptime: uptimeInSeconds,
          totalMemory: parseInt(memoryInfo[1]),
          freeMemory: parseInt(memoryInfo[3]),
          diskUsage: diskUsageInfo[4],
          osName: osInfo['PRETTY_NAME'] || 'Unknown',
          osVersion: osInfo['VERSION_ID'] || 'Unknown',
          architecture: osInfo['ARCHITECTURE'] || this.serverConfig.architecture || 'Unknown',
          cpuModel: cpuModel,
          currentFolder: this.currentDirectory,
        };
      } catch (error) {
        console.error('Error retrieving system info:', error);
        throw error;
      }
    } else {
      return this.getDefaultSystemInfo();
    }
  }

  async getSystemInfo(): Promise<SystemInfo> {
    if (this.serverConfig.posix) {
      // Existing implementation for getting system info
      // Make sure to return an object that matches the SystemInfo interface
      // Remove or modify properties that do not exist in the SystemInfo interface
    } else {
      // Return a default or simplified SystemInfo object for non-posix environments
      return {
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
    }
  }
}
