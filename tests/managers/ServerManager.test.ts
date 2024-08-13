import ServerManager from '../../src/managers/ServerManager';
import { ServerConfig } from '../../src/types/ServerConfig';
import LocalServerHandler from '../../src/handlers/local/LocalServerHandler';
import SshServerHandler from '../../src/handlers/ssh/SshServerHandler';
import SsmServerHandler from '../../src/handlers/ssm/SsmServerHandler';
import config from 'config';

jest.mock('config');

const mockConfig = config as jest.Mocked<typeof config>;

// Load the test config
const testConfig = require('../../config/test.json');

mockConfig.get.mockImplementation((key: string) => {
  switch (key) {
    case 'local':
      return [testConfig.local];
    case 'ssh.hosts':
      return testConfig.ssh.hosts;
    case 'ssm.targets':
      return testConfig.ssm.targets;
    case 'ssm.region':
      return testConfig.ssm.region;
    default:
      return {};
  }
});

describe('ServerManager', () => {
  it('should retrieve the correct config for a local server by hostname', () => {
    const serverConfig = ServerManager.getServerConfig('localhost');
    expect(serverConfig).toEqual(testConfig.local);
  });

  it('should retrieve the correct config for an SSH server by hostname', () => {
    const serverConfig = ServerManager.getServerConfig('ssh-bash.example.com');
    expect(serverConfig).toEqual(testConfig.ssh.hosts[0]);
  });

  it('should retrieve the correct config for an SSM server by hostname', () => {
    const serverConfig = ServerManager.getServerConfig('GAMINGPC.WORKGROUP');
    expect(serverConfig).toEqual(testConfig.ssm.targets[0]);
  });

  it('should create the correct handler for local protocol', () => {
    const serverManager = new ServerManager(testConfig.local);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(LocalServerHandler);
  });

  it('should create the correct handler for SSH protocol', () => {
    const serverManager = new ServerManager(testConfig.ssh.hosts[0]);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(SshServerHandler);
  });

  it('should create the correct handler for SSM protocol', () => {
    const serverManager = new ServerManager(testConfig.ssm.targets[0]);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(SsmServerHandler);
  });
});
