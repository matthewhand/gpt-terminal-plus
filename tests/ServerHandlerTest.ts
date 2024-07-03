import { expect } from 'chai';
import ServerHandler from '../src/handlers/ServerHandler';

class TestServerHandler extends ServerHandler {
  async listFiles(directory: string, limit: number, offset: number, orderBy: string): Promise<{ items: string[], totalPages: number, responseId: string }> {
    return { items: [], totalPages: 1, responseId: 'test' };
  }

  async createFile(directory: string, filename: string, content: string, backup: boolean): Promise<boolean> {
    return true;
  }

  async getSystemInfo(): Promise<object> {
    return { os: 'linux', version: '1.0.0' };
  }

  async executeCommand(command: string, directory: string = this.defaultDirectory): Promise<string> {
    return `Executed ${command} in ${directory}`;
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
    const result = await handler.executeCommand('ls');
    expect(result).to.equal('Executed ls in /test/dir');
  });
});
