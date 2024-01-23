// ServerConfigManager.ts
export default class ServerConfigManager {
  private static instance: ServerConfigManager;
  private currentServerConfig: string;

  private constructor() {
    this.currentServerConfig = 'defaultServer'; // Initialize with default or from environment/config file
  }

  public static getInstance(): ServerConfigManager {
    if (!ServerConfigManager.instance) {
      ServerConfigManager.instance = new ServerConfigManager();
    }
    return ServerConfigManager.instance;
  }

  public getServerConfig(): string {
    return this.currentServerConfig;
  }

  public setServerConfig(newServerConfig: string): void {
    this.currentServerConfig = newServerConfig;
  }
}
