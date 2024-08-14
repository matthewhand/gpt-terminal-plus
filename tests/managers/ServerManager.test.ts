import ServerManager from '../../src/managers/ServerManager';
import LocalServer from '../../src/handlers/local/LocalServerHandler';
import SshServer from '../../src/handlers/ssh/SshServerHandler';
import SsmServer from '../../src/handlers/ssm/SsmServerHandler';
import config from 'config';
import { SshHostConfig, SsmTargetConfig, ServerConfig } from '../../src/types/ServerConfig';

describe('ServerManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve the correct config for a local server by hostname', () => {
    const localConfig = config.get<ServerConfig>('local');
    const serverConfig = ServerManager.getServerConfig('localhost');
    // Only compare the fields present in localConfig
    expect(serverConfig).toEqual({
      ...localConfig,
      protocol: 'local',
    });
  });

  it('should retrieve the correct config for an SSH server by hostname', () => {
    const sshConfig = config.get<SshHostConfig[]>('ssh.hosts')[0];
    const serverConfig = ServerManager.getServerConfig('ssh-bash.example.com');
    expect(serverConfig).toEqual({
      ...sshConfig,
      protocol: 'ssh',
    });
  });

  it('should retrieve the correct config for an SSM server by hostname', () => {
    const ssmConfig = config.get<SsmTargetConfig[]>('ssm.targets')[0];
    const serverConfig = ServerManager.getServerConfig('GAMINGPC.WORKGROUP');
    expect(serverConfig).toEqual({
      ...ssmConfig,
      protocol: 'ssm',
      region: 'us-west-2', // Include region if it is part of the config
    });
  });

  it('should create the correct handler for local protocol', () => {
    const localConfig = config.get<ServerConfig>('local');
    const serverManager = new ServerManager(localConfig.hostname);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(LocalServer);
  });

  it('should create the correct handler for SSH protocol', () => {
    const sshConfig = config.get<SshHostConfig[]>('ssh.hosts')[0];
    const serverManager = new ServerManager(sshConfig.hostname);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(SshServer);
  });

  it('should create the correct handler for SSM protocol', () => {
    const ssmConfig = config.get<SsmTargetConfig[]>('ssm.targets')[0];
    const serverManager = new ServerManager(ssmConfig.hostname);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(SsmServer);
  });

  it('should fall back to default local config when local config is missing', () => {
    // Selectively mock config.get to simulate missing local configuration
    const originalGet = config.get;
    jest.spyOn(config, 'get').mockImplementation((key: string) => {
      if (key === 'local') {
        throw new Error('Configuration property "local" is not defined');
      }
      return originalGet(key);
    });

    const manager = new ServerManager('localhost');
    const serverConfig = manager.getServerConfig();

    expect(serverConfig).toEqual({
      protocol: 'local',
      hostname: 'localhost',
      code: false,
    });

    // Restore the original config.get method after the test
    (config.get as jest.Mock).mockRestore();
  });

  it('should handle missing SSH config without throwing errors', () => {
    // Selectively mock config.get to simulate missing SSH configuration
    const originalGet = config.get;
    jest.spyOn(config, 'get').mockImplementation((key: string) => {
      if (key === 'ssh.hosts') {
        throw new Error('Configuration property "ssh.hosts" is not defined');
      }
      return originalGet(key);
    });

    expect(() => {
      const manager = new ServerManager('some-ssh-host');
      manager.getServerConfig();
    }).not.toThrow();

    // Restore the original config.get method after the test
    (config.get as jest.Mock).mockRestore();
  });

  it('should handle missing SSM config without throwing errors', () => {
    // Selectively mock config.get to simulate missing SSM configuration
    const originalGet = config.get;
    jest.spyOn(config, 'get').mockImplementation((key: string) => {
      if (key === 'ssm.targets') {
        throw new Error('Configuration property "ssm.targets" is not defined');
      }
      return originalGet(key);
    });

    expect(() => {
      const manager = new ServerManager('some-ssm-host');
      manager.getServerConfig();
    }).not.toThrow();

    // Restore the original config.get method after the test
    (config.get as jest.Mock).mockRestore();
  });

  it('should return the default local config if no server configuration matches the hostname', () => {
    // Mock the config to return empty configurations
    const originalGet = config.get;
    jest.spyOn(config, 'get').mockImplementation(() => []);

    const manager = new ServerManager('nonexistent-host');
    const serverConfig = manager.getServerConfig();

    expect(serverConfig).toEqual({
      protocol: 'local',
      hostname: 'localhost',
      code: false,
    });

    // Restore the original config.get method after the test
    (config.get as jest.Mock).mockRestore();
  });
});
