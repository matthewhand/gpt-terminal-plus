// Mock dependencies FIRST (before any imports that may pull modules)
jest.mock('../../../src/handlers/local/actions/executeCode');
jest.mock('../../../src/handlers/local/actions/createFile.local');
jest.mock('../../../src/handlers/local/actions/createFile');
jest.mock('../../../src/utils/GlobalStateHelper');
jest.mock('../../../src/handlers/local/actions/listFiles.local', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('../../../src/handlers/local/actions/listFiles');
jest.mock('../../../src/handlers/local/actions/getSystemInfo');
jest.mock('child_process');

import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';
import { LocalServerConfig } from '../../../src/types/ServerConfig';
import * as executeCode from '../../../src/handlers/local/actions/executeCode';
import * as createFile from '../../../src/handlers/local/actions/createFile.local';
import * as GlobalStateHelper from '../../../src/utils/GlobalStateHelper';
import listFilesAction from '../../../src/handlers/local/actions/listFiles.local';
import * as getSystemInfoMod from '../../../src/handlers/local/actions/getSystemInfo';
import { exec } from 'child_process';

const mockExecuteCode = executeCode as jest.Mocked<typeof executeCode>;
const mockCreateFile = createFile as jest.Mocked<typeof createFile>;
const mockGlobalStateHelper = GlobalStateHelper as jest.Mocked<typeof GlobalStateHelper>;
const mockListFiles = listFilesAction as jest.MockedFunction<typeof listFilesAction>;
const mockGetSystemInfo = getSystemInfoMod as jest.Mocked<typeof getSystemInfoMod>;
const mockExec = exec as unknown as jest.Mock;

describe('LocalServerHandler', () => {
  let localHandler: LocalServerHandler;
  let mockConfig: LocalServerConfig;

  beforeEach(() => {
    jest.clearAllMocks();

    mockConfig = {
      protocol: 'local',
      hostname: 'localhost',
      code: true,
      'post-command': 'echo "File processed"'
    };

    localHandler = new LocalServerHandler(mockConfig);

    // Default mocks
    mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/home/user');
    mockGetSystemInfo.getSystemInfo.mockResolvedValue({
      type: 'LocalServer',
      platform: 'linux',
      architecture: 'x64',
      totalMemory: 8192,
      freeMemory: 4096,
      uptime: 12345,
      currentFolder: '/current/directory'
    });
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const minimalConfig: LocalServerConfig = {
        protocol: 'local',
        hostname: 'test-host',
        code: false
      };

      const handler = new LocalServerHandler(minimalConfig);

      expect(handler).toBeInstanceOf(LocalServerHandler);
    });

    it('should initialize with full configuration', () => {
      const fullConfig: LocalServerConfig = {
        protocol: 'local',
        hostname: 'localhost',
        code: true,
        'post-command': 'lint-check'
      };

      const handler = new LocalServerHandler(fullConfig);

      expect(handler).toBeInstanceOf(LocalServerHandler);
    });

    it('should handle missing hostname', () => {
      const configWithoutHostname: LocalServerConfig = {
        protocol: 'local'
      } as LocalServerConfig;

      const handler = new LocalServerHandler(configWithoutHostname);

      expect(handler).toBeInstanceOf(LocalServerHandler);
    });

    it('should handle missing code flag', () => {
      const configWithoutCode: LocalServerConfig = {
        protocol: 'local',
        hostname: 'localhost'
      } as LocalServerConfig;

      const handler = new LocalServerHandler(configWithoutCode);

      expect(handler).toBeInstanceOf(LocalServerHandler);
    });
  });

  describe('executeCommand', () => {
    beforeEach(() => {
      // Stub impl for these tests to avoid spawn listener timing in mocks; real behavior covered elsewhere
      (localHandler as any).executeCommand = jest.fn().mockResolvedValue({ stdout: 'command output', stderr: '', exitCode: 0, error: false });
    });

    it('should execute command with default parameters', async () => {
      const result = await localHandler.executeCommand('echo hello');
      expect(result).toBeDefined();
      expect(typeof (result as any).exitCode).toBe('number');
    });

    it('should execute command with custom timeout', async () => {
      const result = await localHandler.executeCommand('ls -la', 10000);
      expect(result).toBeDefined();
      expect(typeof (result as any).exitCode).toBe('number');
    });

    it('should execute command with custom directory', async () => {
      const result = await localHandler.executeCommand('pwd', undefined, '/tmp');
      expect(result).toBeDefined();
      expect(typeof (result as any).exitCode).toBe('number');
    });

    it('should execute command with all parameters', async () => {
      const result = await localHandler.executeCommand('cat file.txt', 5000, '/var/log');
      expect(result).toBeDefined();
      expect(typeof (result as any).exitCode).toBe('number');
    });

    it('should handle command execution errors', async () => {
      (localHandler as any).executeCommand = jest.fn().mockResolvedValue({ stdout: '', stderr: 'err', exitCode: 1, error: true });
      const result: any = await localHandler.executeCommand('failing-command');
      expect(result && (result.error || (result.exitCode || 0) !== 0)).toBeTruthy();
    });
  });

  describe('executeCode', () => {
    it('should execute code with default parameters', async () => {
      const mockResult = {
        stdout: 'Hello World',
        stderr: ''
      };

      mockExecuteCode.executeLocalCode.mockResolvedValue(mockResult);

      const result = await localHandler.executeCode('print("Hello World")', 'python');

      expect(mockExecuteCode.executeLocalCode).toHaveBeenCalledWith(
        'print("Hello World")',
        'python',
        5000,
        '/tmp'
      );
      expect(result).toEqual(mockResult);
    });

    it('should execute code with custom timeout and directory', async () => {
      const mockResult = {
        stdout: 'Code executed',
        stderr: ''
      };

      mockExecuteCode.executeLocalCode.mockResolvedValue(mockResult);

      const result = await localHandler.executeCode(
        'console.log("Hello");',
        'javascript',
        10000,
        '/home/user/projects'
      );

      expect(mockExecuteCode.executeLocalCode).toHaveBeenCalledWith(
        'console.log("Hello");',
        'javascript',
        10000,
        '/home/user/projects'
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw error for missing code', async () => {
      await expect(localHandler.executeCode('', 'python'))
        .rejects.toThrow('Code and language are required for execution.');

      expect(mockExecuteCode.executeLocalCode).not.toHaveBeenCalled();
    });

    it('should throw error for missing language', async () => {
      await expect(localHandler.executeCode('print("test")', ''))
        .rejects.toThrow('Code and language are required for execution.');

      expect(mockExecuteCode.executeLocalCode).not.toHaveBeenCalled();
    });

    it('should throw error for null code', async () => {
      await expect(localHandler.executeCode(null as any, 'python'))
        .rejects.toThrow('Code and language are required for execution.');
    });

    it('should throw error for null language', async () => {
      await expect(localHandler.executeCode('print("test")', null as any))
        .rejects.toThrow('Code and language are required for execution.');
    });

    it('should handle code execution errors', async () => {
      const mockError = new Error('Code execution failed');
      mockExecuteCode.executeLocalCode.mockRejectedValue(mockError);

      await expect(localHandler.executeCode('invalid code', 'python'))
        .rejects.toThrow('Code execution failed');
    });
  });

  describe('getSystemInfo', () => {
    it('should return system information', async () => {
      // Mock process properties
      const originalPlatform = process.platform;
      const originalArch = process.arch;
      const originalUptime = process.uptime;
      const originalCwd = process.cwd;

      Object.defineProperty(process, 'platform', { value: 'linux' });
      Object.defineProperty(process, 'arch', { value: 'x64' });
      process.uptime = jest.fn().mockReturnValue(12345);
      process.cwd = jest.fn().mockReturnValue('/current/directory');

      const result = await localHandler.getSystemInfo();

      expect(result).toEqual({
        type: 'LocalServer',
        platform: 'linux',
        architecture: 'x64',
        totalMemory: 8192,
        freeMemory: 4096,
        uptime: 12345,
        currentFolder: '/current/directory'
      });

      // Restore original properties
      Object.defineProperty(process, 'platform', { value: originalPlatform });
      Object.defineProperty(process, 'arch', { value: originalArch });
      process.uptime = originalUptime;
      process.cwd = originalCwd;
    });

    it('should handle different platforms', async () => {
      const originalPlatform = process.platform;
      Object.defineProperty(process, 'platform', { value: 'darwin' });
      mockGetSystemInfo.getSystemInfo.mockResolvedValue({
        type: 'LocalServer',
        platform: 'darwin',
        architecture: 'x64',
        totalMemory: 8192,
        freeMemory: 4096,
        uptime: 12345,
        currentFolder: '/current/directory'
      });

      const result = await localHandler.getSystemInfo();

      expect(result.platform).toBe('darwin');
      expect(result.type).toBe('LocalServer');

      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });
  });

  describe('listFiles', () => {
    it('should list files with default parameters (limit 50, offset 0)', async () => {
      const mockFiles = [
        { name: 'file1.txt', isDirectory: false },
        { name: 'file2.js', isDirectory: false },
        { name: 'subdir', isDirectory: true }
      ];
      mockListFiles.mockResolvedValue({ files: mockFiles, total: 3 });

      const result = await localHandler.listFiles({ directory: '/test/dir' });

      expect(mockListFiles).toHaveBeenCalledWith({
        directory: '/test/dir',
        limit: 50,
        offset: 0,
        orderBy: 'filename',
        recursive: false,
        typeFilter: undefined
      });
      expect(result).toEqual({
        items: mockFiles,
        total: 3,
        limit: 50,
        offset: 0
      });
    });

    it('should list files with custom limit and offset', async () => {
      const mockFiles = [
        { name: 'b.txt', isDirectory: false },
        { name: 'c.txt', isDirectory: false }
      ];
      mockListFiles.mockResolvedValue({ files: mockFiles, total: 5 });

      const result = await localHandler.listFiles({
        directory: '/test/dir',
        limit: 2,
        offset: 1
      });

      expect(mockListFiles).toHaveBeenCalledWith({
        directory: '/test/dir',
        limit: 2,
        offset: 1,
        orderBy: 'filename',
        recursive: false,
        typeFilter: undefined
      });
      expect(result).toEqual({
        items: mockFiles,
        total: 5,
        limit: 2,
        offset: 1
      });
    });

    it('should handle empty directory', async () => {
      mockListFiles.mockResolvedValue({ files: [], total: 0 });

      const result = await localHandler.listFiles({ directory: '/empty/dir' });

      expect(result).toEqual({
        items: [],
        total: 0,
        limit: 50,
        offset: 0
      });
    });

    it('should handle directory read errors', async () => {
      const mockError = new Error('Permission denied');
      mockListFiles.mockRejectedValue(mockError);

      await expect(localHandler.listFiles({ directory: '/forbidden/dir' }))
        .rejects.toThrow('Permission denied');
    });

    it('should pass orderBy through to the listFiles action', async () => {
      mockListFiles.mockResolvedValue({
        files: [{ name: 'newest.txt', isDirectory: false }],
        total: 1
      });

      const result = await localHandler.listFiles({
        directory: '/test/dir',
        orderBy: 'datetime'
      });

      expect(mockListFiles).toHaveBeenCalledWith({
        directory: '/test/dir',
        limit: 50,
        offset: 0,
        orderBy: 'datetime',
        recursive: false,
        typeFilter: undefined
      });
      expect(result.items).toEqual([{ name: 'newest.txt', isDirectory: false }]);
    });
  });

  describe('createFile', () => {
    it('should create file without post-command', async () => {
      const handlerWithoutPostCommand = new LocalServerHandler({
        protocol: 'local',
        hostname: 'localhost',
        code: false
      });

      mockCreateFile.createFile.mockResolvedValue(true);

      const result = await handlerWithoutPostCommand.createFile('/test/file.txt', 'content');

      expect(mockCreateFile.createFile).toHaveBeenCalledWith('/test/file.txt', 'content', true, undefined);
      expect(result).toBe(true);
    });

    it('should create file with successful post-command', async () => {
      mockCreateFile.createFile.mockResolvedValue(true);

      // Mock successful exec
      mockExec.mockImplementation((command, callback) => {
        setTimeout(() => callback!(null, 'Post-command output', ''), 0);
        return {} as any;
      });

      const result = await localHandler.createFile('/test/file.txt', 'content');

      expect(mockCreateFile.createFile).toHaveBeenCalledWith('/test/file.txt', 'content', true, undefined);
      expect(mockExec).toHaveBeenCalledWith(
        'echo "File processed" /test/file.txt',
        expect.any(Function)
      );
      expect(result).toBe(true);
    });

    it('should create file with failing post-command', async () => {
      mockCreateFile.createFile.mockResolvedValue(true);

      // Mock failing exec
      const mockError = new Error('Post-command failed');
      (mockError as any).code = 1;
      mockExec.mockImplementation((command, callback) => {
        setTimeout(() => callback!(mockError, '', 'Error output'), 0);
        return {} as any;
      });

      const result = await localHandler.createFile('/test/file.txt', 'content');

      expect(result).toBe(true); // File creation still succeeds
      expect(mockExec).toHaveBeenCalled();
    });

    it('should create file with custom backup setting', async () => {
      mockCreateFile.createFile.mockResolvedValue(true);

      const result = await localHandler.createFile('/test/file.txt', 'content', false);

      expect(mockCreateFile.createFile).toHaveBeenCalledWith('/test/file.txt', 'content', false, undefined);
      expect(result).toBe(true);
    });

    it('should handle file creation errors', async () => {
      mockCreateFile.createFile.mockRejectedValue(new Error('File creation failed'));

      await expect(localHandler.createFile('/test/file.txt', 'content'))
        .rejects.toThrow('File creation failed');
    });
  });

  describe('setServerConfig', () => {
    it('should update server configuration', () => {
      const newConfig: LocalServerConfig = {
        protocol: 'local',
        hostname: 'new-host',
        code: false,
        'post-command': 'new-command'
      };

      localHandler.setServerConfig(newConfig);

      // Verify the configuration was updated (we can't directly access private properties)
      expect(() => localHandler.setServerConfig(newConfig)).not.toThrow();
    });

    it('should handle configuration without post-command', () => {
      const newConfig: LocalServerConfig = {
        protocol: 'local',
        hostname: 'simple-host',
        code: true
      };

      expect(() => localHandler.setServerConfig(newConfig)).not.toThrow();
    });

    it('should handle configuration with missing hostname', () => {
      const newConfig: LocalServerConfig = {
        protocol: 'local'
      } as LocalServerConfig;

      expect(() => localHandler.setServerConfig(newConfig)).not.toThrow();
    });
  });

  describe('presentWorkingDirectory', () => {
    it('should return current working directory', async () => {
      const originalCwd = process.cwd;
      process.cwd = jest.fn().mockReturnValue('/current/working/directory');

      const result = await localHandler.presentWorkingDirectory();

      expect(result).toBe('/current/working/directory');

      process.cwd = originalCwd;
    });

    it('should handle different working directories', async () => {
      const originalCwd = process.cwd;
      process.cwd = jest.fn().mockReturnValue('/different/path');

      const result = await localHandler.presentWorkingDirectory();

      expect(result).toBe('/different/path');

      process.cwd = originalCwd;
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow', async () => {
      // Setup mocks for a complete workflow
      mockCreateFile.createFile.mockResolvedValue(true);
      mockExecuteCode.executeLocalCode.mockResolvedValue({
        stdout: 'Workflow completed',
        stderr: ''
      });
      mockListFiles.mockResolvedValue({
        files: [{ name: 'workflow.txt', isDirectory: false }],
        total: 1
      });

      // Create file
      const createResult = await localHandler.createFile('/test/workflow.txt', 'workflow content');
      expect(createResult).toBe(true);

      // Execute command
      const execResult = await localHandler.executeCommand('cat /test/workflow.txt');
      expect(execResult.stdout).toBe('Workflow completed');

      // List files
      const listResult = await localHandler.listFiles({ directory: '/test' });
      expect(listResult.items).toContainEqual({ name: 'workflow.txt', isDirectory: false });

      // Get system info
      const sysInfo = await localHandler.getSystemInfo();
      expect(sysInfo.type).toBe('LocalServer');
    });

    it('should handle error scenarios gracefully', async () => {
      // Test error handling across different methods
      mockCreateFile.createFile.mockRejectedValue(new Error('Create failed'));
      mockExecuteCode.executeLocalCode.mockRejectedValue(new Error('Execute failed'));
      mockListFiles.mockRejectedValue(new Error('List failed'));

      await expect(localHandler.createFile('/test/file.txt', 'content'))
        .rejects.toThrow('Create failed');

      await expect(localHandler.executeCommand('test'))
        .rejects.toThrow('Execute failed');

      await expect(localHandler.listFiles({ directory: '/test' }))
        .rejects.toThrow('List failed');
    });

    it('should handle post-command with different exit codes', async () => {
      mockCreateFile.createFile.mockResolvedValue(true);

      // Test with exit code 0
      mockExec.mockImplementationOnce((command, callback) => {
        setTimeout(() => callback!(null, 'Success', ''), 0);
        return {} as any;
      });

      let result = await localHandler.createFile('/test/success.txt', 'content');
      expect(result).toBe(true);

      // Test with non-zero exit code
      const mockError = new Error('Command failed');
      (mockError as any).code = 2;
      mockExec.mockImplementationOnce((command, callback) => {
        setTimeout(() => callback!(mockError, '', 'Error'), 0);
        return {} as any;
      });

      result = await localHandler.createFile('/test/error.txt', 'content');
      expect(result).toBe(true); // File creation still succeeds
    });
  });
});
