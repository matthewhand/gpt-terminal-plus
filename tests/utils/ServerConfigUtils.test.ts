// Import the necessary modules
import { ServerConfigUtils } from '../../src/utils/ServerConfigUtils'; // Adjusted relative path
import config from 'config';

// Mocking the 'config' module to return predefined server configurations
jest.mock('config', () => ({
  get: jest.fn().mockImplementation((key) => {
    switch (key) {
      case 'serverConfig':
        return [
          { host: 'example.com', protocol: 'ssh', username: 'user', port: 22 },
          { host: 'localhost', username: 'localuser' },
        ];
      default:
        throw new Error(`Unknown config key: ${key}`);
    }
  }),
}));

describe('ServerConfigUtils Tests', () => {
  // Test for listing available servers
  it('listAvailableServers should return predefined server configurations', () => {
    const servers = ServerConfigUtils.listAvailableServers();
    expect(servers).toEqual([
      { host: 'example.com', protocol: 'ssh', username: 'user', port: 22 },
      { host: 'localhost', username: 'localuser' },
    ]);
  });

  // Additional tests for other ServerConfigUtils methods can be added here
});
