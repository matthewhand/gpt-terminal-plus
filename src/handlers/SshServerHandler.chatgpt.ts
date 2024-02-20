import { Client } from "ssh2";
import Debug from "debug";
import { ServerConfig } from "../types";

class SSHConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSHConnectionError";
  }
}

class SSHAuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSHAuthenticationError";
  }
}

const debug = Debug("app:SshServerHandler");

export class SshServerHandler {
  private conn: Client | null = null;
  private serverConfig: ServerConfig;

  constructor(serverConfig: ServerConfig) {
    this.serverConfig = serverConfig;
  }

  private async ensureConnection(): Promise<Client> {
    if (this.conn) return this.conn;

    this.conn = new Client();
    return new Promise((resolve, reject) => {
      this.conn.on("ready", () => resolve(this.conn)).on("error", (err) => {
        if (err.level === "client-authentication") {
          reject(new SSHAuthenticationError("SSH Authentication failed"));
        } else {
          reject(new SSHConnectionError("Failed to establish SSH connection"));
        }
        debug(`SSH connection error: ${err}`);
      });

      this.conn.connect({
        host: this.serverConfig.host,
        port: this.serverConfig.port || 22,
        username: this.serverConfig.username,
        privateKey: this.getPrivateKey(),
      });
    });
  }

  private getPrivateKey(): Buffer {
    // Implementation for private key retrieval
  }

  // Additional methods...
}
