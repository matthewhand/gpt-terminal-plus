import { SshServerHandler } from '../../src/handlers/ssh/SshServerHandler';

describe('Direct SSH Integration Tests', () => {
  test('connects to worker1 and executes command', async () => {
    const handler = new SshServerHandler({
      protocol: 'ssh',
      hostname: 'worker1',
      username: process.env.USER || 'chatgpt',
      port: 22
    });

    const result = await handler.executeCommand('hostname && echo "Direct SSH test successful"');
    
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('worker1');
    expect(result.stdout).toContain('Direct SSH test successful');
    expect(result.exitCode).toBe(0);
  }, 15000);

  test('connects to worker2 and executes command', async () => {
    const handler = new SshServerHandler({
      protocol: 'ssh',
      hostname: 'worker2',
      username: process.env.USER || 'chatgpt',
      port: 22
    });

    const result = await handler.executeCommand('hostname && uptime');
    
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('worker2');
    expect(result.exitCode).toBe(0);
  }, 15000);

  test('creates and reads file on worker1', async () => {
    const handler = new SshServerHandler({
      protocol: 'ssh',
      hostname: 'worker1',
      username: process.env.USER || 'chatgpt',
      port: 22
    });

    const testContent = `Direct SSH integration test ${Date.now()}`;
    const testFile = '/tmp/direct-ssh-test.txt';

    // Create file
    const createResult = await handler.createFile(testFile, testContent);
    expect(createResult).toBe(true);

    // Read file back
    const content = await handler.getFileContent(testFile);
    expect(content).toBe(testContent);

    // Cleanup
    await handler.executeCommand(`rm -f ${testFile}`);
  }, 15000);

  test('lists files on worker1', async () => {
    const handler = new SshServerHandler({
      protocol: 'ssh',
      hostname: 'worker1',
      username: process.env.USER || 'chatgpt',
      port: 22
    });

    const files = await handler.listFiles({ directory: '/tmp' });
    
    expect(Array.isArray(files)).toBe(true);
    expect(files.items.length).toBeGreaterThan(0);
  }, 15000);
});