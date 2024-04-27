import LocalServerHandler from '../../src/handlers/LocalServerHandler';
import * as fs from 'fs';
import * as path from 'path';
import { ServerConfig } from '../../src/types';

// Using actual implementation for fs methods not directly mocked or intercepted
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
  privateKeyPath: '/mock/private/key',
  posix: true,
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
        return Promise.reject(new Error('File not found'));
      });
    });
    
    it('lists files sorted by filename', async () => {
      const expectedResult = {
        items: files.map(file => file.name).sort(),
        responseId: expect.any(String),
        totalPages: 1
      };
      const result = await localServerHandler.listFiles(directory);
      expect(result).toEqual(expectedResult);
    });

  //   it('should sort files by modification date when requested', async () => {
  //     const filesWithStats = [
  //       { name: 'file1.txt', mtime: new Date(2021, 1, 1) },
  //       { name: 'file2.txt', mtime: new Date(2021, 1, 2) },
  //       { name: 'file3.txt', mtime: new Date(2021, 1, 3) },
  //     ];

  //     const sortedFiles = filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime()).map(file => file.name);
  //     expect(sortedFiles).toEqual(['file3.txt', 'file2.txt', 'file1.txt']);
  //   });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});

export {};
