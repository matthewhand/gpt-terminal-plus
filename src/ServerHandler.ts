import { ServerConfig } from './types/ServerConfig';
import { SystemInfo } from './types/SystemInfo';
import { PaginatedResponse } from './types/PaginatedResponse';
import { ServerHandler as ServerHandlerType } from './types/ServerHandler';
import debug from 'debug';
import { presentWorkingDirectory, changeDirectory } from './utils/GlobalStateHelper';

const serverHandlerDebug = debug('app:ServerHandler');

export abstract class ServerHandler implements ServerHandlerType {
  public identifier: string;
  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
    serverHandlerDebug(`ServerHandler created for ${this.identifier}`);
  }

  getServerConfig(): ServerConfig {
    serverHandlerDebug('Retrieving server configuration');
    return this.serverConfig;
  }

  async changeDirectory(directory: string): Promise<boolean> {
    changeDirectory(directory);
    serverHandlerDebug(`Current directory set globally to ${directory}`);
    return true;
  }

  async presentWorkingDirectory(): Promise<string> {
    const directory = presentWorkingDirectory();
    serverHandlerDebug(`Retrieving current directory globally: ${directory}`);
    return directory;
  }

  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>; 
  abstract listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: 'filename' | 'datetime' }): Promise<PaginatedResponse<{ name: string, isDirectory: boolean }>>; 
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  abstract amendFile(filePath: string, content: string): Promise<boolean>;
  abstract getSystemInfo(): Promise<SystemInfo>;
}
