import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';

describe('Admin Server Management', () => {
  const testServersPath = path.join(process.cwd(), 'data', 'test-admin-servers.json');
  
  beforeEach(() => {
    // Ensure data directory exists
    const dataDir = path.dirname(testServersPath);
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
    // Clean up test file
    if (existsSync(testServersPath)) {
      unlinkSync(testServersPath);
    }
  });

  afterEach(() => {
    // Clean up test file
    if (existsSync(testServersPath)) {
      unlinkSync(testServersPath);
    }
  });

  test('creates empty servers file', () => {
    const servers: any[] = [];
    writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
    
    expect(existsSync(testServersPath)).toBe(true);
    const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
    expect(loaded).toEqual([]);
  });

  test('adds SSH server configuration', () => {
    const servers = [];
    const newServer = {
      id: 'test-ssh-1',
      hostname: 'worker1',
      protocol: 'ssh',
      host: 'worker1.local',
      port: 22,
      username: 'admin',
      privateKeyPath: '/home/user/.ssh/id_rsa',
      enabled: true
    };
    
    servers.push(newServer);
    writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
    
    const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
    expect(loaded).toHaveLength(1);
    expect(loaded[0].hostname).toBe('worker1');
    expect(loaded[0].protocol).toBe('ssh');
  });

  test('adds SSM server configuration', () => {
    const servers = [];
    const newServer = {
      id: 'test-ssm-1',
      hostname: 'prod-server',
      protocol: 'ssm',
      instanceId: 'i-1234567890abcdef0',
      region: 'us-west-2',
      enabled: true
    };
    
    servers.push(newServer);
    writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
    
    const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
    expect(loaded).toHaveLength(1);
    expect(loaded[0].protocol).toBe('ssm');
    expect(loaded[0].instanceId).toBe('i-1234567890abcdef0');
  });

  test('manages multiple server configurations', () => {
    const servers = [
      {
        id: 'local-1',
        hostname: 'localhost',
        protocol: 'local',
        enabled: true
      },
      {
        id: 'ssh-1',
        hostname: 'worker1',
        protocol: 'ssh',
        host: 'worker1.local',
        port: 22,
        username: 'admin',
        enabled: true
      },
      {
        id: 'ssm-1',
        hostname: 'prod-server',
        protocol: 'ssm',
        instanceId: 'i-1234567890abcdef0',
        region: 'us-west-2',
        enabled: false
      }
    ];
    
    writeFileSync(testServersPath, JSON.stringify(servers, null, 2));
    
    const loaded = JSON.parse(readFileSync(testServersPath, 'utf8'));
    expect(loaded).toHaveLength(3);
    expect(loaded.map((s: any) => s.protocol)).toEqual(['local', 'ssh', 'ssm']);
    expect(loaded.filter((s: any) => s.enabled)).toHaveLength(2);
  });
});