import { SystemInfoRetriever } from '../interfaces/SystemInfoRetriever';
import { ServerConfig, SystemInfo } from '../types';

const PYTHON_SCRIPT = 'remote_system_info.py';
const BASH_SCRIPT = 'remote_system_info.sh';
const POWERSHELL_SCRIPT = 'remote_system_info.ps1';

/**
 * Class for retrieving system information script paths via SSH.
 */
class SSHSystemInfoRetriever implements SystemInfoRetriever {
    private serverConfig: ServerConfig;

    /**
     * Constructor for SSHSystemInfoRetriever.
     * @param {ServerConfig} serverConfig - The server configuration.
     */
    constructor(serverConfig: ServerConfig) {
        this.serverConfig = serverConfig;
    }

    /**
     * Returns the script based on the shell type.
     * @returns {string} - The script to be executed.
     */
    public getSystemInfoScript(): string {
        switch (this.serverConfig.shell) {
            case 'powershell':
                return POWERSHELL_SCRIPT;
            case 'python':
                return PYTHON_SCRIPT;
            default:
                return BASH_SCRIPT;
        }
    }

    /**
     * Returns default system information in case of an error.
     * @returns {SystemInfo} - The default system information.
     */
    public getDefaultSystemInfo(): SystemInfo {
        return {
            homeFolder: '/',
            type: 'Unknown',
            release: 'N/A',
            platform: 'N/A',
            architecture: 'N/A',
            totalMemory: 0,
            freeMemory: 0,
            uptime: 0,
            currentFolder: '/'
        };
    }

    public async determineRemoteScriptFolder(): Promise<string> {
        // TODO smarter logic
        const remoteScriptFolder = '/tmp';
        return remoteScriptFolder;
    }

}

export default SSHSystemInfoRetriever;
