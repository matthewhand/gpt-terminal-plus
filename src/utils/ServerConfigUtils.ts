import config from 'config';
import { ServerConfig, ServerHandlerInterface } from '../types/index';
import SshServerHandler from '../handlers/SshServerHandler';
import SsmServerHandler from '../handlers/SsmServerHandler';
import LocalServerHandler from '../handlers/LocalServerHandler';
import Debug from 'debug';

const serverHandlerDebug = Debug('app:ServerConfigUtils');

/**
 * Utility class for managing server configurations and handlers.
 */
export class ServerConfigUtils {
    private static serverConfigs: ServerConfig[] = config.get<ServerConfig[]>('serverConfig') || [];
    private static instances: Record<string, ServerHandlerInterface> = {};

    /**
     * Lists available server configurations.
     * @returns An array of server configurations.
     */
    public static listAvailableServers(): ServerConfig[] {
        serverHandlerDebug('Listing available servers...');
        return this.serverConfigs;
    }

    /**
     * Gets an instance of a server handler based on the host.
     * @param host - The host name of the server.
     * @returns A promise that resolves to the server handler instance.
     */
    public static async getInstance(host: string): Promise<ServerHandlerInterface> {
        serverHandlerDebug(`Fetching instance for host: ${host}`);
        if (!host) throw new Error('Host is undefined.');

        if (!this.instances[host]) {
            const serverConfig = this.serverConfigs.find(config => config.host === host);
            if (!serverConfig) throw new Error(`Server config not found for host: ${host}`);
            this.instances[host] = await this.initializeHandler(serverConfig);
        }
        return this.instances[host];
    }

    /**
     * Initializes a handler based on the server configuration.
     * @param serverConfig - The server configuration.
     * @returns The initialized server handler.
     */
    private static async initializeHandler(serverConfig: ServerConfig): Promise<ServerHandlerInterface> {
        switch (serverConfig.protocol) {
            case 'ssh':
                return await SshServerHandler.getInstance(serverConfig);
            case 'ssm':
                return new SsmServerHandler(serverConfig);
            case 'local':
                return new LocalServerHandler(serverConfig);
            default:
                throw new Error(`Unsupported protocol: ${serverConfig.protocol}`);
        }
    }

    /**
     * Updates the current server configuration dynamically.
     * @param host - The host name of the server.
     * @param newConfig - The new configuration details.
     */
    public static updateCurrentServerConfig(host: string, newConfig: Partial<ServerConfig>): void {
        serverHandlerDebug(`Updating server configuration for host: ${host}`);
        const index = this.serverConfigs.findIndex(config => config.host === host);
        if (index !== -1) {
            this.serverConfigs[index] = { ...this.serverConfigs[index], ...newConfig };
            delete this.instances[host];
        } else {
            throw new Error(`Server config for host '${host}' not found.`);
        }
    }
}
