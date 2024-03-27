import { ServerConfig, SystemInfo } from '../types';
import debug from 'debug';

const serverHandlerDebug = debug('app:ServerHandler');

export abstract class ServerHandler {
  protected currentDirectory: string = "";
  protected serverConfig: ServerConfig;
  protected identifier: string;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
  }

  setCurrentDirectory(directory: string): boolean {
    this.currentDirectory = directory;
    return true;
  }

  getCurrentDirectory(): Promise<string> {
    return Promise.resolve(this.currentDirectory);
  }

  // Abstract methods declarations (to be implemented by derived classes)
  abstract executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }>;
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
