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
      await this.createFile(tempDirectory, tempFileName, scriptContent, false);
      const executeCommand = this.getExecuteCommand(tempFilePath);
      const { stdout, stderr } = await this.executeCommand(executeCommand, { directory: tempDirectory });

      if (!stdout) {
        throw new Error(`Script did not produce output. stderr: ${stderr}`);
      }

      await this.executeCommand(`rm -f ${tempFilePath}`, { directory: tempDirectory });
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
      ? `echo "${content}" >> ${filePath}`
      : `Add-Content ${filePath} '${content}'`;
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
      }
      fs.writeFileSync(filePath, content);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating file:", error.message);
      } else {
        console.error("An unexpected error occurred:", error);
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
   * @param {number} [options.retries=3] - The number of times to retry the command if it fails.
   * @param {number} [options.waitTime=5000] - The wait time in milliseconds between retries.
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
    }
  ): Promise<{
    stdout?: string,
    stderr?: string,
    pages?: string[],
    totalPages?: number,
    responseId?: string
  }> {
    const { stdout, stderr, responseId } = await ssmUtils.executeCommand(
      this.ssmClient,
      command,
      this.serverConfig.instanceId as string,
      'AWS-RunShellScript',
      options.timeout || 60,
      options.directory || this.currentDirectory || '/',
      options.retries || 3
    );

    let attempt = 0;
    const maxAttempts = options.retries || 3;
    const waitTime = options.waitTime || 5000;

    while (attempt < maxAttempts) {
      const commandInvocation = await this.ssmClient.getCommandInvocation({
        CommandId: responseId as string,
        InstanceId: this.serverConfig.instanceId as string
      }).promise();

      debug(`Attempt ${attempt}: Command status: ${commandInvocation.Status}`);

      if (commandInvocation.Status === 'InProgress') {
        attempt++;
        debug(`Attempt ${attempt}: Command still in progress, waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (commandInvocation.Status === 'Success') {
        const pages = this.paginateOutput(stdout as string, options.linesPerPage);
        return {
          stdout,
          stderr,
          pages,
          totalPages: pages.length,
          responseId: uuidv4()
        };
      } else {
        throw new Error(`Command execution failed with status: ${commandInvocation.Status}`);
      }
    }

    throw new Error(`Command execution failed after ${maxAttempts} attempts.`);
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
    const scriptExtension = ssmUtils.determineScriptExtension(this.serverConfig.shell as string);
    const scriptPath = `src/scripts/remote_system_info${scriptExtension}`;

    const command = ssmUtils.getExecuteCommand(this.serverConfig.shell as string, scriptPath);
    const { stdout } = await this.executeCommand(command, {});

    return JSON.parse(stdout as string) as SystemInfo;
  }
}
