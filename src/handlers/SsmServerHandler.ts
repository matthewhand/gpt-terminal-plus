import * as os from 'os';

// Assuming the correct relative paths based on your project structure
import { ServerHandler } from '../handlers/ServerHandler'; // Adjusted path
import { ServerConfig, SystemInfo } from '../types'; // Adjusted path
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

            if (result && result.Status && ['Success', 'Failed', 'Cancelled', 'TimedOut'].includes(result.Status)) {
                return {
                    stdout: result.StandardOutputContent ? result.StandardOutputContent.trim() : '',
                    stderr: result.StandardErrorContent ? result.StandardErrorContent.trim() : ''
                };
            }
            retries--;
            await new Promise(resolve => setTimeout(resolve, 20000)); // TODO make configuration
        }
        throw new Error('Timeout while waiting for command result');
    }

    async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: "datetime" | "filename" = "filename"): Promise<string[]> {
      // Your implementation seems to match a common abstract signature for listFiles.
      const command = `ls -l ${directory} | tail -n +${offset + 1} | head -n ${limit}`;
      const { stdout } = await this.executeCommand(command);
      // Adjusting parsing to safely handle potentially undefined values
      return stdout.split('\n').filter(line => line).map(line => {
          const parts = line.split(/\s+/);
          return parts.pop() || ""; // Ensures a string is returned, not string | undefined
      });
  }
  
  async createFile(directory: string, filename: string, content: string, backup: boolean = false): Promise<boolean> {
    console.error("Create file operation is not supported for SSM Server Handler.");
    return false; // Or throw new Error("Not supported");
}
  
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<boolean> {
      // Assuming the abstract definition expects a boolean return type for updateFile.
      const command = `${backup ? `cp ${filePath} ${filePath}.bak && ` : ''}sed -i 's/${pattern}/${replacement}/g' ${filePath}`;
      await this.executeCommand(command);
      return true;
  }
  
  async amendFile(filePath: string, content: string, backup: boolean = false): Promise<boolean> {
    throw new Error("This operation is not supported by the current server handler.");
  }  

      parseSystemInfo(info: string, isPosix: boolean): SystemInfo {
        // Placeholder: Implement parsing logic based on output format
        // The parsing will differ significantly between POSIX and non-POSIX outputs
        // Return a SystemInfo object based on parsed information
        return {
            homeFolder: os.homedir(),
            type: os.type(),
            release: os.release(),
            platform: os.platform(),
            architecture: os.arch(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
            currentFolder: process.cwd(),
            // Other fields like `pythonVersion` or `powershellVersion` can be filled as needed
        };
    }

    async getSystemInfo(): Promise<SystemInfo> {
      // Choose the command based on the posix flag and system type
      const command = this.serverConfig.posix ? 'uname -a && df -h && free -m' : 'Get-CimInstance Win32_OperatingSystem | Format-List *';
      const { stdout } = await this.executeCommand(command);
      // For simplicity, let's assume POSIX system parsing only in this example
      if (this.serverConfig.posix) {
          // Example parsing logic for POSIX systems (this is overly simplified)
          const lines = stdout.split('\n');
          const systemInfo = {
              os: lines[0] || 'Unknown',
              disk: lines[1] || 'Unknown',
              memory: lines[2] || 'Unknown',
              // You might want to implement more detailed parsing logic here
          };
          return {
              homeFolder: process.env.HOME || '/',
              type: systemInfo.os,
              release: 'N/A', // Extract from systemInfo if needed
              platform: systemInfo.os.split(' ')[0], // Simplified example
              architecture: process.arch,
              totalMemory: parseInt(systemInfo.memory.split(' ')[1], 10), // Simplified example
              freeMemory: parseInt(systemInfo.memory.split(' ')[3], 10), // Simplified example
              uptime: process.uptime(),
              currentFolder: process.cwd(),
              // Add additional parsing logic as needed
          };
      } else {
          // Add parsing logic for non-POSIX systems if necessary
          return {
              homeFolder: 'N/A',
              type: 'Windows', // This is a simplification
              release: 'N/A',
              platform: 'N/A',
              architecture: 'N/A',
              totalMemory: 0,
              freeMemory: 0,
              uptime: 0,
              currentFolder: 'N/A',
              // Additional Windows-specific parsing logic here
          };
      }
  }

  async deleteFile(filePath: string): Promise<boolean> {
      // Assuming the abstract definition expects a boolean return type for deleteFile.
      const command = `rm -f ${filePath}`;
      await this.executeCommand(command);
      return true;
  }
  
  async fileExists(filePath: string): Promise<boolean> {
      // Assuming the abstract definition expects a boolean return type for fileExists.
      const command = `test -f ${filePath} && echo "exists" || echo "not exists"`;
      const { stdout } = await this.executeCommand(command);
      return stdout.trim() === "exists";
  }
  

}
