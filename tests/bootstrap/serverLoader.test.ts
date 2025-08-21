import { registerServersFromConfig } from '../../src/bootstrap/serverLoader';
import { listRegisteredServers } from '../../src/managers/serverRegistry';

// Mock config module
jest.mock('config', () => ({
  get: jest.fn((key: string) => {
    if (key === 'local') {
      return { hostname: 'localhost', protocol: 'local' };
    }
    if (key === 'ssh.hosts') {
      return [{ hostname: 'worker1', protocol: 'ssh', port: 22 }];
    }
    if (key === 'ssm.targets') {
      return [{ hostname: 'test-ssm', instanceId: 'i-123' }];
    }
    throw new Error('Config not found');
  })
}));

describe('Server Registration Bootstrap', () => {
  it('should register servers from config', () => {
    registerServersFromConfig();
    
    const servers = listRegisteredServers();
    expect(servers.length).toBeGreaterThan(0);
    
    const hostnames = servers.map(s => s.hostname);
    expect(hostnames).toContain('localhost');
    expect(hostnames).toContain('worker1');
    expect(hostnames).toContain('test-ssm');
  });

  it('should handle missing config gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    // Mock config to throw errors
    require('config').get.mockImplementation(() => {
      throw new Error('Config not found');
    });
    
    expect(() => registerServersFromConfig()).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});