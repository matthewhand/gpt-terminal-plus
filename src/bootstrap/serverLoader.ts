import config from 'config';
import { registerServerInMemory } from '../managers/serverRegistry';
import { ServerConfig } from '../types/ServerConfig';

export function registerServersFromConfig(): void {
  let hasLocalhost = false;
  
  try {
    // Load local server
    const localConfig = config.get<ServerConfig>('local');
    if (localConfig) {
      const hostname = localConfig.hostname || 'localhost';
      registerServerInMemory({
        ...localConfig,
        protocol: 'local',
        hostname,
        registeredAt: new Date().toISOString(),
        modes: ['shell', 'code'],
        directory: '.'
      });
      console.log(`✅ Registered server from config: ${hostname}`);
      if (hostname === 'localhost') hasLocalhost = true;
    }
  } catch {
    console.warn('No local server config found');
  }
  
  // Always ensure we have a default localhost server with working directory '.'
  if (!hasLocalhost) {
    registerServerInMemory({
      protocol: 'local',
      hostname: 'localhost',
      registeredAt: new Date().toISOString(),
      modes: ['shell', 'code'],
      directory: '.',
      code: false
    });
    console.log(`✅ Registered default localhost server with working directory '.'`);
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
  } catch {
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
  } catch {
    console.warn('No SSM targets config found');
  }
}
