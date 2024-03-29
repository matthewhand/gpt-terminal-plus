import LocalServerHandler from '../../src/handlers/LocalServerHandler';
import * as fs from 'fs';
import * as path from 'path';
import { ServerConfig } from '../../src/types';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  copyFileSync: jest.fn(),
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
  },
}));

jest.mock('path');
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

const mockedFs = fs as jest.Mocked<typeof fs> & {
  promises: {
    readdir: jest.Mock,
    stat: jest.Mock,
  },
};

const mockServerConfig: ServerConfig = {
  host: 'localhost',
  // ... other necessary properties
};

describe('LocalServerHandler', () => {
  let localServerHandler: LocalServerHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    localServerHandler = new LocalServerHandler(mockServerConfig);
  });

  describe('listFiles', () => {
    const directory = '/test/directory';
    const files = [
      { name: 'file1.txt', mtime: new Date(2021, 0, 1) },
      { name: 'file2.txt', mtime: new Date(2021, 0, 2) },
      { name: 'file3.txt', mtime: new Date(2021, 0, 3) },
    ];

    beforeEach(() => {
      mockedFs.promises.readdir.mockResolvedValue(files.map(file => ({
        isFile: () => true,
        name: file.name,
      })));
    
      mockedFs.promises.stat.mockImplementation((filePath) => {
        const file = files.find(f => path.join(directory, f.name) === filePath);
        if (file) {
          return Promise.resolve({ mtime: file.mtime });
        }
        return Promise.reject('File not found');
      });
    });
    
    it('lists files sorted by filename', async () => {
      const result = await localServerHandler.listFiles(directory);
      expect(result).toEqual(files.map(file => file.name).sort());
    });

    it('should sort files by modification date correctly', () => {
      const filesWithStats = [
        { name: 'file1.txt', mtime: new Date(2021, 1, 1) },
        { name: 'file2.txt', mtime: new Date(2021, 1, 2) },
        { name: 'file3.txt', mtime: new Date(2021, 1, 3) },
      ];

      const sortedFiles = filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()).map(file => file.name);
      expect(sortedFiles).toEqual(['file3.txt', 'file2.txt', 'file1.txt']);
    });
  });

  // Note: If you have other methods like executeCommand, createFile, updateFile, amendFile, etc., 
  // include their tests here as necessary.

  afterEach(() => {
    jest.resetAllMocks();
  });
});

export {};
