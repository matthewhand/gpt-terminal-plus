import { ServerConfig, SystemInfo } from '../types/index';
import debug from 'debug';
import { getCurrentFolder, setCurrentFolder } from '../utils/GlobalStateHelper';

const serverHandlerDebug = debug('app:ServerHandler');

export abstract class ServerHandler {
  public identifier: string;

  protected serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
    serverHandlerDebug(`ServerHandler created for ${this.identifier}`);
  }

  // Implement getServerConfig() directly in the abstract class
  getServerConfig(): ServerConfig {
    return this.serverConfig;
  }

  setCurrentDirectory(directory: string): boolean {
    setCurrentFolder(directory); // Utilizing GlobalStateHelper
    serverHandlerDebug(`Current directory set globally to ${directory}`);
    return true;
  }

  async getCurrentDirectory(): Promise<string> {
    const directory = getCurrentFolder(); // Utilizing GlobalStateHelper
    serverHandlerDebug(`Retrieving current directory globally: ${directory}`);
    return directory;
  }

  // Abstract method declarations
  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;

  // Provided implementations for methods not supported by this server handler remain unchanged
  async listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]> {
    throw new Error("Operation not supported by this server handler.");
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean = false): Promise<boolean> {
    throw new Error("Operation not supported by this server handler.");
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean = false): Promise<boolean> {
    throw new Error("Operation not supported by this server handler.");
  }

  async amendFile(filePath: string, content: string, backup: boolean = false): Promise<boolean> {
    throw new Error("Operation not supported by this server handler.");
  }  

  abstract getSystemInfo(): Promise<SystemInfo>;
}
