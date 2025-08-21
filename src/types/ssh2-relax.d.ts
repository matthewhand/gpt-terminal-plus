declare module 'ssh2' {
  type SftpReadFileCallback = (err: Error | null, data: Buffer) => void;

  // Minimal SFTP wrapper for tests
  interface SFTPWrapper {
    readFile(path: string, callback: SftpReadFileCallback): void;
  }

  class Client {
    on(event: string | symbol, listener: (...args: any[]) => any): this;
    once(event: string | symbol, listener: (...args: any[]) => any): this;
    connect(config: any): this;
    exec(command: string, callback: (err: Error | null, stream: any) => void): void;

    // Add sftp support with typed callback params to avoid implicit any
    sftp(callback: (err: Error | null, sftp: SFTPWrapper) => void): void;

    end(): void;
  }
  export { Client, SFTPWrapper };
}