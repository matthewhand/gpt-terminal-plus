import { AbstractServerHandler } from '../../src/handlers/AbstractServerHandler';
import { ExecutionResult } from '../../src/types/ExecutionResult';
import { PaginatedResponse } from '../../src/types/PaginatedResponse';
import { ServerConfig } from '../../src/types/ServerConfig';

class TestHandler extends AbstractServerHandler {
  public lastExecuteArgs: { command: string; timeout?: number; directory?: string } | null = null;

  executeCommand(command: string, timeout?: number, directory?: string): Promise<ExecutionResult> {
    this.lastExecuteArgs = { command, timeout, directory };
    // Reflect current protocol in stdout to verify setServerConfig effects
    return Promise.resolve({ stdout: `run:${command}@${this.serverConfig.protocol}`, stderr: '', success: true, exitCode: 0 });
  }

  listFiles(params: { directory: string; limit?: number; offset?: number; orderBy?: 'datetime' | 'filename' }): Promise<PaginatedResponse<{ name: string; isDirectory: boolean }>> {
    const { limit = 10, offset = 0 } = params;
    return Promise.resolve({ items: [], limit, offset, total: 0 });
  }

  setServerConfig(config: ServerConfig): void {
    // use base implementation field
    (this as any).serverConfig = config;
  }

  presentWorkingDirectory(): Promise<string> {
    return Promise.resolve('/tmp');
  }

  changeDirectory(directory: string): Promise<boolean> {
    return Promise.resolve(directory.length > 0);
  }
}

describe('AbstractServerHandler (enhanced behavior)', () => {
  it('captures executeCommand arguments and returns typed result', async () => {
    const handler = new TestHandler({ hostname: 'local', protocol: 'local', llm: { provider: 'ollama', baseUrl: '' } } as any);
    const res = await handler.executeCommand('echo test', 1000, '/work');
    expect(handler.lastExecuteArgs).toEqual({ command: 'echo test', timeout: 1000, directory: '/work' });
    expect(res.success).toBe(true);
    expect(res.exitCode).toBe(0);
    expect(typeof res.stdout).toBe('string');
  });

  it('setServerConfig updates behavior used by implementations', async () => {
    const handler = new TestHandler({ hostname: 'local', protocol: 'local', llm: { provider: 'ollama', baseUrl: '' } } as any);
    let res = await handler.executeCommand('whoami');
    expect(res.stdout).toContain('@local');
    handler.setServerConfig({ hostname: 'remote', protocol: 'ssh', llm: { provider: 'openai', baseUrl: '' } } as any);
    res = await handler.executeCommand('whoami');
    expect(res.stdout).toContain('@ssh');
  });

  it('listFiles returns a well-formed PaginatedResponse', async () => {
    const handler = new TestHandler({ hostname: 'local', protocol: 'local', llm: { provider: 'ollama', baseUrl: '' } } as any);
    const page = await handler.listFiles({ directory: '/tmp', limit: 5, offset: 10, orderBy: 'filename' });
    expect(page).toEqual({ items: [], limit: 5, offset: 10, total: 0 });
  });

  it('presentWorkingDirectory and changeDirectory basic behaviors', async () => {
    const handler = new TestHandler({ hostname: 'local', protocol: 'local', llm: { provider: 'ollama', baseUrl: '' } } as any);
    await expect(handler.presentWorkingDirectory()).resolves.toBe('/tmp');
    await expect(handler.changeDirectory('')).resolves.toBe(false);
    await expect(handler.changeDirectory('/any')).resolves.toBe(true);
  });
});

