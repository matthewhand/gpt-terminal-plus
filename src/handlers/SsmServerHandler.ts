import * as ssmUtils from '../utils/ssmUtils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
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

  // Utility method to determine the script extension based on server config
  private determineScriptExtension(): string {
    switch (this.serverConfig.shell) {
      case 'powershell': return '.ps1';
      case 'python': return '.py';
      default: return '.sh';
    }
  }

  // Generates the correct command based on the server shell environment
  private getExecuteCommand(filePath: string): string {
    switch (this.serverConfig.shell) {
      case 'powershell': return `Powershell -File ${filePath}`;
      case 'python': return `python ${filePath}`;
      default: return `bash ${filePath}`;
    }
  }

  // Method to handle the creation and execution of files
  async uploadAndExecuteScript(scriptContent: string, scriptExtension: string, directory?: string): Promise<string> {
    const tempFileName = `${uuidv4()}${scriptExtension}`;
    const tempDirectory = directory || this.serverConfig.posix ? '/tmp' : this.serverConfig.homeFolder || '.';
    const tempFilePath = path.join(tempDirectory, tempFileName);

    try {
      // Create the temporary script file
      await this.createFile(tempDirectory, tempFileName, scriptContent, false);
      
      // Generate the command to execute the script
      const executeCommand = this.getExecuteCommand(tempFilePath);
      
      // Execute the script and handle the response
      const { stdout, stderr } = await this.executeCommand(executeCommand, { directory: tempDirectory });

      // Check for output from the script and handle errors
      if (!stdout) {
        throw new Error(`Script did not produce output. stderr: ${stderr}`);
      }

      // Clean up the temporary script file
      await this.executeCommand(`rm -f ${tempFilePath}`, { directory: tempDirectory });
      return stdout;
    } catch (error) {
      // Ensure the temporary file is removed even if execution fails
      await this.executeCommand(`rm -f ${tempFilePath}`, { directory: tempDirectory });
      debug('Error during script execution:', error);
      throw error;  // Rethrow to maintain error handling outside this function
    }
}

async executeCommand(
  command: string,
  options: {
    timeout?: number,  // Making timeout optional
    directory?: string,
    linesPerPage?: number
  } = { timeout: 30 }  // Providing a default value for the entire options object
): Promise<{
  stdout?: string,
  stderr?: string,
  pages?: string[],
  totalPages?: number,
  responseId?: string
}> {
  debug('Preparing to execute command:', command, 'with options:', options);

  if (!command) {
    throw new Error('No command provided for execution.');
  }

  const instanceId = this.serverConfig.instanceId;
  if (!instanceId) {
    throw new Error('Instance ID is undefined. Unable to execute command.');
  }

  const documentName = this.serverConfig.posix ? 'AWS-RunShellScript' : 'AWS-RunPowerShellScript';
  const formattedCommand = options.directory ? `cd ${options.directory}; ${command}` : command;
  const { timeout = 30 } = options; // Use destructuring to handle undefined timeout

  try {
    const result = await ssmUtils.executeCommand(
      this.ssmClient,
      formattedCommand,
      instanceId,
      documentName,
      timeout,
      options.directory
    );

    if (options.linesPerPage) {
      const lines = result.stdout?.split('\n') || [];
      const pages = [];
      for (let i = 0; i < lines.length; i += options.linesPerPage) {
        pages.push(lines.slice(i, i + options.linesPerPage).join('\n'));
      }
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        pages,
        totalPages: pages.length,
        responseId: this.generateResponseId()
      };
    }

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      responseId: this.generateResponseId()
    };
  } catch (error) {
    debug('Error executing command:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
  
    // Method to list files in a specified directory
    async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: string = "filename"): Promise<{ items: string[]; totalPages: number; responseId: string }> {
      const listCommand = this.serverConfig.posix
        ? `ls -al ${directory} | tail -n +2`
        : `Get-ChildItem -Path '${directory}' -File | Select-Object -ExpandProperty Name`;
  
      const { stdout } = await this.executeCommand(listCommand);
      let files = stdout?.split('\n').filter(line => line.trim().length > 0) || [];
  
      if (orderBy === 'datetime') {
        files = await this.sortFilesByDate(directory, files);
      } else {
        files.sort();
      }
  
      const paginatedFiles = files.slice(offset, offset + limit);
      const totalPages = Math.ceil(files.length / limit);
      const responseId = uuidv4();
  
      return { items: paginatedFiles, totalPages, responseId };
    }
  
    // Helper method to sort files by date
    private async sortFilesByDate(directory: string, files: string[]): Promise<string[]> {
      const filesWithStats = await Promise.all(files.map(async fileName => {
        const fullPath = path.join(directory, fileName);
        const stats = await fs.promises.stat(fullPath);
        return { name: fileName, mtime: stats.mtime };
      }));
      filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      return filesWithStats.map(file => file.name);
    }
  
    // Method to update a file content by replacing a specific pattern
    async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
      const updateCommand = this.serverConfig.posix
        ? (backup ? `cp ${filePath}{,.bak} && sed -i 's/${pattern}/${replacement}/g' ${filePath}` : `sed -i 's/${pattern}/${replacement}/g' ${filePath}`)
        : (backup ? `Copy-Item -Path ${filePath} -Destination ${filePath}.bak; (Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}` : `(Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}`);
  
      await this.executeCommand(updateCommand);
      return true;
    }
  
    // Method to append content to a file
    async amendFile(filePath: string, content: string): Promise<boolean> {
      const amendCommand = this.serverConfig.posix
        ? `echo "${content}" >> ${filePath}`
        : `Add-Content ${filePath} '${content}'`;
      await this.executeCommand(amendCommand);
      return true;
    }
  
    async getSystemInfo(): Promise<SystemInfo> {
      const scriptExtension = this.determineScriptExtension();
      const scriptPath = path.join(__dirname, '../scripts/remote_system_info');
      const fullScriptPath = `${scriptPath}${scriptExtension}`;
    
      try {
        const scriptContent = fs.readFileSync(fullScriptPath, 'utf-8');
        const systemInfo = await this.uploadAndExecuteScript(scriptContent, scriptExtension, this.serverConfig.homeFolder);
        return JSON.parse(systemInfo);
      } catch (error) {
        debug('Error retrieving system info:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to retrieve system information: ${error.message}`);
        } else {
          throw new Error('Failed to retrieve system information due to an unknown error');
        }
      }
    }
    
      // Ensures all abstract methods are implemented
      async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
        try {
            const filePath = path.join(directory, filename);
            if (backup) {
                const backupPath = `${filePath}.bak`;
                fs.copyFileSync(filePath, backupPath);
            }
            fs.writeFileSync(filePath, content);
            return true; // Indicate success
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error creating file:", error.message);
          } else {
              // Handle cases where the error is not an Error object
              console.error("An unexpected error occurred:", error);
          }
          return false; // Indicate failure
        }
    }
        
  }