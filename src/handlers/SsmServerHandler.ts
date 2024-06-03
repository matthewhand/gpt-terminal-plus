import * as ssmUtils from '../utils/ssmUtils';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, SystemInfo } from '../types';
import * as AWS from 'aws-sdk';
import Debug from 'debug';

const debug = Debug('app:SsmServerHandler');

/**
 * Class representing an SSM Server Handler.
 * Extends the base ServerHandler class and provides methods for interacting with servers using AWS SSM.
 */
export default class SsmServerHandler extends ServerHandler {
  private ssmClient: AWS.SSM;

  /**
   * Constructs an SsmServerHandler instance.
   * @param {ServerConfig} serverConfig - The configuration object for the server.
   */
  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.ssmClient = new AWS.SSM({ region: serverConfig.region || 'us-west-2' });
    debug('SSM Server Handler initialized for:', serverConfig.host);
  }

  /**
   * Determines the appropriate script file extension based on the server's shell configuration.
   * @returns {string} The file extension as a string.
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
   * @param {string} filePath - The path of the script file to execute.
   * @returns {string} The command string to execute the file.
   */
  private getExecuteCommand(filePath: string): string {
    switch (this.serverConfig.shell) {
      case 'powershell': return `Powershell -File ${filePath}`;
      case 'python': return `python ${filePath}`;
      default: return `bash ${filePath}`;
    }
  }

  /**
   * Uploads a script to the server and executes it.
   * @param {string} scriptContent - The content of the script to execute.
   * @param {string} scriptExtension - The file extension for the script based on the shell.
   * @param {string} [directory] - The directory where the script should be created. If not specified, defaults to '/tmp' or the home directory.
   * @returns {Promise<string>} The standard output of the script execution.
   */
  async uploadAndExecuteScript(scriptContent: string, scriptExtension: string, directory?: string): Promise<string> {
    const tempFileName = `${uuidv4()}${scriptExtension}`;
    const tempDirectory = directory || (this.serverConfig.posix ? '/tmp' : this.serverConfig.homeFolder || '.');
    const tempFilePath = path.join(tempDirectory, tempFileName);

    try {
      debug(`Creating temporary script at: ${tempFilePath}`);
      await this.createFile(tempDirectory, tempFileName, scriptContent, false);
      debug(`File created at: ${tempFilePath}`);

      // Adding a delay to ensure the file system has registered the new file
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Retrieve folder listing and contents of the script for debugging purposes
      if (debug.enabled) {
        const { stdout: listOutput } = await this.executeCommand(`ls -l ${tempDirectory}`, { directory: tempDirectory });
        debug(`Files in ${tempDirectory}: ${listOutput}`);
        const { stdout: catOutput } = await this.executeCommand(`cat ${tempFilePath}`, { directory: tempDirectory });
        debug(`Contents of ${tempFilePath}: ${catOutput}`);
      }

      const executeCommand = this.getExecuteCommand(tempFilePath);
      debug(`Executing script: ${executeCommand}`);
      const { stdout, stderr } = await this.executeCommand(executeCommand, { directory: tempDirectory });

      if (!stdout) {
        debug(`Script did not produce output. stderr: ${stderr}`);
        throw new Error(`Script did not produce output. stderr: ${stderr}`);
      }

      await this.executeCommand(`rm -f ${tempFilePath}`, { directory: tempDirectory });
      debug(`Temporary script ${tempFilePath} deleted.`);
      return stdout;
    } catch (error) {
      await this.executeCommand(`rm -f ${tempFilePath}`, { directory: tempDirectory });
      debug('Error during script execution:', error);
      throw error;
    }
  }

  /**
   * Lists files in a specified directory.
   * @param {string} directory - The directory to list files from.
   * @param {number} [limit=42] - The maximum number of files to return.
   * @param {number} [offset=0] - The number of files to skip.
   * @param {string} [orderBy="filename"] - The order in which to sort files.
   * @returns {Promise<{items: string[], totalPages: number, responseId: string}>} An object containing the list of files, total pages, and a response ID.
   */
  async listFiles(directory: string, limit: number = 42, offset: number = 0, orderBy: string = "filename"): Promise<{ items: string[]; totalPages: number; responseId: string }> {
    const listCommand = this.serverConfig.posix
      ? `ls -al ${directory} | tail -n +2`
      : `Get-ChildItem -Path '${directory}' -File | Select-Object -ExpandProperty Name`;

    debug(`Listing files in directory: ${directory}`);
    const { stdout } = await this.executeCommand(listCommand, {});
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

  /**
   * Sorts files by their modification date.
   * @param {string} directory - The directory containing the files.
   * @param {string[]} files - The list of file names.
   * @returns {Promise<string[]>} A sorted list of file names by modification date.
   */
  private async sortFilesByDate(directory: string, files: string[]): Promise<string[]> {
    const filesWithStats = await Promise.all(files.map(async fileName => {
      const fullPath = path.join(directory, fileName);
      const stats = await fs.promises.stat(fullPath);
      return { name: fileName, mtime: stats.mtime };
    }));
    filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return filesWithStats.map(file => file.name);
  }

  /**
   * Updates a file by replacing a pattern with a replacement string.
   * @param {string} filePath - The path to the file to be updated.
   * @param {string} pattern - The pattern to search for.
   * @param {string} replacement - The replacement string.
   * @param {boolean} backup - Whether to create a backup of the file before updating.
   * @returns {Promise<boolean>} A promise indicating success or failure.
   */
  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
    const updateCommand = this.serverConfig.posix
      ? (backup ? `cp ${filePath}{,.bak} && sed -i 's/${pattern}/${replacement}/g' ${filePath}` : `sed -i 's/${pattern}/${replacement}/g' ${filePath}`)
      : (backup ? `Copy-Item -Path ${filePath} -Destination ${filePath}.bak; (Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}` : `(Get-Content ${filePath}) -replace '${pattern}', '${replacement}' | Set-Content ${filePath}`);

    debug(`Updating file: ${filePath} with pattern: ${pattern} and replacement: ${replacement}`);
    await this.executeCommand(updateCommand, {});
    return true;
  }

  /**
   * Appends content to a file.
   * @param {string} filePath - The path to the file to be amended.
   * @param {string} content - The content to append to the file.
   * @returns {Promise<boolean>} A promise indicating success or failure.
   */
  async amendFile(filePath: string, content: string): Promise<boolean> {
    const amendCommand = this.serverConfig.posix
      ? `echo \"${content}\" >> ${filePath}`
      : `Add-Content ${filePath} '${content}'`;
    debug(`Appending content to file: ${filePath}`);
    await this.executeCommand(amendCommand, {});
    return true;
  }

  /**
   * Creates a file with the specified content.
   * @param {string} directory - The directory where the file should be created.
   * @param {string} filename - The name of the file to be created.
   * @param {string} content - The content to write to the file.
   * @param {boolean} backup - Whether to create a backup of the file if it already exists.
   * @returns {Promise<boolean>} A promise indicating success or failure.
   */
  async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    try {
      const filePath = path.join(directory, filename);
      if (backup) {
        const backupPath = `${filePath}.bak`;
        fs.copyFileSync(filePath, backupPath);
        debug(`Backup created for file: ${filePath} at ${backupPath}`);
      }
      fs.writeFileSync(filePath, content);
      debug(`File created at: ${filePath}`);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        debug(`Error creating file: ${error.message}`);
      } else {
        debug(`An unexpected error occurred: ${error}`);
      }
      return false;
    }
  }

  /**
   * Executes a command on the server and returns the results.
   * @param {string} command - The command to be executed.
   * @param {Object} options - An object containing optional parameters.
   * @param {number} [options.timeout=60] - The maximum time in seconds to wait for the command to complete.
   * @param {string} [options.directory] - The directory from which the command should be executed.
   * @param {number} [options.linesPerPage] - The number of lines per page if output needs pagination.
   * @param {number} [options.retries=10] - The number of times to retry the command if it fails.
   * @param {number} [options.waitTime=6000] - The wait time in milliseconds between retries.
   * @returns {Promise<{stdout?: string, stderr?: string, pages?: string[], totalPages?: number, responseId?: string}>} A promise that resolves to an object containing command output details and optionally pagination details if linesPerPage is provided.
   */
  async executeCommand(
    command: string,
    options: {
      timeout?: number,
      directory?: string,
      linesPerPage?: number,
      retries?: number,
      waitTime?: number
    } = {}
  ): Promise<{
    stdout?: string,
    stderr?: string,
    pages?: string[],
    totalPages?: number,
    responseId?: string
  }> {
    debug('Executing command:', command, 'on directory:', options.directory);

    if (!command) {
      throw new Error('No command provided for execution.');
    }
    if (!this.serverConfig.instanceId) {
      throw new Error('Instance ID is undefined. Unable to execute command.');
    }

    const documentName = this.serverConfig.posix ? 'AWS-RunShellScript' : 'AWS-RunPowerShellScript';
    const formattedCommand = this.serverConfig.posix
      ? (options.directory ? `cd ${options.directory}; ${command}` : command)
      : (options.directory ? `Set-Location -Path '${options.directory}'; ${command}` : command);

    const params = {
      InstanceIds: [this.serverConfig.instanceId],
      DocumentName: documentName,
      Parameters: { commands: [formattedCommand] },
      TimeoutSeconds: options.timeout || 60
    };

    const commandResponse = await this.ssmClient.sendCommand(params).promise();

    if (!commandResponse.Command || !commandResponse.Command.CommandId) {
      throw new Error('Failed to retrieve command response or CommandId is undefined. Command execution failed.');
    }

    return await this.fetchCommandResult(commandResponse.Command.CommandId, this.serverConfig.instanceId, options.linesPerPage, options.retries, options.waitTime);
  }

  /**
   * Fetches the result of a command execution from AWS SSM.
   * @param {string} commandId - The ID of the command to fetch the result for.
   * @param {string} instanceId - The ID of the instance the command was executed on.
   * @param {number} [linesPerPage] - The number of lines per page if output needs pagination.
   * @param {number} [retries=10] - The number of times to retry fetching the command result.
   * @param {number} [waitTime=6000] - The wait time in milliseconds between retries.
   * @returns {Promise<{ stdout: string; stderr: string; pages?: string[]; totalPages?: number; responseId?: string }>} A promise that resolves to an object containing the command output and pagination details if applicable.
   */
  private async fetchCommandResult(
    commandId: string,
    instanceId: string,
    linesPerPage?: number,
    retries: number = 10,
    waitTime: number = 6000
  ): Promise<{ stdout: string; stderr: string; pages?: string[]; totalPages?: number; responseId?: string }> {
    let attempt = 0;

    while (attempt < retries) {
      const result = await this.ssmClient.getCommandInvocation({
        CommandId: commandId,
        InstanceId: instanceId,
      }).promise();

      if (result && result.Status && ['Success', 'Failed', 'Cancelled', 'TimedOut'].includes(result.Status)) {
        const stdout = result.StandardOutputContent || '';
        const stderr = result.StandardErrorContent || '';

        if (linesPerPage && linesPerPage > 0) {
          const allOutput = `${stdout}\n${stderr}`.trim();
          const lines = allOutput.split('\n');
          const totalPages = Math.ceil(lines.length / linesPerPage);
          const pages = [];

          for (let i = 0; i < lines.length; i += linesPerPage) {
            pages.push(lines.slice(i, i + linesPerPage).join('\n'));
          }

          return {
            stdout,
            stderr,
            pages,
            totalPages,
            responseId: uuidv4()
          };
        }

        return { stdout, stderr };
      }

      debug(`Attempt ${attempt + 1}: Command status: ${result.Status}, retrying in ${waitTime / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      attempt++;
      waitTime *= 2; // Exponential backoff
    }
    throw new Error('Timeout while waiting for command result');
  }

  /**
   * Paginates the command output.
   * @param {string} stdout - The standard output from the command.
   * @param {number} [linesPerPage] - The number of lines per page.
   * @returns {string[]} An array of strings representing paginated output.
   */
  private paginateOutput(stdout: string, linesPerPage?: number): string[] {
    const pages: string[] = [];
    if (linesPerPage && stdout) {
      const lines = stdout.split('\n');
      for (let i = 0; i < lines.length; i += linesPerPage) {
        pages.push(lines.slice(i, i + linesPerPage).join('\n'));
      }
    }
    return pages;
  }

  /**
   * Retrieves system information from the server.
   * @returns {Promise<SystemInfo>} A promise that resolves to an object containing system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    const scriptExtension = this.determineScriptExtension();
    const scriptPath = `src/scripts/remote_system_info${scriptExtension}`;

    const command = this.getExecuteCommand(scriptPath);
    const { stdout } = await this.executeCommand(command, {});

    return JSON.parse(stdout as string) as SystemInfo;
  }
}
