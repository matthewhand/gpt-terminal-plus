import fs from 'fs';
import { updateFile } from '../../../../src/handlers/local/actions/updateFile';

describe('updateFile', () => {
  let readFileSyncSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  let existsSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue('Hello World');
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  afterEach(() => {
    readFileSyncSpy.mockRestore();
    writeFileSyncSpy.mockRestore();
    existsSyncSpy.mockRestore();
  });

  it('should update the file with the replacement text', () => {
    const filePath = 'test.txt';
    const pattern = 'World';
    const replacement = 'Universe';
    const multiline = false;

    const result = updateFile(filePath, pattern, replacement, multiline);

    expect(result).toBe(true);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    const updatedContent = writeFileSyncSpy.mock.calls[0][1] as string;
    expect(updatedContent).toBe('Hello Universe');
  });

  it('should throw an error if file does not exist', () => {
    existsSyncSpy.mockReturnValue(false);

    expect(() => updateFile('nonexistent.txt', 'pattern', 'replacement', false))
      .toThrow('File not found');
  });

  it('should handle invalid input parameters', () => {
    expect(() => updateFile('', 'pattern', 'replacement', false))
      .toThrow('Invalid file path');

    expect(() => updateFile('file.txt', '', 'replacement', false))
      .toThrow('Invalid pattern');

    expect(() => updateFile('file.txt', 'pattern', '', false))
      .toThrow('Invalid replacement');
  });
});
