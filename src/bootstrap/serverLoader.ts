import config from 'config';
import { registerServerInMemory } from '../managers/serverRegistry';
import { ServerConfig } from '../types/ServerConfig';

export function registerServersFromConfig(): void {
  try {
    // Load local server
    const localConfig = config.get<ServerConfig>('local');
    if (localConfig) {
      registerServerInMemory({
        ...localConfig,
        protocol: 'local',
        hostname: localConfig.hostname || 'localhost',
        registeredAt: new Date().toISOString(),
        modes: ['shell', 'code']
      });
      console.log(`✅ Registered server from config: ${localConfig.hostname || 'localhost'}`);
    }
  } catch (err) {
    console.warn('No local server config found');
  }

  try {
    // Load SSH servers
    const sshHosts = config.get<ServerConfig[]>('ssh.hosts');
    if (sshHosts && Array.isArray(sshHosts)) {
      for (const host of sshHosts) {
        registerServerInMemory({
          ...host,
          protocol: 'ssh',
          registeredAt: new Date().toISOString(),
          modes: ['shell', 'code']
        });
        console.log(`✅ Registered server from config: ${host.hostname}`);
      }
    }
  } catch (err) {
    console.warn('No SSH servers config found');
  }

  try {
    // Load SSM targets
    const ssmTargets = config.get<ServerConfig[]>('ssm.targets');
    if (ssmTargets && Array.isArray(ssmTargets)) {
      for (const target of ssmTargets) {
        registerServerInMemory({
          ...target,
          protocol: 'ssm',
          registeredAt: new Date().toISOString(),
          modes: ['shell', 'code']
        });
        console.log(`✅ Registered server from config: ${target.hostname}`);
      }
    }
  } catch (err) {
    console.warn('No SSM targets config found');
  }
}