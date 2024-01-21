import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import * as AWS from 'aws-sdk';

export default class SsmServerHandler extends ServerHandler {
  private ssmClient: AWS.SSM;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.ssmClient = new AWS.SSM({ region: serverConfig.region || 'us-west-2' });
  }

  /**
   * Executes a shell command on the SSM instance.
   * @param command The command to execute.
   * @returns An object containing stdout and stderr from the command execution.
   * @throws Error if command execution fails.
   */
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
    // Implement sanitization logic here
    // For example, escape special shell characters
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

  /**
   * Retrieves system information from the SSM instance.
   * Only executes if the server is configured for a POSIX environment.
   * @returns System information including uptime and memory usage.
   * @throws Error if unable to retrieve system information.
   */
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
        const osInfo = osInfoResult.stdout.split('\n').reduce((acc, line) => {
          const [key, value] = line.split('=');
          acc[key.trim()] = value?.replace(/"/g, '').trim();
          return acc;
        }, {});
        const cpuModel = cpuInfoResult.stdout.split(':')[1].trim();

        return {
          uptime: uptimeInSeconds,
          totalMemory: parseInt(memoryInfo[1]),
          usedMemory: parseInt(memoryInfo[2]),
          freeMemory: parseInt(memoryInfo[3]),
          diskUsage: diskUsageInfo[4],
          osName: osInfo['PRETTY_NAME'],
          osVersion: osInfo['VERSION_ID'],
          architecture: osInfo['ARCHITECTURE'] || this.serverConfig.architecture,
          cpuModel: cpuModel,
          currentFolder: this.currentDirectory,
        };
      } catch (error) {
        console.error('Error retrieving system info:', error);
        throw error;
      }
    } else {
      return {
        uptime: 0,
        totalMemory: 0,
        usedMemory: 0,
        freeMemory: 0,
        diskUsage: '',
        osName: '',
        osVersion: '',
        architecture: '',
        cpuModel: '',
        currentFolder: this.currentDirectory,
      };
    }
  }

}