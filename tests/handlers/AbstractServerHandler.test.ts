import { AbstractServerHandler } from '../../src/handlers/AbstractServerHandler';
import { SystemInfo } from '../../src/types/SystemInfo';
import { PaginatedResponse } from '../../src/types/PaginatedResponse';
import { ServerConfig } from '../../src/types/ServerConfig';
import { FileReadResult } from '../../src/types/FileReadResult';

class DummyHandler extends AbstractServerHandler {
  constructor(config: any) {
    super(config);
  }

  handle() {
    return 'handled';
  }

  executeCommand() {
    return Promise.resolve({ stdout: '', stderr: '', success: true, exitCode: 0 });
  }

  executeCode() {
    return Promise.resolve({ stdout: '', stderr: '' });
  }

  createFile() {
    return Promise.resolve(true);
  }

  updateFile() {
    return Promise.resolve(true);
  }

  deleteFile() {
    return Promise.resolve(true);
  }

  getFileContent() {
    return Promise.resolve('file content');
  }

    getSystemInfo(): Promise<SystemInfo> {
        return Promise.resolve({
            type: 'dummy',
            platform: 'dummy',
            architecture: 'dummy',
            totalMemory: 0,
            freeMemory: 0,
            cpus: 0,
            uptime: 0,
            currentFolder: '.'
        });
    }

    listCodeDefinitionNames() {
        return Promise.resolve([]);
    }

    listDirectoryContents() {
        return Promise.resolve([]);
    }

    searchFiles() {
        return Promise.resolve([]);
    }
    
    applyDiff() {
        return Promise.resolve(true);
    }

    listFiles(params: { directory: string, limit?: number, offset?: number, orderBy?: string }): Promise<PaginatedResponse<string>> {
        return Promise.resolve({
            items: [],
            limit: params.limit ?? 0,
            offset: params.offset ?? 0,
            total: 0
        });
    }

    setServerConfig(config: ServerConfig): void {
        // dummy implementation
    }

    presentWorkingDirectory(): Promise<string> {
        return Promise.resolve('.');
    }

    readFile(filePath: string, options?: { startLine?: number; endLine?: number; encoding?: string; maxBytes?: number }): Promise<FileReadResult> {
        return Promise.resolve({
            filePath,
            content: 'file content',
            encoding: 'utf8',
            startLine: 1,
            endLine: 1,
            truncated: false
        });
    }

    amendFile(filePath: string, content: string, options?: { backup?: boolean }): Promise<boolean> {
        return Promise.resolve(true);
    }

    changeDirectory(directory: string): Promise<boolean> {
        return Promise.resolve(true);
    }
}

describe('AbstractServerHandler', () => {
    it('should allow extension and basic functionality', async () => {
        const handler = new DummyHandler({ hostname: 'local', protocol: 'local', llm: { provider: 'ollama', baseUrl: '' } } as any);
        expect(handler.handle()).toBe('handled');
        // executeCommand returns a minimally valid ExecutionResult
        await expect(handler.executeCommand('echo ok')).resolves.toEqual({ stdout: '', stderr: '', success: true, exitCode: 0 });
        // listFiles echoes pagination inputs
        await expect(handler.listFiles({ directory: '.', limit: 2, offset: 5, orderBy: 'filename' as any })).resolves.toEqual({ items: [], limit: 2, offset: 5, total: 0 });
        // presentWorkingDirectory and changeDirectory basic behavior
        await expect(handler.presentWorkingDirectory()).resolves.toBe('.');
        await expect(handler.changeDirectory('..')).resolves.toBe(true);
    });
});
