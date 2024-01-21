import * as fs from 'fs';
import * as path from 'path';
import SFTPClient from 'ssh2-sftp-client';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, ServerHandlerInterface, SystemInfo } from '../types';
import { Client, ClientChannel } from 'ssh2';
import { v4 as uuidv4 } from 'uuid';
import Debug from 'debug';
const debug = Debug('app:SshServerHandler');

const PYTHON_SCRIPT = 'remote_system_info.py';
const BASH_SCRIPT = 'remote_system_info.sh';

export default class SshServerHandler extends ServerHandler implements ServerHandlerInterface {
  private conn: Client | null = null;
  private privateKeyPath: string; // Add a private variable for the private key path

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.privateKeyPath = this.getPrivateKeyPath();
    // this.conn = new Client();
  }

private async getSSHConnection(): Promise<Client | null> {
  return new Promise(async (resolve, reject) => {
    if (this.conn) {
      resolve(this.conn);
    } else {
      this.conn = new Client();
      this.conn.on('ready', () => {
        resolve(this.conn);
      });
      this.conn.on('error', (err) => {
        reject(err);
      });
      await this.conn.connect({
        host: this.serverConfig.host,
        port: this.serverConfig.port || 22,
        username: this.serverConfig.username,
        privateKey: fs.readFileSync(this.privateKeyPath),
      });
    }
  });
}

  private getPrivateKeyPath(): string {
    // Check if privateKeyPath is provided in serverConfig and return it
    // Otherwise, return the default path
    return this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa');
  }

  // public getCurrentDirectory(): Promise<string> {
  //   return Promise.resolve(this.currentDirectory);
  // }

  private async ensureSshConnection(): Promise<Client> {
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }

    if (!this.conn) {
      this.conn = new Client();
      try {
        await this.conn.connect({
          host: this.serverConfig.host,
          port: this.serverConfig.port || 22,
          username: this.serverConfig.username,
          privateKey: fs.readFileSync(this.getPrivateKeyPath()),
        });
      } catch (err) {
        console.error(`SSH connection failed: ${err}`);
        throw new Error('Failed to establish SSH connection.');
      }
    }

    return this.conn;
  }


  private async startNewSshConnection(): Promise<Client> {
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }

    if (!this.conn) {
      this.conn = new Client();
      // ... (rest of the connection setup)
      try {
        await this.conn.connect({
          host: this.serverConfig.host,
          port: this.serverConfig.port || 22,
          username: this.serverConfig.username,
          privateKey: fs.readFileSync(await this.getPrivateKeyPath()),
        });
        return this.conn; // Return the connection directly
      } catch (err) {
        this.conn = null; // Reset the connection
        throw err; // Rethrow the error to be handled by the caller
      }
    } else {
      return this.conn;
    }
  }

  public async executeCommand(command: string, timeout?: number, directory?: string): Promise<{ stdout: string; stderr: string }> {
    try {
      const fullCommand = directory ? `cd ${directory}; ${command}` : command;
      return await this.executeRemoteCommand(fullCommand);
    } catch (error) {
      console.error('Error executing remote command:', error);
      throw new Error('Remote command execution failed.');
    }
  }

  // Implement the abstract method 'amendFile' from ServerHandler
  public async amendFile(filePath: string, content: string, backup: boolean = true): Promise<boolean> {
    try {
      await this.handleRemoteFileAmendment(filePath, content, backup);
      return true; // Return true if the operation was successful
    } catch (error) {
      console.error('Error amending file:', error);
      throw error; // Rethrow the error or handle it as needed
    }
  }
  
  // Reuse this method for the amendFile implementation
  private async handleRemoteFileAmendment(filePath: string, content: string, backup: boolean = true): Promise<void> {
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }
    const sftp = new SFTPClient();
    await sftp.connect({
      host: this.serverConfig.host,
      port: this.serverConfig.port || 22,
      username: this.serverConfig.username,
      privateKey: fs.readFileSync(this.getPrivateKeyPath()),
    });

    // Check if the file exists and create a backup if required
    if (backup && await sftp.exists(filePath)) {
      const timestamp = Date.now();
      const backupFilePath = `${filePath}.${timestamp}.bak`;
      await sftp.rename(filePath, backupFilePath);
    }

    // Get the original content of the file
    const originalContent = await sftp.get(filePath);
    const amendedContent = originalContent.toString() + content;

    // Put the amended content back into the file
    await sftp.put(Buffer.from(amendedContent), filePath);

    await sftp.end();
  }
    
  public async listFiles(
    directory: string,
    limit: number = 42,
    offset: number = 0,
    orderBy: "datetime" | "filename" = "filename"
  ): Promise<string[]> {
    let command: string;

    if (this.serverConfig == null) {
      throw new Error("serverConfig is not initialized");
    }

    if (this.serverConfig.posix === false) {
      // Use Windows commands
      directory = directory.replace(/\//g, '\\'); // Replace forward slashes with backslashes for Windows paths
      command = `dir ${directory} /b /a:-d`; // Basic command to list files in a directory in Windows
      if (orderBy === 'datetime') {
        // If ordering by datetime is attempted on a Windows server, throw an error
        throw new Error("Ordering by datetime is not implemented on remote Windows servers.");
      }
    } else {
      // Use POSIX commands
      command = `ls -1 ${directory}`; // Basic command to list files in a directory in POSIX
      if (orderBy === 'datetime') {
        command = `ls -lt ${directory} | awk '{print $9}'`; // Order by date
      }
    }
  
    try {
      const { stdout } = await this.executeRemoteCommand(command);
      let files = stdout.split('\n').filter(Boolean);
  
      files = files.sort();
      return files.slice(offset, offset + limit);
    } catch (error) {
      throw new Error(`Error listing files: ${error}`);
    }
  }
  
public async fileExists(filePath: string): Promise<boolean> {
  try {
    const conn = await this.ensureSshConnection();
    return new Promise((resolve, reject) => {
      conn.exec(`test -f ${filePath} && echo exists || echo notexists`, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let result = '';
        stream.on('data', (data: Buffer) => {
          result += data.toString();
        });

        stream.on('close', () => {
          resolve(result.trim() === 'exists');
          conn.end(); // Close the connection
        });
      });
    });
  } catch (error) {
    console.error('Error checking file existence:', error);
    throw error;
  }
}

  public async handleRemoteFileCreation(filePath: string, content: string): Promise<void> {
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }

    const client = new SFTPClient();
    await client.connect({
      host: this.serverConfig.host,
      port: this.serverConfig.port || 22,
      username: this.serverConfig.username,
      privateKey: fs.readFileSync(this.getPrivateKeyPath()),
    });
    await client.put(Buffer.from(content), filePath);
    await client.end();
  }

