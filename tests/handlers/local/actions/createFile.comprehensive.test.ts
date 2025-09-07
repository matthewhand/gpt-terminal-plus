import { createFile } from '../../../../src/handlers/local/actions/createFile.local';
import * as GlobalStateHelper from '../../../../src/utils/GlobalStateHelper';
import fs from 'fs';
import path from 'path';

// Mock dependencies
jest.mock('../../../../src/utils/GlobalStateHelper');
jest.mock('fs');

const mockGlobalStateHelper = GlobalStateHelper as jest.Mocked<typeof GlobalStateHelper>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('createFile Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fs.promises
    mockFs.promises = {
      writeFile: jest.fn(),
      copyFile: jest.fn()
    } as any;

    // Mock fs.existsSync
    mockFs.existsSync = jest.fn();

    // Default mock for getPresentWorkingDirectory
    mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/home/user');

    // Clear NODE_CONFIG_DIR
    delete process.env.NODE_CONFIG_DIR;
  });

  afterEach(() => {
    // Clean up environment
    delete process.env.NODE_CONFIG_DIR;
  });

  describe('input validation', () => {
    it('should throw error for missing file path', async () => {
      await expect(createFile('', 'content'))
        .rejects.toThrow('File path must be provided and must be a string.');

      expect(mockFs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('should throw error for null file path', async () => {
      await expect(createFile(null as any, 'content'))
        .rejects.toThrow('File path must be provided and must be a string.');

      expect(mockFs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('should throw error for non-string file path', async () => {
      await expect(createFile(123 as any, 'content'))
        .rejects.toThrow('File path must be provided and must be a string.');

      expect(mockFs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('should handle empty content successfully', async () => {
      // Empty strings are now allowed
      const result = await createFile('/test/file.txt', '');
      expect(result).toBe(true);
      expect(mockFs.promises.writeFile).toHaveBeenCalled();
    });

    it('should throw error for null content', async () => {
      await expect(createFile('/test/file.txt', null as any))
        .rejects.toThrow('Content must be provided and must be a string.');

      expect(mockFs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('should throw error for non-string content', async () => {
      await expect(createFile('/test/file.txt', 123 as any))
        .rejects.toThrow('Content must be provided and must be a string.');

      expect(mockFs.promises.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('file path resolution', () => {
    it('should use absolute path as-is', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/absolute/path/file.txt', 'content');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/absolute/path/file.txt', 'content');
      expect(result).toBe(true);
    });

    it('should resolve relative path using getPresentWorkingDirectory', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/home/user');

      const result = await createFile('relative/file.txt', 'content');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/home/user/relative/file.txt', 'content');
      expect(result).toBe(true);
    });

    it('should resolve relative path using NODE_CONFIG_DIR when set', async () => {
      process.env.NODE_CONFIG_DIR = '/config/dir';
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('config.json', 'content');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/config/dir/config.json', 'content');
      expect(result).toBe(true);
    });

    it('should handle complex relative paths', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/base');

      const result = await createFile('../parent/file.txt', 'content');

      const expectedPath = path.join('/base', '../parent/file.txt');
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith(expectedPath, 'content');
      expect(result).toBe(true);
    });

    it('should handle current directory reference', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/current');

      const result = await createFile('./file.txt', 'content');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/current/file.txt', 'content');
      expect(result).toBe(true);
    });
  });

  describe('backup functionality', () => {
    it('should create backup when file exists and backup is true', async () => {
      mockFs.existsSync.mockReturnValue(true);
      (mockFs.promises.copyFile as jest.Mock).mockResolvedValue(undefined);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/test/file.txt', 'new content', true);

      expect(mockFs.existsSync).toHaveBeenCalledWith('/test/file.txt');
      expect(mockFs.promises.copyFile).toHaveBeenCalledWith('/test/file.txt', '/test/file.txt.bak');
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/file.txt', 'new content');
      expect(result).toBe(true);
    });

    it('should not create backup when file exists and backup is false', async () => {
      mockFs.existsSync.mockReturnValue(true);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/test/file.txt', 'new content', false);

      expect(mockFs.existsSync).toHaveBeenCalledWith('/test/file.txt');
      expect(mockFs.promises.copyFile).not.toHaveBeenCalled();
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/file.txt', 'new content');
      expect(result).toBe(true);
    });

    it('should not create backup when file does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/test/newfile.txt', 'content', true);

      expect(mockFs.existsSync).toHaveBeenCalledWith('/test/newfile.txt');
      expect(mockFs.promises.copyFile).not.toHaveBeenCalled();
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/newfile.txt', 'content');
      expect(result).toBe(true);
    });

    it('should use default backup value (true) when not specified', async () => {
      mockFs.existsSync.mockReturnValue(true);
      (mockFs.promises.copyFile as jest.Mock).mockResolvedValue(undefined);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/test/file.txt', 'content');

      expect(mockFs.promises.copyFile).toHaveBeenCalledWith('/test/file.txt', '/test/file.txt.bak');
      expect(result).toBe(true);
    });

    it('should handle backup creation errors', async () => {
      mockFs.existsSync.mockReturnValue(true);
      (mockFs.promises.copyFile as jest.Mock).mockRejectedValue(new Error('Backup failed'));

      await expect(createFile('/test/file.txt', 'content', true))
        .rejects.toThrow('Failed to create file /test/file.txt: Backup failed');

      expect(mockFs.promises.copyFile).toHaveBeenCalled();
      expect(mockFs.promises.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('file writing', () => {
    it('should write file successfully', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/test/file.txt', 'Hello World');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/file.txt', 'Hello World');
      expect(result).toBe(true);
    });

    it('should handle different content types', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      // JSON content
      await createFile('/test/data.json', '{"key": "value"}');
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/data.json', '{"key": "value"}');

      // Code content
      await createFile('/test/script.js', 'console.log("Hello");');
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/script.js', 'console.log("Hello");');

      // Multi-line content
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      await createFile('/test/multiline.txt', multilineContent);
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/test/multiline.txt', multilineContent);
    });

    it('should handle empty string content (after validation)', async () => {
      // This test verifies behavior if validation were to change
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      // Skip this test as empty strings are now allowed
      const result = await createFile('/test/empty.txt', '');
      expect(result).toBe(true);
    });

    it('should handle write errors with Error objects', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const writeError = new Error('Permission denied');
      (mockFs.promises.writeFile as jest.Mock).mockRejectedValue(writeError);

      await expect(createFile('/test/file.txt', 'content'))
        .rejects.toThrow('Failed to create file /test/file.txt: Permission denied');
    });

    it('should handle write errors with non-Error objects', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const writeError = 'String error';
      (mockFs.promises.writeFile as jest.Mock).mockRejectedValue(writeError);

      await expect(createFile('/test/file.txt', 'content'))
        .rejects.toThrow('Failed to create file /test/file.txt: String error');
    });

    it('should handle write errors with complex objects', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const writeError = { code: 'EACCES', message: 'Access denied' };
      (mockFs.promises.writeFile as jest.Mock).mockRejectedValue(writeError);

      await expect(createFile('/test/file.txt', 'content'))
        .rejects.toThrow('Failed to create file /test/file.txt: [object Object]');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete workflow with backup', async () => {
      mockFs.existsSync.mockReturnValue(true);
      (mockFs.promises.copyFile as jest.Mock).mockResolvedValue(undefined);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('config/settings.json', '{"theme": "dark"}', true);

      expect(mockFs.existsSync).toHaveBeenCalledWith('/home/user/config/settings.json');
      expect(mockFs.promises.copyFile).toHaveBeenCalledWith(
        '/home/user/config/settings.json',
        '/home/user/config/settings.json.bak'
      );
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith(
        '/home/user/config/settings.json',
        '{"theme": "dark"}'
      );
      expect(result).toBe(true);
    });

    it('should handle new file creation without backup', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile('/var/log/app.log', 'Log entry', false);

      expect(mockFs.existsSync).toHaveBeenCalledWith('/var/log/app.log');
      expect(mockFs.promises.copyFile).not.toHaveBeenCalled();
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/var/log/app.log', 'Log entry');
      expect(result).toBe(true);
    });

    it('should handle different base directories', async () => {
      // Test with NODE_CONFIG_DIR
      process.env.NODE_CONFIG_DIR = '/app/config';
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      await createFile('app.conf', 'config data');
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/app/config/app.conf', 'config data');

      // Test without NODE_CONFIG_DIR
      delete process.env.NODE_CONFIG_DIR;
      mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/project');

      await createFile('readme.txt', 'readme content');
      expect(mockFs.promises.writeFile).toHaveBeenCalledWith('/project/readme.txt', 'readme content');
    });

    it('should handle edge cases with path resolution', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      mockGlobalStateHelper.getPresentWorkingDirectory.mockReturnValue('/base');

      // Test with various path formats
      const testCases = [
        { input: 'simple.txt', expected: '/base/simple.txt' },
        { input: './current.txt', expected: '/base/current.txt' },
        { input: 'sub/dir/file.txt', expected: '/base/sub/dir/file.txt' },
        { input: '/absolute.txt', expected: '/absolute.txt' }
      ];

      for (const testCase of testCases) {
        await createFile(testCase.input, 'content');
        expect(mockFs.promises.writeFile).toHaveBeenCalledWith(testCase.expected, 'content');
      }
    });

    it('should handle concurrent file operations', async () => {
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      // Simulate concurrent file creation
      const promises = [
        createFile('/test/file1.txt', 'content1'),
        createFile('/test/file2.txt', 'content2'),
        createFile('/test/file3.txt', 'content3')
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([true, true, true]);
      expect(mockFs.promises.writeFile).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed success and failure scenarios', async () => {
      mockFs.existsSync.mockReturnValue(false);

      // First call succeeds
      (mockFs.promises.writeFile as jest.Mock)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Disk full'));

      const result1 = await createFile('/test/success.txt', 'content');
      expect(result1).toBe(true);

      await expect(createFile('/test/failure.txt', 'content'))
        .rejects.toThrow('Failed to create file /test/failure.txt: Disk full');
    });
  });

  describe('error handling edge cases', () => {
    it('should handle existsSync throwing errors', async () => {
      mockFs.existsSync.mockImplementation(() => {
        throw new Error('File system error');
      });

      await expect(createFile('/test/file.txt', 'content'))
        .rejects.toThrow('Failed to create file /test/file.txt: File system error');
    });

    it('should handle path resolution errors', async () => {
      // Mock path.join to throw an error in a more controlled way
      const originalJoin = path.join;
      const mockJoin = jest.fn().mockImplementation((...args) => {
        // Only throw for our specific test case
        if (args.includes('relative/path.txt')) {
          throw new Error('Path resolution failed');
        }
        // Use original implementation for other calls
        return originalJoin.apply(path, args);
      });
      
      path.join = mockJoin;
      mockFs.existsSync.mockReturnValue(false);

      await expect(createFile('relative/path.txt', 'content'))
        .rejects.toThrow('Path resolution failed');

      // Restore original path.join
      path.join = originalJoin;
    });

    it('should handle very long file paths', async () => {
      const longPath = '/very/long/path/' + 'a'.repeat(1000) + '.txt';
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile(longPath, 'content');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith(longPath, 'content');
      expect(result).toBe(true);
    });

    it('should handle special characters in file paths', async () => {
      const specialPath = '/test/file with spaces & symbols!@#$.txt';
      mockFs.existsSync.mockReturnValue(false);
      (mockFs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await createFile(specialPath, 'content');

      expect(mockFs.promises.writeFile).toHaveBeenCalledWith(specialPath, 'content');
      expect(result).toBe(true);
    });
  });
});
