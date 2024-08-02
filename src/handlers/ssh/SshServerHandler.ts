import { AbstractServerHandler } from '../AbstractServerHandler';
import { SystemInfo } from '../../types/SystemInfo';
import debug from 'debug';
import { executeCommand } from './actions/executeCommand';
import { SshHostConfig } from '../../types/ServerConfig';
import fs from 'fs';
import path from 'path';

const sshServerDebug = debug('app:SshServer');

class SshServerHandler extends AbstractServerHandler {
  private sshClient: any;
  protected serverConfig: SshHostConfig;

  constructor(serverConfig: SshHostConfig) {
    super(serverConfig);
    this.serverConfig = serverConfig;
    sshServerDebug('Initialized SshServerHandler with config: ' + JSON.stringify(serverConfig));
    this.sshClient = {}; // Initialize sshClient (this should be replaced with actual implementation)
  }

  /**
   * Retrieve the script content based on the shell type.
   * @param shell - The shell type.
   * @returns The content of the script.
   */
  private getScriptContent(shell: string): string {
    let scriptFilePath: string;
    switch (shell) {
      case 'powershell':
        scriptFilePath = path.join(__dirname, '../../scripts/remote_system_info.ps1');
        break;
      case 'python':
        scriptFilePath = path.join(__dirname, '../../scripts/remote_system_info.py');
        break;
      case 'bash':
      default:
        scriptFilePath = path.join(__dirname, '../../scripts/remote_system_info.sh');
        break;
    }
    sshServerDebug(`Loading script content from: ${scriptFilePath}`);
    return fs.readFileSync(scriptFilePath, 'utf8');
  }

  /**
   * Retrieve system information for the SSH server.
   * @returns The system information.
   */
  async getSystemInfo(): Promise<SystemInfo> {
    sshServerDebug('Retrieving system info for SSH server.');
    const shell = this.serverConfig.shell || 'bash';
    sshServerDebug(`Selected shell: ${shell}`);
    const scriptContent = this.getScriptContent(shell);
    sshServerDebug(`Script content: ${scriptContent}`);

    let command: string;
    switch (shell) {
      case 'powershell':
        command = `powershell -Command "${scriptContent.replace(/"/g, '\"')}"`;
        break;
      case 'python':
        command = `python -c "${scriptContent.replace(/"/g, '\"')}"`;
        break;
      case 'bash':
      default:
        command = `bash -c "${scriptContent.replace(/"/g, '\"')}"`;
        break;
    }
    sshServerDebug(`Executing command: ${command}`);
    const { stdout } = await executeCommand(this.sshClient, this.serverConfig, command, {});
    sshServerDebug(`Command output: ${stdout}`);
    return JSON.parse(stdout) as SystemInfo;
  }

  /**
   * Execute a command on the SSH server.
   * @param command - The command to execute.
   * @param timeout - The timeout for the command.
   * @param directory - The directory to execute the command in.
   * @returns The stdout and stderr from the command execution.
   */
  async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    sshServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);
    const result = await executeCommand(this.sshClient, this.serverConfig, command, { cwd: directory, timeout });
    sshServerDebug(`Command result: stdout: ${result.stdout}, stderr: ${result.stderr}`);
    return { stdout: result.stdout, stderr: result.stderr };
  }

  /**
   * List files on the SSH server.
   * @returns The list of files and metadata.
   */
  async listFiles(): Promise<{ items: { name: string; isDirectory: boolean }[]; limit: number; offset: number; total: number }> {
    throw new Error('Action not supported');
  }

  /**
   * Create a file on the SSH server.
   * @returns Whether the file was created successfully.
   */
  async createFile(): Promise<boolean> {
    throw new Error('Action not supported');
  }

  /**
   * Update a file on the SSH server.
   * @returns Whether the file was updated successfully.
   */
  async updateFile(): Promise<boolean> {
    throw new Error('Action not supported');
  }

  /**
   * Amend a file on the SSH server.
   * @returns Whether the file was amended successfully.
   */
  async amendFile(): Promise<boolean> {
    throw new Error('Action not supported');
  }
}

export default SshServerHandler;
