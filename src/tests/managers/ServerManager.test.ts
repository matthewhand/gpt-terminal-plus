import { expect } from 'chai';
import ServerManager from '@src/managers/ServerManager';
import config from 'config'; // Assuming you're using the 'config' package

describe('ServerManager', () => {
  it('should retrieve the correct config for an SSH server by hostname', () => {
    const sshConfig = config.get('ssh.hosts')[0];
    const serverConfig = ServerManager.getServerConfig('ssh-bash.example.com');

    expect(serverConfig).to.include({
      hostname: sshConfig.hostname,
      protocol: 'ssh',
      port: sshConfig.port,
      username: sshConfig.username,
      privateKeyPath: sshConfig.privateKeyPath
    });
  });

  it('should retrieve the correct config for an SSM server by hostname', () => {
    const ssmConfig = config.get('ssm.targets')[0];
    const serverConfig = ServerManager.getServerConfig('GAMINGPC.WORKGROUP');

    expect(serverConfig).to.include({
      hostname: ssmConfig.hostname,
      protocol: 'ssm',
      instanceId: ssmConfig.instanceId,
      region: ssmConfig.region
    });
  });

  it('should throw an error for unsupported protocol', () => {
    expect(() => new ServerManager('invalid-host')).to.throw('Unsupported protocol: unsupported for hostname: invalid-host');
  });
});
