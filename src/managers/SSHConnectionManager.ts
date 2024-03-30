/**
 * SSHConnectionManager: A Comprehensive Tool for Managing SSH Connections
 *
 * Overview:
 * The SSHConnectionManager class is designed to simplify and encapsulate the complexities
 * of managing SSH connections to remote servers. It provides a robust and flexible API
 * for establishing SSH connections, executing commands, and performing file operations
 * securely over SSH. By abstracting the details of the ssh2 library and SSH protocol
 * interactions, it offers a streamlined and intuitive interface for developers.
 *
 * Key Features:
 * - Connection Lifecycle Management: Supports connecting and disconnecting to and from
 *   remote servers, including handling of connection readiness and error events.
 * - Singleton Pattern: Ensures a single instance of the connection manager per server
 *   configuration, optimizing resource usage and simplifying connection handling.
 * - Command Execution: Facilitates executing commands on the remote server, capturing
 *   output and errors, and providing asynchronous command execution capabilities.
 * - File Operations: Offers a suite of methods for remote file management, including
 *   listing files, uploading and downloading files, leveraging the SFTP protocol
 *   for secure file transfer.
 * - Reconnection Support: Implements a method for reconnecting to the server, enhancing
 *   reliability and ease of use in long-running applications or scripts.
 * - Connection Status Checking: Includes a method to check the current status of the
 *   SSH connection, allowing for responsive application logic based on connection state.
 *
 * Usage:
 * The SSHConnectionManager class is intended to be instantiated with specific server
 * configurations, and then used to perform various SSH-based operations. It abstracts
 * the lower-level details of SSH connection setup and management, command execution,
 * and file transfer protocols, presenting a clear and concise API to the developer.
 *
 * By providing a comprehensive toolset for SSH interaction within a single, unified
 * class, the SSHConnectionManager significantly reduces the complexity of remote server
 * management tasks, making it an invaluable asset for applications that require
 * sophisticated SSH capabilities.
 */
import { Client } from "ssh2";
import Debug from "debug";
import { ServerConfig } from "../types";

const debug = Debug("app:SSHConnectionManager");

class SSHConnectionManager {
  private static instances: Record<string, SSHConnectionManager> = {};
  constructor(private serverConfig: ServerConfig) {
    this.conn = new Client();
    this.conn.on("ready", () => debug("Connection ready"));
    this.conn.on("error", (err) => debug(`Connection error: ${err.message}`));
    this.conn.connect({
      host: serverConfig.host,
      port: serverConfig.port,
      username: serverConfig.username,
      password: serverConfig.password
    });
  }

  public static getInstance(serverConfig: ServerConfig): SSHConnectionManager {
    const identifier = `${serverConfig.host}:${serverConfig.port}`;
    if (!this.instances[identifier]) {
      this.instances[identifier] = new SSHConnectionManager(serverConfig);
    }
    return this.instances[identifier];
  }

  // Additional methods for managing the connection lifecycle can be added here.
}

export default SSHConnectionManager;
  // Establishes a new SSH connection based on the provided server configuration
  connect() {
    if (!this.conn) this.conn = new Client();
    return new Promise((resolve, reject) => {
      this.conn.on('ready', () => {
        debug('SSH connection established.');
        resolve(true);
      }).on('error', (err) => {
        debug('Error establishing SSH connection:', err);
        reject(err);
      }).connect({
        host: this.serverConfig.host,
        port: this.serverConfig.port,
        username: this.serverConfig.username,
        password: this.serverConfig.password,
      });
    });
  }

  // Disconnects the current SSH connection
  disconnect() {
    if (this.conn) {
      this.conn.end();
      debug('SSH connection closed.');
    }
  }

  // Reconnects the SSH connection with the current server configuration
  async reconnect() {
    this.disconnect();
    await this.connect();
    debug('SSH connection re-established.');
  }

  // Checks if the SSH connection is currently active
  isConnected() {
    return this.conn && this.conn.connected;
  }

  // Executes a command on the remote server via the SSH connection
  async executeCommand(command: string): Promise<string> {
    if (!this.isConnected()) {
      throw new Error('SSH connection is not established.');
    }
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) reject(err);
        let data = '';
        stream.on('data', (chunk) => { data += chunk.toString(); }).on('close', () => {
          debug('Command executed:', command);
          resolve(data);
        });
      });
    });
  }

  // Retrieves a list of files from the specified directory on the remote server
  async listFiles(directory: string): Promise<string[]> {
    if (!this.isConnected()) {
      throw new Error('SSH connection is not established.');
    }
    return new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        if (err) reject(err);
        sftp.readdir(directory, (err, list) => {
          if (err) {
            reject(err);
          } else {
            const filenames = list.map((file) => file.filename);
            resolve(filenames);
          }
        });
      });
    });
  }

  // Uploads a file to the specified directory on the remote server
  async uploadFile(localPath: string, remotePath: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('SSH connection is not established.');
    }
    return new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        if (err) reject(err);
        sftp.fastPut(localPath, remotePath, (err) => {
          if (err) {
            reject(err);
          } else {
            debug('File uploaded successfully:', remotePath);
            resolve();
          }
        });
      });
    });
  }

  // Downloads a file from the remote server to the specified local path
  async downloadFile(remotePath: string, localPath: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('SSH connection is not established.');
    }
    return new Promise((resolve, reject) => {
      this.conn.sftp((err, sftp) => {
        if (err) reject(err);
        sftp.fastGet(remotePath, localPath, (err) => {
          if (err) {
            reject(err);
          } else {
            debug('File downloaded successfully:', localPath);
            resolve();
          }
        });
      });
    });
  }

