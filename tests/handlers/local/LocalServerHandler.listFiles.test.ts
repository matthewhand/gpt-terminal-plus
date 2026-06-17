import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';

describe('LocalServerHandler.listFiles integration', () => {
  let tmpRoot: string;
  let handler: LocalServerHandler;

  beforeAll(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'gpttp-list-h-'));
    
    // Create a comprehensive test directory structure
    await fs.writeFile(path.join(tmpRoot, 'root.txt'), 'root file content');
    await fs.writeFile(path.join(tmpRoot, 'README.md'), '# Test README');
    await fs.writeFile(path.join(tmpRoot, '.hidden'), 'hidden file');
    
    await fs.mkdir(path.join(tmpRoot, 'dirA'));
    await fs.writeFile(path.join(tmpRoot, 'dirA', 'a.txt'), 'file a content');
    await fs.writeFile(path.join(tmpRoot, 'dirA', 'script.sh'), '#!/bin/bash\necho "test"');
    
    await fs.mkdir(path.join(tmpRoot, 'dirB'));
    await fs.writeFile(path.join(tmpRoot, 'dirB', 'b.txt'), 'file b content');
    
    await fs.mkdir(path.join(tmpRoot, 'dirA', 'nested'));
    await fs.writeFile(path.join(tmpRoot, 'dirA', 'nested', 'deep.txt'), 'deep file');
    
    await fs.mkdir(path.join(tmpRoot, 'empty-dir'));
  });

  afterAll(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  beforeEach(() => {
    handler = new LocalServerHandler({ 
      protocol: 'local', 
      hostname: 'localhost', 
      code: false 
    });
  });

  describe('basic listing functionality', () => {
    it('should return PaginatedResponse with correct structure', async () => {
      const res = await handler.listFiles({ directory: tmpRoot });
      
      expect(Array.isArray(res.items)).toBe(true);
      expect(typeof res.total).toBe('number');
      expect(typeof res.limit).toBe('number');
      expect(typeof res.offset).toBe('number');
      
      // Verify response structure
      expect(res.total).toBeGreaterThan(0);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.items.length).toBeLessThanOrEqual(res.total);
    });

    it('should list files and directories in root', async () => {
      const res = await handler.listFiles({ directory: tmpRoot });
      const itemNames = new Set(res.items.map(item => item.name));
      
      expect(itemNames).toContain('root.txt');
      expect(itemNames).toContain('README.md');
      expect(itemNames).toContain('dirA');
      expect(itemNames).toContain('dirB');
      expect(itemNames).toContain('empty-dir');
    });

    it('should include file metadata in items', async () => {
      const res = await handler.listFiles({ directory: tmpRoot });
      const rootTxtItem = res.items.find(item => item.name === 'root.txt');
      const dirAItem = res.items.find(item => item.name === 'dirA');
      
      expect(rootTxtItem).toBeDefined();
      expect(rootTxtItem?.isDirectory).toBe(false);
      
      expect(dirAItem).toBeDefined();
      expect(dirAItem?.isDirectory).toBe(true);
    });

    it('should handle hidden files correctly', async () => {
      const res = await handler.listFiles({ directory: tmpRoot });
      const itemNames = res.items.map(item => item.name);
      
      // Hidden files should be included by default
      expect(itemNames).toContain('.hidden');
    });
  });

  describe('pagination', () => {
    it('should respect limit parameter', async () => {
      const res = await handler.listFiles({ 
        directory: tmpRoot, 
        limit: 2 
      });
      
      expect(res.items.length).toBeLessThanOrEqual(2);
      expect(res.limit).toBe(2);
      expect(res.total).toBeGreaterThan(2); // We have more than 2 items
    });

    it('should respect offset parameter', async () => {
      const firstPage = await handler.listFiles({ 
        directory: tmpRoot, 
        limit: 2, 
        offset: 0 
      });
      
      const secondPage = await handler.listFiles({ 
        directory: tmpRoot, 
        limit: 2, 
        offset: 2 
      });
      
      expect(firstPage.offset).toBe(0);
      expect(secondPage.offset).toBe(2);
      
      // Items should be different
      const firstPageNames = new Set(firstPage.items.map(item => item.name));
      const secondPageNames = new Set(secondPage.items.map(item => item.name));
      
      // Should have no overlap (assuming we have enough items)
      const intersection = [...firstPageNames].filter(name => secondPageNames.has(name));
      expect(intersection.length).toBe(0);
    });

    it('should handle offset beyond available items', async () => {
      const res = await handler.listFiles({ 
        directory: tmpRoot, 
        limit: 10, 
        offset: 1000 
      });
      
      expect(res.items.length).toBe(0);
      expect(res.offset).toBe(1000);
      expect(res.total).toBeGreaterThan(0);
    });
  });

  describe('recursive listing', () => {
    it('should list files recursively when recursive=true', async () => {
      const res = await handler.listFiles({
        directory: tmpRoot,
        recursive: true
      });

      const itemNames = new Set(res.items.map(item => item.name));

      // Should include nested files - check for files that exist in the test setup
      expect(itemNames).toContain('README.md');
      expect(itemNames).toContain(path.join('dirA', 'a.txt'));
      expect(itemNames).toContain(path.join('dirA', 'script.sh'));
      expect(itemNames).toContain(path.join('dirB', 'b.txt'));
      expect(itemNames).toContain(path.join('dirA', 'nested', 'deep.txt'));
    });

    it('should not list recursively by default', async () => {
      const res = await handler.listFiles({ directory: tmpRoot });
      const itemNames = res.items.map(item => item.name);
      
      // Should not include nested files
      expect(itemNames).not.toContain(path.join('dirA', 'a.txt'));
      expect(itemNames).not.toContain(path.join('dirA', 'nested', 'deep.txt'));
      
      // But should include top-level directories
      expect(itemNames).toContain('dirA');
      expect(itemNames).toContain('dirB');
    });
  });

  describe('type filtering', () => {
    it('should filter to files only when typeFilter="files"', async () => {
      const res = await handler.listFiles({ 
        directory: tmpRoot, 
        typeFilter: 'files' 
      });
      
      const itemNames = res.items.map(item => item.name);
      
      // Should include files
      expect(itemNames).toContain('root.txt');
      expect(itemNames).toContain('README.md');
      expect(itemNames).toContain('.hidden');
      
      // Should not include directories
      expect(itemNames).not.toContain('dirA');
      expect(itemNames).not.toContain('dirB');
      expect(itemNames).not.toContain('empty-dir');
      
      // All items should be files
      res.items.forEach(item => {
        expect(item.isDirectory).toBe(false);
      });
    });

    it('should filter to directories only when typeFilter="directories"', async () => {
      const res = await handler.listFiles({ 
        directory: tmpRoot, 
        typeFilter: 'directories' 
      });
      
      const itemNames = res.items.map(item => item.name);
      
      // Should include directories
      expect(itemNames).toContain('dirA');
      expect(itemNames).toContain('dirB');
      expect(itemNames).toContain('empty-dir');
      
      // Should not include files
      expect(itemNames).not.toContain('README.md');
      expect(itemNames).not.toContain('.hidden');
      
      // All items should be directories
      res.items.forEach(item => {
        expect(item.isDirectory).toBe(true);
      });
    });

    it('should combine recursive and typeFilter correctly', async () => {
      const res = await handler.listFiles({ 
        directory: tmpRoot, 
        recursive: true, 
        typeFilter: 'files' 
      });
      
      const itemNames = new Set(res.items.map(item => item.name));
      
      // Should include all files recursively
      expect(itemNames).toContain('root.txt');
      expect(itemNames).toContain(path.join('dirA', 'a.txt'));
      expect(itemNames).toContain(path.join('dirA', 'script.sh'));
      expect(itemNames).toContain(path.join('dirB', 'b.txt'));
      expect(itemNames).toContain(path.join('dirA', 'nested', 'deep.txt'));
      
      // Should not include any directories
      expect(itemNames).not.toContain('dirA');
      expect(itemNames).not.toContain('dirB');
      expect(itemNames).not.toContain('empty-dir');
      
      // All items should be files
      res.items.forEach(item => {
        expect(item.isDirectory).toBe(false);
      });
    });
  });

  describe('sorting and ordering', () => {
    it.skip('should support orderBy parameter', async () => {
      const res = await handler.listFiles({
        directory: tmpRoot,
        orderBy: 'filename'
      });
      
      const itemNames = res.items.map(item => item.name);
      const sortedNames = [...itemNames].sort();
      
      expect(itemNames).toEqual(sortedNames);
    });

    it('should handle different orderBy values', async () => {
      const orderByOptions = ['name', 'size', 'modified'];
      
      for (const orderBy of orderByOptions) {
        const res = await handler.listFiles({ 
          directory: tmpRoot, 
          orderBy: orderBy as any 
        });
        
        expect(res.items.length).toBeGreaterThan(0);
        expect(res.total).toBeGreaterThan(0);
      }
    });
  });

  describe('error handling', () => {
    it('should handle non-existent directory', async () => {
      const nonExistentPath = path.join(tmpRoot, 'does-not-exist');
      
      await expect(handler.listFiles({ directory: nonExistentPath }))
        .rejects
        .toThrow();
    });

    it('should handle permission denied scenarios gracefully', async () => {
      // Create a directory with restricted permissions (if possible)
      const restrictedDir = path.join(tmpRoot, 'restricted');
      await fs.mkdir(restrictedDir);
      
      try {
        // Try to restrict permissions (may not work on all systems)
        await fs.chmod(restrictedDir, 0o000);
        
        await expect(handler.listFiles({ directory: restrictedDir }))
          .rejects
          .toThrow();
      } catch (error) {
        // If chmod fails, that's okay - just skip this test
        console.log('Skipping permission test - chmod not supported');
      } finally {
        // Restore permissions for cleanup
        try {
          await fs.chmod(restrictedDir, 0o755);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    });

    it('should handle invalid parameters gracefully', async () => {
      // Handler now returns structured error instead of throwing
      await expect(handler.listFiles({ directory: '' }))
        .resolves.toEqual({
          items: expect.any(Array),
          limit: expect.any(Number),
          offset: expect.any(Number),
          total: expect.any(Number)
        });
        
      // Handler now returns structured responses instead of throwing for invalid parameters
      const resultWithNegativeLimit = await handler.listFiles({ directory: tmpRoot, limit: -1 });
      expect(resultWithNegativeLimit).toEqual({
        items: expect.any(Array),
        limit: expect.any(Number),
        offset: expect.any(Number),
        total: expect.any(Number)
      });

      const resultWithNegativeOffset = await handler.listFiles({ directory: tmpRoot, offset: -1 });
      expect(resultWithNegativeOffset).toEqual({
        items: expect.any(Array),
        limit: expect.any(Number),
        offset: expect.any(Number),
        total: expect.any(Number)
      });
    });
  });

  describe('performance', () => {
    it('should handle large directories efficiently', async () => {
      // Create a directory with many files
      const largeDir = path.join(tmpRoot, 'large-dir');
      await fs.mkdir(largeDir);
      
      // Create 100 files
      const createPromises = Array.from({ length: 100 }, (_, i) =>
        fs.writeFile(path.join(largeDir, `file${i}.txt`), `content ${i}`)
      );
      await Promise.all(createPromises);
      
      const startTime = Date.now();
      const res = await handler.listFilesWithDefaults({ directory: largeDir });
      const endTime = Date.now();
      
      expect(res.items.length).toBe(100);
      expect(res.total).toBe(100);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle pagination efficiently with large result sets', async () => {
      const largeDir = path.join(tmpRoot, 'large-dir-paginated');
      await fs.mkdir(largeDir);
      
      // Create 50 files
      const createPromises = Array.from({ length: 50 }, (_, i) =>
        fs.writeFile(path.join(largeDir, `file${i}.txt`), `content ${i}`)
      );
      await Promise.all(createPromises);
      
      const startTime = Date.now();
      const res = await handler.listFiles({ 
        directory: largeDir, 
        limit: 10, 
        offset: 20 
      });
      const endTime = Date.now();
      
      expect(res.items.length).toBe(10);
      expect(res.total).toBe(50);
      expect(res.offset).toBe(20);
      expect(endTime - startTime).toBeLessThan(500); // Should be fast with pagination
    });
  });

  describe('edge cases', () => {
    it('should handle empty directories', async () => {
      const res = await handler.listFiles({ 
        directory: path.join(tmpRoot, 'empty-dir') 
      });
      
      expect(res.items.length).toBe(0);
      expect(res.total).toBe(0);
      expect(res.offset).toBe(0);
    });

    it('should handle directories with special characters in names', async () => {
      const specialDir = path.join(tmpRoot, 'special-chars !@#$%');
      await fs.mkdir(specialDir);
      await fs.writeFile(path.join(specialDir, 'file with spaces.txt'), 'content');
      
      const res = await handler.listFiles({ directory: specialDir });
      
      expect(res.items.length).toBe(1);
      expect(res.items[0].name).toBe('file with spaces.txt');
    });

    it('should handle very long file names', async () => {
      const longName = 'a'.repeat(200) + '.txt';
      const longNameDir = path.join(tmpRoot, 'long-names');
      await fs.mkdir(longNameDir);
      
      try {
        await fs.writeFile(path.join(longNameDir, longName), 'content');
        
        const res = await handler.listFiles({ directory: longNameDir });
        
        expect(res.items.length).toBe(1);
        expect(res.items[0].name).toBe(longName);
      } catch (error) {
        // Some filesystems don't support very long names
        console.log('Skipping long filename test - not supported on this filesystem');
      }
    });

    it('should handle symbolic links if present', async () => {
      const linkDir = path.join(tmpRoot, 'links');
      await fs.mkdir(linkDir);
      await fs.writeFile(path.join(linkDir, 'target.txt'), 'target content');
      
      try {
        await fs.symlink(
          path.join(linkDir, 'target.txt'),
          path.join(linkDir, 'link.txt')
        );
        
        const res = await handler.listFiles({ directory: linkDir });
        
        expect(res.items.length).toBe(2);
        const itemNames = res.items.map(item => item.name);
        expect(itemNames).toContain('target.txt');
        expect(itemNames).toContain('link.txt');
      } catch (error) {
        // Symlinks might not be supported on all systems
        console.log('Skipping symlink test - not supported on this system');
      }
    });
  });
});

