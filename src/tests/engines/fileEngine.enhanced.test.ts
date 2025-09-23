import { executeFileOperation } from '../../engines/fileEngine';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('File Engine - Enhanced', () => {
  let tempDir: string;
  let testFile: string;
  let testDir: string;

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-engine-test-'));
    testFile = path.join(tempDir, 'test.txt');
    testDir = path.join(tempDir, 'subdir');
  });

  beforeEach(async () => {
    // Clean up and recreate test environment
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(testFile, 'initial content\nline 2\nline 3\n');
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('File Reading Operations', () => {
    it('reads existing file successfully', async () => {
      const result = await executeFileOperation('read', testFile);
      
      expect(result.success).toBe(true);
      expect(result.content).toBe('initial content\nline 2\nline 3\n');
      expect(result.error).toBeUndefined();
    });

    it('handles non-existent file gracefully', async () => {
      const nonExistentFile = path.join(tempDir, 'does-not-exist.txt');
      const result = await executeFileOperation('read', nonExistentFile);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.content).toBeUndefined();
    });

    it('handles permission errors', async () => {
      // Create a file and remove read permissions (Unix-like systems)
      const restrictedFile = path.join(tempDir, 'restricted.txt');
      await fs.writeFile(restrictedFile, 'restricted content');
      
      try {
        await fs.chmod(restrictedFile, 0o000); // No permissions
        const result = await executeFileOperation('read', restrictedFile);
        
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(restrictedFile, 0o644);
      }
    });

    it('reads binary files safely', async () => {
      const binaryFile = path.join(tempDir, 'binary.bin');
      const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD]);
      await fs.writeFile(binaryFile, binaryData);
      
      const result = await executeFileOperation('read', binaryFile);
      
      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      // Should handle binary data appropriately
    });

    it('handles very large files', async () => {
      const largeFile = path.join(tempDir, 'large.txt');
      const largeContent = 'x'.repeat(1024 * 1024); // 1MB
      await fs.writeFile(largeFile, largeContent);
      
      const result = await executeFileOperation('read', largeFile);
      
      expect(result.success).toBe(true);
      expect(result.content).toHaveLength(1024 * 1024);
    });

    it('handles files with special characters in names', async () => {
      const specialFiles = [
        'file with spaces.txt',
        'file-with-dashes.txt',
        'file_with_underscores.txt',
        'file.with.dots.txt',
        'file(with)parentheses.txt'
      ];

      for (const fileName of specialFiles) {
        const specialFile = path.join(tempDir, fileName);
        await fs.writeFile(specialFile, `content of ${fileName}`);
        
        const result = await executeFileOperation('read', specialFile);
        
        expect(result.success).toBe(true);
        expect(result.content).toContain(fileName);
      }
    });
  });

  describe('File Writing Operations', () => {
    it('writes to new file successfully', async () => {
      const newFile = path.join(tempDir, 'new.txt');
      const content = 'new file content';
      
      const result = await executeFileOperation('write', newFile, content);
      
      expect(result.success).toBe(true);
      
      // Verify file was created with correct content
      const fileContent = await fs.readFile(newFile, 'utf-8');
      expect(fileContent).toBe(content);
    });

    it('overwrites existing file', async () => {
      const content = 'overwritten content';
      
      const result = await executeFileOperation('write', testFile, content);
      
      expect(result.success).toBe(true);
      
      // Verify file was overwritten
      const fileContent = await fs.readFile(testFile, 'utf-8');
      expect(fileContent).toBe(content);
    });

    it('creates directories if they do not exist', async () => {
      const nestedFile = path.join(tempDir, 'deep', 'nested', 'file.txt');
      const content = 'nested file content';
      
      const result = await executeFileOperation('write', nestedFile, content);
      
      expect(result.success).toBe(true);
      
      // Verify file and directories were created
      const fileContent = await fs.readFile(nestedFile, 'utf-8');
      expect(fileContent).toBe(content);
    });

    it('handles write permission errors', async () => {
      // Create a read-only directory
      const readOnlyDir = path.join(tempDir, 'readonly');
      await fs.mkdir(readOnlyDir);
      await fs.chmod(readOnlyDir, 0o444); // Read-only
      
      const readOnlyFile = path.join(readOnlyDir, 'file.txt');
      
      try {
        const result = await executeFileOperation('write', readOnlyFile, 'content');
        
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(readOnlyDir, 0o755);
      }
    });

    it('handles empty content', async () => {
      const emptyFile = path.join(tempDir, 'empty.txt');
      
      const result = await executeFileOperation('write', emptyFile, '');
      
      expect(result.success).toBe(true);
      
      const fileContent = await fs.readFile(emptyFile, 'utf-8');
      expect(fileContent).toBe('');
    });

    it('handles unicode content', async () => {
      const unicodeFile = path.join(tempDir, 'unicode.txt');
      const unicodeContent = 'Hello 世界 🌍 Émojis: 😀🎉✨';
      
      const result = await executeFileOperation('write', unicodeFile, unicodeContent);
      
      expect(result.success).toBe(true);
      
      const fileContent = await fs.readFile(unicodeFile, 'utf-8');
      expect(fileContent).toBe(unicodeContent);
    });
  });

  describe('File Deletion Operations', () => {
    it('deletes existing file successfully', async () => {
      const result = await executeFileOperation('delete', testFile);
      
      expect(result.success).toBe(true);
      
      // Verify file was deleted
      await expect(fs.access(testFile)).rejects.toThrow();
    });

    it('handles deletion of non-existent file', async () => {
      const nonExistentFile = path.join(tempDir, 'does-not-exist.txt');
      
      const result = await executeFileOperation('delete', nonExistentFile);
      
      // Should handle gracefully (either succeed or fail with clear error)
      expect(typeof result.success).toBe('boolean');
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('handles deletion permission errors', async () => {
      // Create a file in a protected directory
      const protectedDir = path.join(tempDir, 'protected');
      await fs.mkdir(protectedDir);
      const protectedFile = path.join(protectedDir, 'protected.txt');
      await fs.writeFile(protectedFile, 'protected content');
      
      // Remove write permissions from directory
      await fs.chmod(protectedDir, 0o444);
      
      try {
        const result = await executeFileOperation('delete', protectedFile);
        
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(protectedDir, 0o755);
      }
    });
  });

  describe('File Listing Operations', () => {
    beforeEach(async () => {
      // Create test files and directories
      await fs.writeFile(path.join(tempDir, 'file1.txt'), 'content1');
      await fs.writeFile(path.join(tempDir, 'file2.js'), 'content2');
      await fs.mkdir(path.join(tempDir, 'subdir1'));
      await fs.mkdir(path.join(tempDir, 'subdir2'));
      await fs.writeFile(path.join(tempDir, 'subdir1', 'nested.txt'), 'nested');
    });

    it('lists directory contents successfully', async () => {
      const result = await executeFileOperation('list', tempDir);
      
      expect(result.success).toBe(true);
      expect(result.files).toBeDefined();
      expect(Array.isArray(result.files)).toBe(true);
      
      const fileNames = result.files!.map(f => f.name);
      expect(fileNames).toContain('file1.txt');
      expect(fileNames).toContain('file2.js');
      expect(fileNames).toContain('subdir1');
      expect(fileNames).toContain('subdir2');
    });

    it('distinguishes between files and directories', async () => {
      const result = await executeFileOperation('list', tempDir);
      
      expect(result.success).toBe(true);
      
      const file1 = result.files!.find(f => f.name === 'file1.txt');
      const subdir1 = result.files!.find(f => f.name === 'subdir1');
      
      expect(file1?.isDirectory).toBe(false);
      expect(subdir1?.isDirectory).toBe(true);
    });

    it('handles empty directories', async () => {
      const emptyDir = path.join(tempDir, 'empty');
      await fs.mkdir(emptyDir);
      
      const result = await executeFileOperation('list', emptyDir);
      
      expect(result.success).toBe(true);
      expect(result.files).toEqual([]);
    });

    it('handles non-existent directory', async () => {
      const nonExistentDir = path.join(tempDir, 'does-not-exist');
      
      const result = await executeFileOperation('list', nonExistentDir);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles invalid operation types', async () => {
      const result = await executeFileOperation('invalid' as any, testFile);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('invalid');
    });

    it('handles null and undefined paths', async () => {
      const nullResult = await executeFileOperation('read', null as any);
      const undefinedResult = await executeFileOperation('read', undefined as any);
      
      expect(nullResult.success).toBe(false);
      expect(undefinedResult.success).toBe(false);
    });

    it('handles very long file paths', async () => {
      const longPath = path.join(tempDir, 'a'.repeat(255) + '.txt');
      
      const result = await executeFileOperation('write', longPath, 'content');
      
      // Should either succeed or fail gracefully
      expect(typeof result.success).toBe('boolean');
    });

    it('handles concurrent operations on same file', async () => {
      const concurrentWrites = Array.from({ length: 5 }, (_, i) =>
        executeFileOperation('write', testFile, `content ${i}`)
      );
      
      const results = await Promise.all(concurrentWrites);
      
      // All operations should complete
      results.forEach(result => {
        expect(typeof result.success).toBe('boolean');
      });
      
      // Final file should have some content
      const finalContent = await fs.readFile(testFile, 'utf-8');
      expect(finalContent).toMatch(/content \d/);
    });

    it('provides meaningful error messages', async () => {
      const result = await executeFileOperation('read', '/invalid/path/that/does/not/exist');
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
      expect(result.error!.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Reliability', () => {
    it('completes operations within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await executeFileOperation('read', testFile);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('handles multiple sequential operations', async () => {
      const operations = [
        () => executeFileOperation('read', testFile),
        () => executeFileOperation('write', testFile, 'new content'),
        () => executeFileOperation('read', testFile),
        () => executeFileOperation('list', tempDir),
      ];

      for (const operation of operations) {
        const result = await operation();
        expect(typeof result.success).toBe('boolean');
      }
    });

    it('maintains consistency across operations', async () => {
      const content = 'consistency test content';
      
      // Write content
      const writeResult = await executeFileOperation('write', testFile, content);
      expect(writeResult.success).toBe(true);
      
      // Read it back
      const readResult = await executeFileOperation('read', testFile);
      expect(readResult.success).toBe(true);
      expect(readResult.content).toBe(content);
      
      // Verify it appears in directory listing
      const listResult = await executeFileOperation('list', tempDir);
      expect(listResult.success).toBe(true);
      const testFileName = path.basename(testFile);
      expect(listResult.files!.some(f => f.name === testFileName)).toBe(true);
    });
  });
});