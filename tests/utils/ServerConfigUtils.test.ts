import { ServerConfigUtils } from '../../src/utils/ServerConfigUtils';
import { ServerConfig } from '../../src/types';
import config from 'config';
import AWS from 'aws-sdk';

jest.mock('config', () => ({
  get: jest.fn(),
}));
jest.mock('aws-sdk', () => ({
  SSM: jest.fn(() => ({
    // Mock AWS SSM methods if needed
  })),
}));
jest.mock('../../src/handlers/LocalServerHandler');
jest.mock('../../src/handlers/SshServerHandler');
jest.mock('../../src/handlers/SsmServerHandler');

const configGetMock = config.get as jest.Mock;
const mockServers: ServerConfig[] = [
  { host: 'example.com', protocol: 'ssh', username: 'user', port: 22 },
  { host: 'localhost', username: 'localuser' },
];

describe('ServerConfigUtils Tests', () => {
  beforeEach(() => {
    configGetMock.mockReturnValue(mockServers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('listAvailableServers should return server configurations', () => {
    const servers = ServerConfigUtils.listAvailableServers();
    expect(servers).toEqual(mockServers);
    expect(configGetMock).toHaveBeenCalledWith('serverConfig');
  });

  // Add additional tests as needed
});
