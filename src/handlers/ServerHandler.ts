import config from 'config';
import { ServerConfig, SystemInfo } from '../types';

export abstract class ServerHandler {
  protected currentDirectory: string = "";
  protected serverConfig: ServerConfig;
  protected identifier: string;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
    this.identifier = `${serverConfig.username}@${serverConfig.host}`;
  }

  // Method to list available servers
  public static listAvailableServers(): ServerConfig[] {
    const servers: ServerConfig[] = config.get('serverConfig');
    if (!servers || servers.length === 0) {
      throw new Error('No server configurations available.');
    }
    return servers;
  }

  // Method to get a ServerHandler instance
  public static async getInstance(host: string): Promise<ServerHandler> {
    if (!host) {
      throw new Error('Host parameter is missing or invalid.');
    }

    const serverConfig = this.getServerConfig(host);
    const handlerClass = serverConfig.host === 'localhost' ? 'LocalServerHandler' : 'RemoteServerHandler';
    const { default: Handler } = await import(`./${handlerClass}`);
    return new Handler(serverConfig);
  }

  private static getServerConfig(host: string): ServerConfig {
    const servers = this.listAvailableServers();
    const serverConfig = servers.find(configItem => configItem.host === host);
    if (!serverConfig) {
      throw new Error(`Server with host '${host}' not in predefined list.`);
    }
    return serverConfig;
  }

  // Abstract methods...
  abstract executeCommand(command: string, timeout?: number): Promise<{ stdout: string; stderr: string }>;
  abstract setCurrentDirectory(directory: string): boolean;
  abstract getCurrentDirectory(): Promise<string>;
  abstract listFiles(directory: string, limit?: number, offset?: number, orderBy?: string): Promise<string[]>;
  abstract createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean>;
  abstract updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean>;
  abstract amendFile(filePath: string, content: string): Promise<boolean>;
  abstract getSystemInfo(): Promise<SystemInfo>;
}

