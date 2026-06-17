import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('LocalServerHandler', () => {
  const tmpDir = os.tmpdir();
  let handler: LocalServerHandler;

  beforeEach(() => {
    handler = new LocalServerHandler({ directory: tmpDir } as any);
  });

  it('constructs with minimal config', () => {
    expect(handler).toBeInstanceOf(LocalServerHandler);
  });

  it('creates a file', async () => {
    const filePath = path.join(tmpDir, 'tmp.txt');
    await handler.createFile('tmp.txt', 'hello world');
    const exists = await fs.readFile(filePath, 'utf8');
    expect(exists).toBe('hello world');
  });

  it('reads a file', async () => {
    const filePath = path.join(tmpDir, 'tmp.txt');
    await handler.createFile('tmp.txt', 'test read');
    const content = await handler.getFileContent('tmp.txt');
    expect(content).toBe('test read');
  });

  it('executes a shell command', async () => {
    const result = await handler.executeCommand('echo hello');
    expect(result.stdout).toContain('hello');
  });

  it('executes code', async () => {
    // Use bash which is reliably available in test environment
    const result = await handler.executeCode('echo hi', 'bash');
    expect(result.stdout).toContain('hi');
  });
});
