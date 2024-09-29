/**
 * @fileoverview Tests for the ServerManager class.
 */

import { expect } from 'chai';
import ServerManager from '@src/managers/ServerManager';
import config from 'config'; // Assuming you're using the 'config' package
import { SshHostConfig } from '@types/SshHostConfig';

describe('ServerManager', () => {
  it('should retrieve the correct config for a local server by hostname', () => {
    const localConfig = {
      host: 'teamstinky',
      protocol: 'local',
      // ... other local config properties
    };

    const serverConfig = ServerManager.getServerConfig('localhost');

    // Adjust expectation based on actual serverConfig structure
    expect(serverConfig).to.include({
      host: 'teamstinky',
      protocol: 'local',
    });

    // Assert additional properties if necessary
    expect(serverConfig).toHaveProperty('code', false);
    expect(serverConfig).toHaveProperty('hostname', 'localhost');
  });

  it('should retrieve the correct config for an SSH server by hostname', () => {
    const sshConfig: SshHostConfig = config.get<SshHostConfig[]>('ssh.hosts')[0];
    const serverConfig = ServerManager.getServerConfig('ssh-bash.example.com');

    // Adjust expectation based on actual serverConfig structure
    expect(serverConfig).to.include({
      hostname: 'worker1',
      port: 22,
      privateKeyPath: '/home/chatgpt/.ssh/id_rsa',
      protocol: 'ssh',
      username: 'chatgpt',
    });

    // Assert additional properties if necessary
    expect(serverConfig).toHaveProperty('code', false);
    expect(serverConfig).toHaveProperty('hostname', 'localhost');
    expect(serverConfig).toHaveProperty('protocol', 'local');
  });
});
