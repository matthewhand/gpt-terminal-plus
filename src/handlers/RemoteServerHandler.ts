import * as fs from 'fs';
import * as path from 'path';
import SFTPClient from 'ssh2-sftp-client';
import { ServerHandler } from './ServerHandler';
import { ServerConfig, ServerHandlerInterface, SystemInfo } from '../types';
import { Client, ClientChannel } from 'ssh2';
import { v4 as uuidv4 } from 'uuid';

export default class RemoteServerHandler extends ServerHandler implements ServerHandlerInterface {
  private conn: Client | null = null;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);

    // The serverConfig should now be loaded by the base class
    this.serverConfig.privateKeyPath = this.getPrivateKeyPath();
    this.conn = new Client();
  }

  public getCurrentDirectory(): Promise<string> {
    return Promise.resolve(this.currentDirectory);
  }

  private getPrivateKeyPath(): string {
    // Ensure the serverConfig is loaded
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }

    // Use the privateKeyPath from the serverConfig, or default to the user's home directory
    const keyPath = this.serverConfig.privateKeyPath || path.join(process.env.HOME || '', '.ssh', 'id_rsa');
    if (!fs.existsSync(keyPath)) {
      throw new Error(`Private key not found at path: ${keyPath}`);
    }
    return keyPath;
  }

  private async ensureSshConnection(): Promise<Client> {
    // Ensure the serverConfig is loaded
    if (!this.serverConfig) {
      throw new Error('Server configuration not loaded.');
    }

    if (!this.conn) {
      this.conn = new Client();
      await this.conn.connect({
        host: this.serverConfig.host,
        port: this.serverConfig.port || 22,
        username: this.serverConfig.username,
        privateKey: fs.readFileSync(this.getPrivateKeyPath()),
      });
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

  private async handleRemoteCommand(command: string, timeout: number = 0): Promise<{ stdout: string; stderr: string; code: number }> {
    const conn = await this.startNewSshConnection();
    let commandFinished = false;
    let stdoutBuffer = '';
    let stderrBuffer = '';
  
    if (!conn) {
      throw new Error('SSH connection failed');
    }
  
    return new Promise((resolve, reject) => {
      // Set a timeout for the command execution if specified
      if (timeout > 0) {
        setTimeout(() => {
          if (!commandFinished) {
            reject(new Error('Command timed out'));
            conn.end(); // Close the connection if it's still open
          }
        }, timeout);
      }
  
      conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            reject(new Error(`Command execution error: ${err.message}`));
            conn.end();
            return;
          }
  
          stream.on('data', (data: Buffer) => {
            stdoutBuffer += data.toString();
          }).stderr.on('data', (data: Buffer) => {
            stderrBuffer += data.toString();
          });
  
          stream.on('close', (code: number) => {
            commandFinished = true;
            conn.end(); // Close the connection
            resolve({ stdout: stdoutBuffer, stderr: stderrBuffer, code: code });
          });
        });
      }).on('error', (err) => {
        reject(new Error(`SSH connection error: ${err.message}`));
      });
    });
  }
  

// Updated executeRemoteCommand to use async/await and ensure connection
public async executeRemoteCommand(command: string, directory?: string): Promise<{ stdout: string; stderr: string }> {
  const conn = await this.ensureSshConnection();
  const fullCommand = directory ? `cd ${directory}; ${command}` : command;

  return new Promise((resolve, reject) => {
    conn.exec(fullCommand, (err: Error | undefined, stream: ClientChannel) => {
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
      this.handleRemoteCommand(`rm -f ${filePath}`)
        .then(() => resolve(true))
        .catch((error) => {
          console.error('Error deleting file:', error);
          reject(error);
        });
    });
  }


  private async transferFile(localPath: string, remotePath: string): Promise<void> {
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
    // Define the path for the local script
    const localScriptPath = path.join(__dirname, '..', 'scripts', 'remote_system_info.py');
    
    // Generate a UUID and use it in the remote script's filename
    const uniqueFilename = `remote_system_info_${uuidv4()}.py`;
    const remoteScriptPath = `/tmp/${uniqueFilename}`; // Temporary path on the remote server with UUID
  
    // Transfer the script to the remote server
    await this.transferFile(localScriptPath, remoteScriptPath);
  
    // Execute the script on the remote server and wait for the result
    const { stdout } = await this.executeRemoteCommand(`python3 ${remoteScriptPath}`);
  
    // Optionally delete the remote script after execution
    await this.deleteFile(remoteScriptPath);
  
    // Parse the stdout to JSON and return it as system information
    try {
      const systemInfo: SystemInfo = JSON.parse(stdout);
      return systemInfo; 
    } catch (error) {
      throw new Error(`Error parsing system info: ${error}`);
    }
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
  
  public async executeCommand(command: string, timeout: number = 5000): Promise<{ stdout: string; stderr: string }> {
    // Implementation for executeCommand using async/await
    const conn = await this.startNewSshConnection();
    let commandFinished = false;
    let stdoutBuffer = '';
    let stderrBuffer = '';

    // Set a timeout to reject the promise if the command takes too long
    const timeoutId = setTimeout(() => {
      if (!commandFinished) {
        conn.end();
        throw new Error('Command timed out - please validate execution');
      }
    }, timeout);

    return new Promise((resolve, reject) => {
      conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            clearTimeout(timeoutId);
            reject(err);
            return;
          }

          stream.on('data', (data: Buffer) => {
            stdoutBuffer += data.toString();
          }).stderr.on('data', (data) => {
            stderrBuffer += data.toString();
          });

          stream.on('close', (code: number) => {
            clearTimeout(timeoutId);
            commandFinished = true;

            if (code === 0) {
              resolve({ stdout: stdoutBuffer, stderr: stderrBuffer });
            } else {
              reject(new Error(`Command exited with code ${code}`));
            }

            conn.end(); // Close the connection
          });
        });
      }).on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
    });
  }

  public setCurrentDirectory(directory: string): boolean {
    this.currentDirectory = directory;
    return true; 
  }

}
