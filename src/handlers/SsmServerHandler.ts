import * as ssmUtils from '../utils/ssmUtils'; // Utility functions related to AWS SSM
import * as fs from 'fs';                     // Node.js File System module for file operations
import * as path from 'path';                 // Node.js Path module for handling and transforming file paths
import { v4 as uuidv4 } from 'uuid';          // Importing UUID v4 to generate unique identifiers
import { ServerHandler } from './ServerHandler'; // Base class for server handlers
import { ServerConfig, SystemInfo } from '../types'; // Type definitions for server configuration and system information
import * as AWS from 'aws-sdk';              // AWS SDK for JavaScript
import Debug from 'debug';                   // Debugging utility

const debug = Debug('app:SsmServerHandler'); // Initialize debugging for this handler

export default class SsmServerHandler extends ServerHandler {
  private ssmClient: AWS.SSM; // Private member to hold the AWS SSM client

  /**
   * Constructs an SsmServerHandler instance.
   * @param serverConfig The configuration object for the server.
   */
  constructor(serverConfig: ServerConfig) {
    super(serverConfig); // Call the base class constructor with the server config
    this.ssmClient = new AWS.SSM({ region: serverConfig.region || 'us-west-2' });
    debug('SSM Server Handler initialized for:', serverConfig.host);
  }

  /**
   * Determines the appropriate script file extension based on the server's shell configuration.
   * @returns The file extension as a string.
   */
  private determineScriptExtension(): string {
    switch (this.serverConfig.shell) {
      case 'powershell': return '.ps1';
      case 'python': return '.py';
      default: return '.sh';
    }
  }

  /**
   * Generates the command to execute a script file based on the server's shell environment.
   * @param filePath The path of the script file to execute.
   * @returns The command string to execute the file.
   */
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

private async sortFilesByDate(directory: string, files: string[]): Promise<string[]> {
  const filesWithStats = await Promise.all(files.map(async fileName => {
    const fullPath = path.join(directory, fileName);
    const stats = await fs.promises.stat(fullPath);
    return { name: fileName, mtime: stats.mtime };
  }));
  filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  return filesWithStats.map(file => file.name);
}

async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
  const updateCommand = this.serverConfig.posix
    ? (backup ? `cp ${filePath}{,.bak} && sed -i 's/${pattern}/${replacement}/g' ${filePath}` : `sed -i 's/${pattern}/${replacement}/g' ${filePath}`)
    : (backup ? `Copy-Item -Path ${filePath} -Destination ${filePath}.bak; (Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}` : `(Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}`);
  
  await this.executeCommand(updateCommand);
  return true;
}

async amendFile(filePath: string, content: string): Promise<boolean> {
  const amendCommand = this.serverConfig.posix
    ? `echo "${content}" >> ${filePath}`
    : `Add-Content ${filePath} '${content}'`;
  await this.executeCommand(amendCommand);
  return true;
}

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

async uploadAndExecuteScript(scriptContent: string, scriptExtension: string, directory?: string): Promise<string> {
  // Creates a unique temporary filename and path for the script.
  const tempFileName = `${uuidv4()}${scriptExtension}`;
  const tempDirectory = directory || this.serverConfig.posix ? '/tmp' : this.serverConfig.homeFolder || '.';
  const tempFilePath = path.join(tempDirectory, tempFileName);

  try {
    // Handles file creation and command execution.
    await this.createFile(tempDirectory, tempFileName, scriptContent, false);
    const executeCommand = this.getExecuteCommand(tempFilePath);
    const { stdout, stderr } = await this.executeCommand(executeCommand, { directory: tempDirectory });

    // Error handling: checks for script output and cleans up regardless of outcome.
    if (!stdout) throw new Error(`Script did not produce output. stderr: ${stderr}`);
    return stdout;
  } catch (error) {
    debug('Error during script execution:', error);
    throw error;  // Rethrow to maintain error handling outside this function
  } finally {
    // Ensures cleanup of temporary files.
    await this.executeCommand(`rm -f ${tempFilePath}`, { directory: tempDirectory });
  }
}