public async createFile(directory: string, filename: string, content: string, backup: boolean = true): Promise<boolean> {
  const sftp = new SFTPClient();
  const filePath = path.join(directory, filename); // Combine directory and filename to get the full path

  try {
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }
    await sftp.connect({
      host: this.serverConfig.host,
      port: this.serverConfig.port || 22,
      username: this.serverConfig.username,
      privateKey: fs.readFileSync(this.getPrivateKeyPath()),
    });

    // Check if the file exists and create a backup if required
    if (backup && await sftp.exists(filePath)) {
      const timestamp = Date.now();
      const backupFilePath = `${filePath}.${timestamp}.bak`;
      await sftp.rename(filePath, backupFilePath);
    }

    // Put the new content in the file (this will create a new file or replace an existing one)
    await sftp.put(Buffer.from(content), filePath);

    return true;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error; // Rethrow the error to be handled by the caller
  } finally {
    await sftp.end();
  }
}

private async handleRemoteFileUpdate(filePath: string, pattern: string, replacement: string, backup: boolean = true): Promise<void> {
  if (!this.serverConfig) {
    throw new Error('Server configuration not loaded.');
  }
  const sftp = new SFTPClient();
  await sftp.connect({
    host: this.serverConfig.host,
    port: this.serverConfig.port || 22,
    username: this.serverConfig.username,
    privateKey: fs.readFileSync(this.getPrivateKeyPath()),
  });

  try {
    // Check if the file exists and create a backup if required
    if (backup && await sftp.exists(filePath)) {
      const timestamp = Date.now();
      const backupFilePath = `${filePath}.${timestamp}.bak`;
      await sftp.rename(filePath, backupFilePath);
    }

    const originalContent = await sftp.get(filePath);
    const modifiedContent = originalContent.toString().replace(new RegExp(pattern, 'g'), replacement);
    await sftp.put(Buffer.from(modifiedContent), filePath);
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  } finally {
    await sftp.end();
  }
}

