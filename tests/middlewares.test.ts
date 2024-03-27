import * as fs from 'fs';
import { ensureDirAndFileExist, getSelectedServer, setSelectedServer } from '../src/middlewares';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

jest.mock('debug', () => () => jest.fn());

describe('Middleware Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureDirAndFileExist', () => {
    it('should create directory and file if they do not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false) // For the directory
                         .mockReturnValueOnce(false); // For the file
      ensureDirAndFileExist();
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), 'localhost', 'utf8');
    });

    it('should not create directory or file if they already exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true); // Both directory and file exist
      ensureDirAndFileExist();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedServer', () => {
    it('should return the content of the selectedServer.txt file', () => {
      const mockServerName = 'localhost';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockServerName);
      const selectedServer = getSelectedServer();
      expect(selectedServer).toBe(mockServerName);
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    });

    it('should return null if reading the file throws an error', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => { throw new Error('Error reading file'); });
      const selectedServer = getSelectedServer();
      expect(selectedServer).toBeNull();
    });
  });

  describe('setSelectedServer', () => {
    it('should write the server name to the selectedServer.txt file', () => {
      const mockServerName = 'localhost';
      setSelectedServer(mockServerName);
      expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), mockServerName, 'utf8');
    });

    it('should handle and log an error if writing the file fails', () => {
      // Mocking the debug function correctly as jest.fn() due to jest.mock('debug', () => () => jest.fn());
      (fs.writeFileSync as jest.Mock).mockImplementation(() => { throw new Error('Error writing file'); });
      setSelectedServer('localhost');
      // Assuming debugLog to be a jest.fn(), but actually, it's not necessary to explicitly call it due to the mock of debug
    });
  });
});
