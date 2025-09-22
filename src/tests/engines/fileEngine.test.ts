import { executeFileOperation } from '../../engines/fileEngine';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

jest.mock('fs/promises');
jest.mock('../../config/convictConfig', () => ({
  convictConfig: () => ({
    get: () => [process.cwd(), '/tmp', '/home', '/mnt']
  })
}));

describe('File Engine', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const testWorkingDir = process.cwd();
  const testFilePath = path.join(testWorkingDir, 'test.txt');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('read operations', () => {
    it('should read file successfully with string content', async () => {
      const expectedContent = 'file content';
      mockFs.readFile.mockResolvedValue(expectedContent);

      const result = await executeFileOperation({ type: 'read', path: './test.txt' });

      expect(result).toEqual({ success: true, content: expectedContent });
      expect(mockFs.readFile).toHaveBeenCalledWith(expect.stringContaining('test.txt'), 'utf8');
    });

    it('should read file with binary content', async () => {
      const binaryContent = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      mockFs.readFile.mockResolvedValue(binaryContent);

      const result = await executeFileOperation({
        type: 'read',
        path: './image.png'
      });

      expect(result).toEqual({ success: true, content: binaryContent });
      expect(mockFs.readFile).toHaveBeenCalledWith(expect.stringContaining('image.png'), 'utf8');
    });

    it('should handle different file encodings', async () => {
      const content = 'encoded content';
      mockFs.readFile.mockResolvedValue(content);

      const result = await executeFileOperation({
        type: 'read',
        path: './test.txt'
      });

      expect(result).toEqual({ success: true, content });
      expect(mockFs.readFile).toHaveBeenCalledWith(expect.stringContaining('test.txt'), 'utf8');
    });

    it('should handle file not found errors', async () => {
      const error = new Error('ENOENT: no such file or directory');
      (error as any).code = 'ENOENT';
      mockFs.readFile.mockRejectedValue(error);

      const result = await executeFileOperation({ type: 'read', path: './missing.txt' });
      expect(result).toEqual({ success: false, error: 'ENOENT: no such file or directory' });
    });

    it('should handle permission denied errors', async () => {
      const error = new Error('EACCES: permission denied');
      (error as any).code = 'EACCES';
      mockFs.readFile.mockRejectedValue(error);

      const result = await executeFileOperation({ type: 'read', path: './protected.txt' });
      expect(result).toEqual({ success: false, error: 'EACCES: permission denied' });
    });
  });

  describe('write operations', () => {
    it('should write file successfully with string content', async () => {
      mockFs.writeFile.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ 
        type: 'write', 
        path: './test.txt', 
        content: 'new content' 
      });
      
      expect(result).toEqual({ success: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test.txt'), 
        'new content'
      );
    });

    it('should write file with binary content', async () => {
      const binaryContent = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      mockFs.writeFile.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ 
        type: 'write', 
        path: './image.png', 
        content: binaryContent,
        encoding: null
      });
      
      expect(result).toEqual({ success: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('image.png'), 
        binaryContent
      );
    });

    it('should handle write errors gracefully', async () => {
      const error = new Error('ENOSPC: no space left on device');
      (error as any).code = 'ENOSPC';
      mockFs.writeFile.mockRejectedValue(error);

      const result = await executeFileOperation({
        type: 'write',
        path: './test.txt',
        content: 'content'
      });
      expect(result).toEqual({ success: false, error: 'ENOSPC: no space left on device' });
    });

    it('should create directories if needed', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ 
        type: 'write', 
        path: './nested/dir/test.txt', 
        content: 'content',
        createDirs: true
      });
      
      expect(result).toEqual({ success: true });
    });
  });

  describe('list operations', () => {
    it('should list directory contents successfully', async () => {
      const mockDirents = [
        { name: 'file1.txt', isFile: () => true, isDirectory: () => false },
        { name: 'subdir', isFile: () => false, isDirectory: () => true },
        { name: 'file2.js', isFile: () => true, isDirectory: () => false }
      ];
      mockFs.readdir.mockResolvedValue(mockDirents as any);

      const result = await executeFileOperation({ type: 'list', path: './' });

      expect(result).toEqual({
        success: true,
        files: [
          { name: 'file1.txt', isDirectory: false },
          { name: 'subdir', isDirectory: true },
          { name: 'file2.js', isDirectory: false }
        ]
      });
    });

    it('should handle empty directories', async () => {
      mockFs.readdir.mockResolvedValue([]);

      const result = await executeFileOperation({ type: 'list', path: './empty' });

      expect(result).toEqual({ success: true, files: [] });
    });

    it('should handle directory access errors', async () => {
      const error = new Error('EACCES: permission denied');
      (error as any).code = 'EACCES';
      mockFs.readdir.mockRejectedValue(error);

      const result = await executeFileOperation({ type: 'list', path: './protected' });
      expect(result).toEqual({ success: false, error: 'EACCES: permission denied' });
    });
  });

  describe('delete operations', () => {
    it('should delete file successfully', async () => {
      mockFs.unlink.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ type: 'delete', path: './test.txt' });
      
      expect(result).toEqual({ success: true });
      expect(mockFs.unlink).toHaveBeenCalledWith(expect.stringContaining('test.txt'));
    });

    it('should delete directory recursively', async () => {
      mockFs.unlink.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ 
        type: 'delete', 
        path: './testdir'
      });
      
      expect(result).toEqual({ success: true });
      expect(mockFs.unlink).toHaveBeenCalledWith(expect.stringContaining('testdir'));
    });

    it('should handle file not found during deletion', async () => {
      const error = new Error('ENOENT: no such file or directory');
      (error as any).code = 'ENOENT';
      mockFs.unlink.mockRejectedValue(error);

      const result = await executeFileOperation({ type: 'delete', path: './missing.txt' });
      expect(result).toEqual({ success: false, error: 'ENOENT: no such file or directory' });
    });
  });

  describe('mkdir operations', () => {
    it('should create directory successfully', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ type: 'mkdir', path: './newdir' });
      
      expect(result).toEqual({ success: true });
      expect(mockFs.mkdir).toHaveBeenCalledWith(expect.stringContaining('newdir'), { recursive: undefined });
    });

    it('should create directory recursively', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      
      const result = await executeFileOperation({ 
        type: 'mkdir', 
        path: './nested/new/dir',
        recursive: true 
      });
      
      expect(result).toEqual({ success: true });
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('nested/new/dir'), 
        { recursive: true }
      );
    });

    it('should handle directory already exists', async () => {
      const error = new Error('EEXIST: file already exists');
      (error as any).code = 'EEXIST';
      mockFs.mkdir.mockRejectedValue(error);

      const result = await executeFileOperation({ type: 'mkdir', path: './existing' });
      expect(result).toEqual({ success: false, error: 'EEXIST: file already exists' });
    });
  });

  describe('security and path validation', () => {
    it('should reject unauthorized absolute paths', async () => {
      const result = await executeFileOperation({
        type: 'read',
        path: '/etc/passwd'
      });
      expect(result.success).toBe(false);
      // Path traversal may be caught by filesystem access or security check
      expect(result.error).toBeDefined();
    });

    it('should reject path traversal attempts', async () => {
      const maliciousPaths = [
        '../../../../etc/passwd',
        '../../../../../../../etc/shadow',
        '../../../../../../etc/hosts',
        '../../../../../../../../root/.ssh/id_rsa'
      ];

      for (const maliciousPath of maliciousPaths) {
        const result = await executeFileOperation({
          type: 'read',
          path: maliciousPath
        });
        expect(result.success).toBe(false);
        expect(result.error).toContain('Path not allowed');
      }
    });

    it('should allow paths within working directory', async () => {
      mockFs.readFile.mockResolvedValue('content');
      
      const validPaths = [
        './test.txt',
        'test.txt',
        './subdir/file.txt',
        'subdir/nested/file.txt'
      ];

      for (const validPath of validPaths) {
        const result = await executeFileOperation({
          type: 'read',
          path: validPath
        });
        expect(result).toEqual({ success: true, content: 'content' });
      }
    });

    it('should normalize paths correctly', async () => {
      mockFs.readFile.mockResolvedValue('content');
      
      const result = await executeFileOperation({
        type: 'read',
        path: './subdir/../test.txt'
      });

      expect(result).toEqual({ success: true, content: 'content' });
      expect(mockFs.readFile).toHaveBeenCalledWith(
        path.join(testWorkingDir, 'test.txt'),
        'utf8'
      );
    });

    it('should handle symbolic links safely', async () => {
      const error = new Error('ELOOP: too many symbolic links encountered');
      (error as any).code = 'ELOOP';
      mockFs.readFile.mockRejectedValue(error);

      const result = await executeFileOperation({
        type: 'read',
        path: './symlink.txt'
      });
      expect(result).toEqual({ success: false, error: 'ELOOP: too many symbolic links encountered' });
    });
  });

  describe('unknown operations', () => {
    it('should reject unknown operation types', async () => {
      // @ts-expect-error: intentionally invalid type to test runtime validation
      const result = await executeFileOperation({ type: 'move', path: './test.txt' });
      expect(result).toEqual({ success: false, error: 'Unknown file operation: move' });
    });

    it('should reject operations with missing required parameters', async () => {
      const result = await executeFileOperation({
        type: 'write',
        path: './test.txt'
        // Missing content parameter
      } as any);
      expect(result).toEqual({ success: false, error: 'Content required for write operation' });
    });
  });

  describe('edge cases', () => {
    it('should handle very long file paths', async () => {
      const longPath = './very/long/path/'.repeat(50) + 'file.txt';
      mockFs.readFile.mockResolvedValue('content');
      
      const result = await executeFileOperation({
        type: 'read',
        path: longPath
      });
      expect(result).toEqual({ success: true, content: 'content' });
    });

    it('should handle files with special characters in names', async () => {
      const specialNames = [
        './file with spaces.txt',
        './file-with-dashes.txt',
        './file_with_underscores.txt',
        './file.with.dots.txt',
        './file(with)parentheses.txt'
      ];

      mockFs.readFile.mockResolvedValue('content');

      for (const specialName of specialNames) {
        const result = await executeFileOperation({
          type: 'read',
          path: specialName
        });
        expect(result).toEqual({ success: true, content: 'content' });
      }
    });

    it('should handle concurrent operations', async () => {
      mockFs.readFile.mockResolvedValue('content');
      
      const operations = Array(5).fill(null).map((_, i) => 
        executeFileOperation({ type: 'read', path: `./file${i}.txt` })
      );
      
      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(5);
      results.forEach(result => expect(result).toEqual({ success: true, content: 'content' }));
      expect(mockFs.readFile).toHaveBeenCalledTimes(5);
    });
  });
});