import { AbstractServerHandler } from '../AbstractServerHandler';
import { SystemInfo } from '../../types/SystemInfo';
import debug from 'debug';
import { executeCommand, ExecuteCommandParams } from './actions/executeCommand';
import { SsmTargetConfig } from '../../types/ServerConfig';
import fs from 'fs';
import path from 'path';

const ssmServerDebug = debug('app:SsmServer');

const DEFAULT_SSM_DOCUMENT_NAME = process.env.SSM_DOCUMENT_NAME || 'AWS-RunShellScript';

class SsmServerHandler extends AbstractServerHandler {
  private ssmClient: any;
  protected serverConfig: SsmTargetConfig;

  constructor(serverConfig: SsmTargetConfig) {
    super(serverConfig);
    this.serverConfig = serverConfig;
    ssmServerDebug('Initialized SsmServerHandler with config: ' + JSON.stringify(serverConfig));
    this.ssmClient = {}; // Initialize ssmClient (this should be replaced with actual implementation)
  }

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
    ssmServerDebug(`Loading script content from: ${scriptFilePath}`);
    return fs.readFileSync(scriptFilePath, 'utf8');
  }

  async getSystemInfo(): Promise<SystemInfo> {
    ssmServerDebug('Retrieving system info for SSM server.');
    const shell = this.serverConfig.shell || 'bash';
    ssmServerDebug(`Selected shell: ${shell}`);
    const scriptContent = this.getScriptContent(shell);
    ssmServerDebug(`Script content: ${scriptContent}`);

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
    ssmServerDebug(`Executing command: ${command}`);

    const params: ExecuteCommandParams = {
      ssmClient: this.ssmClient,
      command,
      instanceId: this.serverConfig.instanceId,
      documentName: DEFAULT_SSM_DOCUMENT_NAME,
      timeout: 60,
      directory: '/',
    };

    const { stdout = '' } = await executeCommand(params);
    ssmServerDebug(`Command output: ${stdout}`);
    return JSON.parse(stdout) as SystemInfo;
  }

  async executeCommand(command: string, timeout: number = 60, directory: string = '/'): Promise<{ stdout: string; stderr: string }> {
    ssmServerDebug(`Executing command: ${command}, timeout: ${timeout}, directory: ${directory}`);

    const params: ExecuteCommandParams = {
      ssmClient: this.ssmClient,
      command,
      instanceId: this.serverConfig.instanceId,
      documentName: DEFAULT_SSM_DOCUMENT_NAME,
      timeout,
      directory,
    };

    const result = await executeCommand(params);
    ssmServerDebug(`Command result: stdout: ${result.stdout || ''}, stderr: ${result.stderr || ''}`);
    return { stdout: result.stdout || '', stderr: result.stderr || '' };
  }

  async listFiles(): Promise<{ items: { name: string; isDirectory: boolean }[]; limit: number; offset: number; total: number }> {
    throw new Error('Action not supported');
  }

  async createFile(): Promise<boolean> {
    throw new Error('Action not supported');
  }

  async updateFile(): Promise<boolean> {
    throw new Error('Action not supported');
  }

  async amendFile(): Promise<boolean> {
    throw new Error('Action not supported');
  }
}

export default SsmServerHandler;
