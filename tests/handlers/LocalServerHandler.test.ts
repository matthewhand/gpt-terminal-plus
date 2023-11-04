// LocalServerHandler.test.ts
import { LocalServerHandler } from '../../src/handlers/LocalServerHandler';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

// Import the actual fs module
import * as actualFs from 'fs';

// Mock the modules with Jest mock functions
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // This will preserve other fs functions you're not mocking
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

// Correctly type your mocks
const mockedFs = fs as jest.Mocked<typeof actualFs>;

describe('LocalServerHandler', () => {
  let localServerHandler: LocalServerHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    localServerHandler = new LocalServerHandler();
  });

  describe('setCurrentDirectory', () => {
    it('sets the current directory if it exists', () => {
      const validPath = '/valid/path';
      mockedFs.existsSync.mockReturnValue(true);

      const result = localServerHandler.setCurrentDirectory(validPath);

      expect(result).toBe(true);
      expect(localServerHandler.getCurrentDirectory()).toBe(validPath);
      expect(mockedFs.existsSync).toHaveBeenCalledWith(validPath);
    });

    it('does not set the current directory if it does not exist', () => {
      const invalidPath = '/invalid/path';
      mockedFs.existsSync.mockReturnValue(false);

      const result = localServerHandler.setCurrentDirectory(invalidPath);

      expect(result).toBe(false);
      expect(localServerHandler.getCurrentDirectory()).not.toBe(invalidPath);
      expect(mockedFs.existsSync).toHaveBeenCalledWith(invalidPath);
    });
  });

  // ... other tests for methods like executeCommand, createFile, updateFile, amendFile, listFiles, etc.

  afterEach(() => {
    jest.resetAllMocks();
  });
});

export {};
