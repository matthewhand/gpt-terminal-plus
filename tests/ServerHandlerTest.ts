import { expect } from 'chai';
import { ServerHandler, SystemInfo } from '../src/handlers/ServerHandler';

// Define the TestServerHandler class inside the test file
class TestServerHandler extends ServerHandler {
  currentDirectory: string;

  constructor(serverConfig: { defaultDirectory: string }) {
    super(serverConfig);
    this.currentDirectory = serverConfig.defaultDirectory;
  }

  async listFiles(directory: string, limit: number, offset: number, orderBy: string): Promise<{ items: string[], totalPages: number, responseId: string }> {
    return { items: [], totalPages: 1, responseId: 'test' };
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    return true;
  }

  async updateFile(filePath: string, pattern: string, replacement: string, backup: boolean): Promise<boolean> {
    return true;
  }

  async amendFile(filePath: string, content: string): Promise<boolean> {
    return true;
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return { os: 'linux', version: '1.0.0' };
  }

  async executeCommand(command: string, options: { timeout?: number, directory?: string, linesPerPage?: number }): Promise<{ stdout?: string, stderr?: string, pages?: string[], totalPages?: number, responseId?: string }> {
    const { directory = this.defaultDirectory } = options;
    return { stdout: `Executed ${command} in ${directory}`, stderr: '', pages: [], totalPages: 1, responseId: 'test' };
  }
}

describe('ServerHandler', () => {
  let handler: TestServerHandler;

  beforeEach(() => {
    handler = new TestServerHandler({ defaultDirectory: '/initial' });
  });

  it('should set and get the default directory', async () => {
    await handler.setDefaultDirectory('/test/dir');
    const defaultDirectory = await handler.getDefaultDirectory();
    expect(defaultDirectory).to.equal('/test/dir');
  });

  it('should use default directory if no directory is provided', async () => {
    await handler.setDefaultDirectory('/test/dir');
    const result = await handler.executeCommand('ls', {});
    expect(result.stdout).to.equal('Executed ls in /test/dir');
  });
});
