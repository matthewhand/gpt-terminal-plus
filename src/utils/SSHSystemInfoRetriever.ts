/*
 * SSHSystemInfoRetriever.ts
 * 
 * Description:
 * This file is part of a suite of utilities designed to facilitate direct interactions with remote servers via SSH, providing a robust framework for executing commands, transferring files, and retrieving system information securely. At its core, the file leverages the ssh2 module to establish and manage SSH connections, encapsulating the complexity of direct SSH communication in a series of high-level, easy-to-use methods.
 * 
 * Key Functionalities:
 * - Establishing SSH connections using customizable server configurations.
 * - Executing arbitrary commands on the remote server and capturing the output, with comprehensive error handling and debug logging.
 * - Uploading and downloading files between the local system and the remote server, utilizing SFTP for secure file transfer.
 * - Extensive debug logging throughout, leveraging the debug module for granular visibility into the SSH interaction process, aiding in development and troubleshooting.
 * 
 * Each method within the file is designed with error handling and user feedback in mind, ensuring that any issues encountered during SSH operations are logged and addressed. This approach not only enhances the utility’s reliability but also provides developers and users with critical insights into its operation, facilitating easier debugging and maintenance.
 * 
 * The SSHSystemInfoRetriever.ts file exemplifies a modular, scalable approach to SSH interactions, making it an invaluable tool for any Node.js-based application requiring secure, efficient remote server management.
 */

import fs from 'fs/promises';
import path from 'path';
import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig, SystemInfo } from '../types/index';
import SFTPClient from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid';

// Initialize Debug logger specifically for this utility
const debug = Debug('app:SSHSystemInfoRetriever');

// Constants for script names
const PYTHON_SCRIPT = 'remote_system_info.py';
const BASH_SCRIPT = 'remote_system_info.sh';
const POWERSHELL_SCRIPT = 'remote_system_info.ps1';

class SSHSystemInfoRetriever {
  private sshClient: Client;
  private serverConfig: ServerConfig;

  /**
   * Constructor for SSHSystemInfoRetriever class.
   * 
   * @param {Client} sshClient - SSH Client instance.
   * @param {ServerConfig} serverConfig - Configuration for SSH server.
   */
  constructor(sshClient: Client, serverConfig: ServerConfig) {
    this.sshClient = sshClient;
    this.serverConfig = serverConfig;
  }

  /**
   * Retrieves system information from the remote server.
   * 
   * @returns {Promise<SystemInfo>} A Promise that resolves to a SystemInfo object containing system information.
   */
  public async getSystemInfo(): Promise<SystemInfo> {
    const scriptType = this.serverConfig.systemInfo === 'python' ? PYTHON_SCRIPT : BASH_SCRIPT;
    const command = scriptType === PYTHON_SCRIPT ? 'python3' : 'bash';
    try {
      return await this.executeSystemInfoScript(scriptType, command);
    } catch (error) {
      debug(`Error retrieving system info: ${error}`);
      return this.getDefaultSystemInfo();
    }
  }

  /**
   * Executes a system information script on the remote server.
   * 
   * @param {string} scriptName - Name of the system information script.
   * @param {string} command - Command to execute the script.
   * @returns {Promise<SystemInfo>} A Promise that resolves to a SystemInfo object containing system information.
   */
  private async executeSystemInfoScript(scriptName: string, command: string): Promise<SystemInfo> {
    const localScriptPath = path.join(__dirname, '..', 'scripts', scriptName);
    const uniqueFilename = `remote_system_info_${uuidv4()}.${scriptName.split('.').pop()}`;
    const remoteScriptPath = `/tmp/${uniqueFilename}`;
  
    await this.transferAndExecuteScript(localScriptPath, remoteScriptPath, command);
    const stdout = await this.retrieveScriptOutput(`${remoteScriptPath}.out`);
  
    // Attempt to parse JSON, handle parsing errors gracefully
    let parsedOutput;
    try {
      parsedOutput = JSON.parse(stdout);
    } catch (error) {
      debug(`Error parsing JSON from script output: ${error}`);
      // Return default system info if JSON parsing fails
      return this.getDefaultSystemInfo();
    }
  
    return this.constructSystemInfo(parsedOutput);
  }

