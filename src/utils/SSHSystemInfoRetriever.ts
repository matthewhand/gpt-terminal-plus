import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'ssh2';
import Debug from 'debug';
import { SystemInfo } from '../types';
import SFTPClient from 'ssh2-sftp-client';
import { v4 as uuidv4 } from 'uuid';
const debug = Debug('app:SSHSystemInfoRetriever');

const PYTHON_SCRIPT = 'remote_system_info.py';
const BASH_SCRIPT = 'remote_system_info.sh';

class SSHSystemInfoRetriever {
    private serverConfig: any;
    private sshClient: Client;

    constructor(serverConfig: any, sshClient: Client) {
        this.serverConfig = serverConfig;
        this.sshClient = sshClient;
    }

    public async getSystemInfo(): Promise<SystemInfo> {
        const scriptType = this.serverConfig.systemInfo === "python" ? PYTHON_SCRIPT : BASH_SCRIPT;
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

        try {
            await this.transferAndExecuteScript(localScriptPath, remoteScriptPath, command);
            const stdout = await this.retrieveScriptOutput(remoteScriptPath);
            return this.constructSystemInfo(JSON.parse(stdout));
        } catch (error) {
            debug(`Failed to execute system info script or parse output: ${error}`);
            throw new Error('Failed to retrieve system info.');
        }
    }

    private async transferAndExecuteScript(localScriptPath: string, remoteScriptPath: string, command: string) {
        const sftp = new SFTPClient();
        await sftp.connect({
            host: this.serverConfig.host,
            port: 22,
            username: this.serverConfig.username,
            privateKey: fs.readFileSync(this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa')),
        });

        await sftp.put(localScriptPath, remoteScriptPath);
        await sftp.end();

        await this.executeRemoteCommand(`${command} ${remoteScriptPath}`);
        await this.executeRemoteCommand(`rm -f ${remoteScriptPath}`);
    }

    private async retrieveScriptOutput(remoteScriptPath: string): Promise<string> {
        const { stdout } = await this.executeRemoteCommand(`cat ${remoteScriptPath}`);
        return stdout;
    }

    private async executeRemoteCommand(command: string): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            this.sshClient.exec(command, (err, stream) => {
                if (err) reject(err);

                let stdout = '';
                let stderr = '';
                stream.on('data', (data) => { stdout += data.toString(); });
                stream.stderr.on('data', (data) => { stderr += data.toString(); });

                stream.on('close', (code) => {
                    if (code === 0) resolve({ stdout, stderr });
                    else reject(new Error(`Remote command exited with code ${code}`));
                });
            });
        });
    }

    private constructSystemInfo(rawData: any): SystemInfo {
        return {
            homeFolder: rawData.homeFolder || '/',
            type: rawData.type || 'Unknown',
            release: rawData.release || 'N/A',
            platform: rawData.platform || 'N/A',
            architecture: rawData.architecture || 'N/A',
            totalMemory: rawData.totalMemory || 0,
            freeMemory: rawData.freeMemory || 0,
            uptime: rawData.uptime || 0,
            currentFolder: rawData.currentFolder || '/'
        };
    }

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
}

export default SSHSystemInfoRetriever;
