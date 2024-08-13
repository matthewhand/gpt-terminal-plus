import ServerManager from '../../src/managers/ServerManager';
import LocalServer from '../../src/handlers/local/LocalServerHandler';
import SshServer from '../../src/handlers/ssh/SshServerHandler';
import SsmServer from '../../src/handlers/ssm/SsmServerHandler';
import config from 'config';
import { SshHostConfig, SsmTargetConfig, ServerConfig } from '../../src/types/ServerConfig';

// jest.mock('config');

describe('ServerManager', () => {
  // it('should retrieve the correct config for a local server by hostname', () => {
  //   const localConfig = config.get<ServerConfig>('local');
  //   const serverConfig = ServerManager.getServerConfig('localhost');
  //   expect(serverConfig).toEqual(localConfig);
  // });

  // it('should retrieve the correct config for an SSH server by hostname', () => {
  //   const sshConfig = config.get<SshHostConfig[]>('ssh.hosts')[0];
  //   const serverConfig = ServerManager.getServerConfig('ssh-bash.example.com');
  //   expect(serverConfig).toEqual(sshConfig);
  // });

  // it('should retrieve the correct config for an SSM server by hostname', () => {
  //   const ssmConfig = config.get<SsmTargetConfig[]>('ssm.targets')[0];
  //   const serverConfig = ServerManager.getServerConfig('GAMINGPC.WORKGROUP');
  //   expect(serverConfig).toEqual(ssmConfig);
  // });

  // it('should create the correct handler for local protocol', () => {
  //   const localConfig = config.get<ServerConfig>('local');
  //   const serverManager = new ServerManager(localConfig);
  //   const handler = serverManager.createHandler();
  //   expect(handler).toBeInstanceOf(LocalServer);
  // });

  // it('should create the correct handler for SSH protocol', () => {
  //   const sshConfig = config.get<SshHostConfig[]>('ssh.hosts')[0];
  //   const serverManager = new ServerManager(sshConfig);
  //   const handler = serverManager.createHandler();
  //   expect(handler).toBeInstanceOf(SshServer);
  // });

  it('should create the correct handler for SSM protocol', () => {
    const ssmConfig = config.get<SsmTargetConfig[]>('ssm.targets')[0];
    const serverManager = new ServerManager(ssmConfig.hostname);
    const handler = serverManager.createHandler();
    expect(handler).toBeInstanceOf(SsmServer);
  });
});
