import fs from 'fs/promises';
import path from 'path';
import { Client } from 'ssh2';
import Debug from 'debug';
import { ServerConfig, SystemInfo } from '../types';
import SFTPClient from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid';

const debug = Debug('app:SSHSystemInfoRetriever');

const PYTHON_SCRIPT = 'remote_system_info.py';
const BASH_SCRIPT = 'remote_system_info.sh';

class SSHSystemInfoRetriever {
  private sshClient: Client;
  private serverConfig: ServerConfig;

  constructor(sshClient: Client, serverConfig: ServerConfig) {
    this.sshClient = sshClient;
    this.serverConfig = serverConfig;
  }

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
    if (this.serverConfig.cleanupScripts !== false) {
      await this.executeRemoteCommand(`rm -f ${remoteScriptPath} ${remoteScriptPath}.out`);
    }
    await sftp.end();
  }

  private async getPrivateKey(): Promise<Buffer> {
    try {
      return await fs.readFile(this.serverConfig.privateKeyPath ?? path.join(process.env.HOME || '', '.ssh', 'id_rsa'));
    } catch (error) {
      debug(`Failed to read private key: ${error}`);
      throw new Error(`Failed to read private key: ${error}`);
    }
  }

  private async retrieveScriptOutput(remoteScriptPath: string): Promise<string> {
    const { stdout } = await this.executeRemoteCommand(`cat ${remoteScriptPath}`);
    return stdout;
  }

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

  private constructSystemInfo(rawData: Partial<SystemInfo>): SystemInfo {
    // Explicitly specify that rawData is a Partial<SystemInfo>
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
      // Include other fields as necessary
    };
  }

  private getDefaultSystemInfo(): SystemInfo {
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
}

export default SSHSystemInfoRetriever;
