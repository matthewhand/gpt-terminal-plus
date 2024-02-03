import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import * as AWS from 'aws-sdk';
import Debug from 'debug';

}const debug = Debug('app:SsmServerHandler');

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
  
  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
    const listCommand = this.serverConfig.posix
      ? `ls -al ${directory} | tail -n +2`
      : `Get-ChildItem -Path '${directory}' -File | Select-Object -ExpandProperty Name`;

    const { stdout } = await this.executeCommand(listCommand);
    const files = stdout.split('\n').filter(line => line).slice(offset, offset + limit);
    return files;
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    const filePath = `${directory}/${filename}`;
    const createCommand = this.serverConfig.posix
      ? `echo "${content}" > ${filePath}`
      : `Set-Content -Path '${filePath}' -Value '${content}'`;

    await this.executeCommand(createCommand);
    return true;
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
    // Placeholder implementation
    return Promise.resolve(false);
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    // Placeholder implementation
    return Promise.resolve(false);
  }

  async getSystemInfo(): Promise<SystemInfo> {
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
  
      if (this.serverConfig.posix) {
        // POSIX commands
        const uptimeResult = await this.executeCommand('cat /proc/uptime | cut -d " " -f 1');
        if (uptimeResult && uptimeResult.stdout) {
          systemInfo.uptime = parseFloat(uptimeResult.stdout.trim());
        }
        
        const memResult = await this.executeCommand('free -m | grep Mem');
        const memParts = memResult.stdout.split(/\s+/);
        systemInfo.totalMemory = parseInt(memParts[1]);
        systemInfo.freeMemory = parseInt(memParts[3]);
  
        const osResult = await this.executeCommand('uname -a');
        systemInfo.type = osResult.stdout.trim();
  
        const cpuResult = await this.executeCommand('lscpu | grep "Model name"');
        systemInfo.cpuModel = cpuResult.stdout.split(':')[1].trim();
        
        // Additional commands can be added as needed
      } else {
        // Windows commands
        const systemInfoJson = await this.executeCommand('Get-ComputerInfo | Select-Object CsTotalPhysicalMemory, OsName, OsVersion, CsName, OsArchitecture | ConvertTo-Json');
        const winSystemInfo = JSON.parse(systemInfoJson.stdout);
  
        systemInfo.totalMemory = winSystemInfo.CsTotalPhysicalMemory / (1024 * 1024); // Convert bytes to MB
        systemInfo.type = winSystemInfo.OsName;
        systemInfo.release = winSystemInfo.OsVersion;
        systemInfo.cpuModel = winSystemInfo.CsName;
        systemInfo.architecture = winSystemInfo.OsArchitecture;
        
        // Since Windows does not have an uptime command like Linux, you might need to calculate it differently
        // For example, you can use the system boot time to calculate uptime
      }
  
      return systemInfo;
    } catch (error) {
      console.error('Error retrieving system info:', error);
      throw error;
    }
  }
  
}
