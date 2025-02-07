import { AbstractServerHandler } from '../../src/handlers/AbstractServerHandler';
import { SystemInfo } from '../../src/types/SystemInfo';
import { PaginatedResponse } from '../../src/types/PaginatedResponse';
import { ServerConfig } from '../../src/types/ServerConfig';

class DummyHandler extends AbstractServerHandler {
  constructor(config: any) {
    super(config);
  }

  handle() {
    return 'handled';
  }

  executeCommand() {
    return Promise.resolve({ stdout: '', stderr: '' });
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
}

describe('AbstractServerHandler', () => {
    it('should allow extension and basic functionality', () => {
        const handler = new DummyHandler({});
        expect(handler.handle()).toBe('handled');
    });
});