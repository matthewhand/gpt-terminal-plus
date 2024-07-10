import fs from 'fs';
import path from 'path';
import { ServerConfig } from '../types';
import Debug from 'debug';

const debug = Debug('app:ServerConfigManager');

/**
 * Singleton class to manage server configuration.
 */
class ServerConfigManager {
  private static instance: ServerConfigManager;
  private configFilePath: string;
  private serverConfig: ServerConfig | null;

  private constructor() {
    this.configFilePath = path.join(__dirname, '../../serverConfig.json');
    this.serverConfig = this.loadServerConfig();
  }

  /**
   * Get the singleton instance of ServerConfigManager.
   * @returns {ServerConfigManager} The instance of ServerConfigManager.
   */
  public static getInstance(): ServerConfigManager {
    if (!ServerConfigManager.instance) {
      ServerConfigManager.instance = new ServerConfigManager();
    }
    return ServerConfigManager.instance;
  }

  /**
   * Load server configuration from the file.
   * @returns {ServerConfig | null} The loaded server configuration or null if not found.
   */
  private loadServerConfig(): ServerConfig | null {
    try {
      if (fs.existsSync(this.configFilePath)) {
        const data = fs.readFileSync(this.configFilePath, 'utf-8');
        try { return JSON.parse(data); } catch (error) { debug("Error parsing server config:", error); return null; }
      } else {
        debug('Server config file not found.');
        return null;
      }
    } catch (error) {
      debug('Error loading server config:', error);
      return null;
    }
  }

  /**
   * Save server configuration to the file.
   * @param {ServerConfig} config - The server configuration to save.
   */
  private saveServerConfig(config: ServerConfig): void {
    try {
      const data = JSON.stringify(config, null, 2);
      fs.writeFileSync(this.configFilePath, data, 'utf-8');
      debug('Server config saved successfully.');
    } catch (error) {
      debug('Error saving server config:', error);
    }
  }

  /**
   * Get the current server configuration.
   * @returns {ServerConfig | null} The current server configuration or null if not set.
   */
  public getServerConfig(): ServerConfig | null {
    return this.serverConfig;
  }

  /**
   * Set a new server configuration and persist it to the file.
   * @param {ServerConfig} config - The new server configuration to set.
   */
  public setServerConfig(config: ServerConfig): void {
    this.serverConfig = config;
    this.saveServerConfig(config);
  }
}

export default ServerConfigManager;