  /**
   * Transfers and executes a script on the remote server.
   * 
   * @param {string} localScriptPath - Local path of the script to transfer.
   * @param {string} remoteScriptPath - Remote path where the script will be transferred and executed.
   * @param {string} command - Command to execute the script.
   * @returns {Promise<void>} A Promise that resolves when the script has been transferred and executed successfully.
   */
  private async transferAndExecuteScript(localScriptPath: string, remoteScriptPath: string, command: string): Promise<void> {
    const sftp = new SFTPClient();
    await sftp.connect({
      host: this.serverConfig.host,
      port: this.serverConfig.port ?? 22,
      username: this.serverConfig.username,
      privateKey: await this.getPrivateKey(),
    });

    await sftp.put(localScriptPath, remoteScriptPath);
    await this.executeRemoteCommand(`${command} ${remoteScriptPath} > ${remoteScriptPath}.out`);
    if (this.serverConfig.cleanupScripts !== undefined && this.serverConfig.cleanupScripts !== false) {
      await this.executeRemoteCommand(`rm -f ${remoteScriptPath} ${remoteScriptPath}.out`);
    }
    await sftp.end();
  }

  /**
   * Retrieves the private key for SSH authentication.
   * 
   * @returns {Promise<Buffer>} A Promise that resolves to the private key.
   */
  private async getPrivateKey(): Promise<Buffer> {
    try {
      return await fs.readFile(this.serverConfig.privateKeyPath ?? path.join(process.env.HOME || '', '.ssh', 'id_rsa'));
    } catch (error) {
      debug(`Failed to read private key: ${error}`);
      throw new Error(`Failed to read private key: ${error}`);
    }
  }

  /**
   * Retrieves the output of a script from the remote server.
   * 
   * @param {string} remoteScriptPath - Remote path of the script output file.
   * @returns {Promise<string>} A Promise that resolves to the output of the script.
   */
  private async retrieveScriptOutput(remoteScriptPath: string): Promise<string> {
    const { stdout } = await this.executeRemoteCommand(`cat ${remoteScriptPath}`);
    return stdout;
  }

  /**
   * Executes a command on the remote server.
   * 
   * @param {string} command - Command to execute.
   * @returns {Promise<{ stdout: string; stderr: string }>} A Promise that resolves to an object containing the stdout and stderr of the command.
   */
  private async executeRemoteCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      this.sshClient.exec(command, (err, stream) => {
        if (err) return reject(err);

        let stdout = '';
        let stderr = '';
        stream.on('data', (data: Buffer) => { stdout += data.toString(); });
        stream.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

        stream.on('close', (code: number) => {
          if (code === 0) resolve({ stdout, stderr });
          else reject(new Error(`Remote command exited with code ${code}`));
        });
      });
    });
  }

  /**
   * Constructs a SystemInfo object from raw data.
   * 
   * @param {any} rawData - Raw data retrieved from the remote server.
   * @returns {SystemInfo} A SystemInfo object containing system information.
   */
  private constructSystemInfo(rawData: any): SystemInfo {
    // Ensure you validate/transform rawData before directly assigning it
    return {
      homeFolder: rawData.homeFolder || '/',
      type: rawData.type || 'Unknown',
      release: rawData.release || 'N/A',
      platform: rawData.platform || 'N/A',
      architecture: rawData.architecture || 'N/A',
      totalMemory: rawData.totalMemory || 0,
      freeMemory: rawData.freeMemory || 0,
      uptime: rawData.uptime || 0,
      currentFolder: rawData.currentFolder || '/',
    };
  }

  /**
   * Returns the default SystemInfo object.
   * 
   * @returns {SystemInfo} A default SystemInfo object.
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
      currentFolder: '/',
    };
  }

    public async determineRemoteScriptFolder(): Promise<string> {
        // TODO smarter logic
        const remoteScriptFolder = '/tmp';
        return remoteScriptFolder;
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

}

export default SSHSystemInfoRetriever;