public async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
  try {
    await this.handleRemoteFileUpdate(filePath, pattern, replacement, backup);
    return true;
  } catch (error) {
    console.error('Error updating file:', error);
    return false;
  }
}

  public deleteFile(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.executeRemoteCommand(`rm -f ${filePath}`)
        .then(() => resolve(true))
        .catch((error) => {
          console.error('Error deleting file:', error);
          reject(error);
        });
    });
  }


  private async transferFile(localPath: string, remotePath: string): Promise<void> {
    debug(`transferFile called: ${localPath} -> ${remotePath}`);
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }
    const sftp = new SFTPClient();
    await sftp.connect({
      host: this.serverConfig.host,
      port: this.serverConfig.port || 22, // Default to port 22 if not specified
      username: this.serverConfig.username,
      privateKey: fs.readFileSync(this.getPrivateKeyPath()),
    });
    await sftp.put(localPath, remotePath);
    await sftp.end();
  }

public async getSystemInfo(): Promise<SystemInfo> {
  debug("getSystemInfo called");
  if (!this.serverConfig) {
    throw new Error('Server configuration not loaded.');
  }

  const scriptType = this.serverConfig.systemInfo === "python" ? PYTHON_SCRIPT : BASH_SCRIPT;
  const command = this.serverConfig.systemInfo === "python" ? 'python3' : 'bash';

  try {
    return await this.executeSystemInfoScript(scriptType, command);
  } catch (error) {
    throw new Error(`Error retrieving system info: ${error}`);
  }
}

private async executeSystemInfoScript(scriptName: string, command: string): Promise<SystemInfo> {
  debug("executeSystemInfoScript called");
  const localScriptPath = `${__dirname}/../scripts/${scriptName}`;
  const uniqueFilename = `remote_system_info_${uuidv4()}.${scriptName.split('.').pop()}`;
  const remoteScriptPath = `/tmp/${uniqueFilename}`;

  await this.transferFile(localScriptPath, remoteScriptPath);
  const { stdout } = await this.executeRemoteCommand(`${command} ${remoteScriptPath}`);
  debug("System info retrieved: ", { stdout });
  await this.deleteFile(remoteScriptPath);
  debug("Temporary file removed: ", { remoteScriptPath });

  return JSON.parse(stdout);
}

    public async setCurrentFolder(directory: string): Promise<boolean> {
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }
    try {
      // Determine the command to check if the directory exists based on the posix flag
      const checkCommand = this.serverConfig.posix !== false ? `test -d "${directory}" && echo "exists"` : `if exist "${directory}" echo exists`;
  
      // Execute the command on the remote server
      const result = await this.executeRemoteCommand(checkCommand);
  
      // Check the command output to determine if the directory exists
      if (result.stdout.trim() === "exists") {
        this.currentDirectory = directory;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error setting current folder:', error);
      return false;
    }
  }

  // Helper method for executing commands
  private async executeRemoteCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    debug("executeRemoteCommand: ", { command });
    const conn = await this.getSSHConnection();
    if (!conn) {
      throw new Error('SSH connection failed');
    }
    //debug("SSH connection established: ", { conn });

    return new Promise((resolve, reject) => {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(new Error(`Command execution error: ${err.message}`));
          return;
        }

        let stdoutBuffer = '';
        let stderrBuffer = '';

        stream.on('data', (data: Buffer) => {
          stdoutBuffer += data.toString();
        });

        stream.stderr.on('data', (data: Buffer) => {
          stderrBuffer += data.toString();
        });

        stream.on('close', (code: number) => {
          if (code === 0) {
            resolve({ stdout: stdoutBuffer, stderr: stderrBuffer });
          } else {
            reject(new Error(`Remote command exited with code ${code}`));
          }
        });
      });
    });
  }

  // public setCurrentDirectory(directory: string): boolean {
  //   this.currentDirectory = directory;
  //   return true; 
  // }

}
