import { listAllServers, listServersForToken, ServerDescriptor } from '../../src/managers/serverList';
import fs from 'fs';
import path from 'path';

// Mock fs and path
jest.mock('fs');
jest.mock('path');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('serverList', () => {
  const mockServers: ServerDescriptor[] = [
    { key: 'server1', label: 'Server 1', protocol: 'ssh', hostname: 'host1' },
    { key: 'server2', label: 'Server 2', protocol: 'ssm', hostname: 'host2', allowedTokens: ['token1'] },
    { key: 'server3', label: 'Server 3', protocol: 'local', allowedTokens: ['token1', 'token2'] },
    { key: 'server4', label: 'Server 4', protocol: 'ssh', hostname: 'host4', allowedTokens: [] }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedPath.join.mockReturnValue('/config/servers.json');
    process.env.SERVERS_CONFIG_PATH = undefined;
  });

  describe('listAllServers', () => {
    it('should return all servers from config file', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockServers));

      const result = listAllServers();
      expect(result).toEqual(mockServers);
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/config/servers.json');
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('/config/servers.json', 'utf8');
    });

    it('should return empty array if config file does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = listAllServers();
      expect(result).toEqual([]);
    });

    it('should return empty array on JSON parse error', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('invalid json');

      const result = listAllServers();
      expect(result).toEqual([]);
    });

    it('should return empty array if config is not an array', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({ not: 'array' }));

      const result = listAllServers();
      expect(result).toEqual([]);
    });

    it('should handle readFileSync error', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('read error');
      });

      const result = listAllServers();
      expect(result).toEqual([]);
    });

    it('should use custom config path from env', () => {
      process.env.SERVERS_CONFIG_PATH = '/custom/path.json';
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockServers));

      const result = listAllServers();
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/custom/path.json');
      expect(result).toEqual(mockServers);
    });
  });

  describe('listServersForToken', () => {
    beforeEach(() => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(mockServers));
    });

    it('should return all servers if no allowedTokens specified', () => {
      const result = listServersForToken('anytoken');
      expect(result).toEqual(mockServers);
    });

    it('should filter servers by allowedTokens', () => {
      const result = listServersForToken('token1');
      expect(result).toEqual([
        mockServers[0], // no allowedTokens
        mockServers[1], // has token1
        mockServers[2], // has token1
        mockServers[3]  // empty allowedTokens
      ]);
    });

    it('should return servers with matching token', () => {
      const result = listServersForToken('token2');
      expect(result).toEqual([
        mockServers[0], // no allowedTokens
        mockServers[2], // has token2
        mockServers[3]  // empty allowedTokens
      ]);
    });

    it('should return servers with no allowedTokens or empty array', () => {
      const result = listServersForToken('nonexistent');
      expect(result).toEqual([
        mockServers[0], // no allowedTokens
        mockServers[3]  // empty allowedTokens
      ]);
    });

    it('should handle empty server list', () => {
      mockedFs.readFileSync.mockReturnValue(JSON.stringify([]));
      const result = listServersForToken('token');
      expect(result).toEqual([]);
    });
  });
});