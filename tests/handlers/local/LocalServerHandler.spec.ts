import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';
import { LocalServerConfig } from '../../../src/types/ServerConfig';
jest.mock('child_process', () => ({ exec: jest.fn() }));
jest.mock('fs', () => ({ 
  promises: { access: jest.fn(), writeFile: jest.fn(), readFile: jest.fn() },
  default: { existsSync: jest.fn(() => false) },
  existsSync: jest.fn(() => false)
}));
jest.mock('../../../src/handlers/local/actions/createFile', () => ({ createFile: jest.fn(() => Promise.resolve(true)) }));
jest.mock('../../../src/handlers/local/actions/executeCode', () => ({ executeLocalCode: jest.fn() }));

import * as mockExecuteCode from '../../../src/handlers/local/actions/executeCode';

describe('LocalServerHandler', () => {
  const mockExec = exec as unknown as jest.Mock;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => { jest.clearAllMocks(); });

  test('constructs with minimal config', () => {
    const config: LocalServerConfig = { protocol: 'local', hostname: 'localhost', code: true };
    const handler = new LocalServerHandler(config);
    expect(handler).toBeInstanceOf(LocalServerHandler);
  });

  test('executes a shell command', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: true });
    (mockExecuteCode.executeLocalCode as any).mockResolvedValue({ stdout: 'ok', stderr: '', exitCode: 0, success: true, error: false });
    const res = await handler.executeCommand('echo hi');
    expect(res.stdout).toBe('ok');
    expect(res.stderr).toBe('');
  });

  test('executes code', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: true });
    (mockExecuteCode.executeLocalCode as any).mockResolvedValue({ stdout: 'hi', stderr: '', exitCode: 0, success: true, error: false });
    const res = await handler.executeCode('console.log("hi")', 'node');
    expect(res.stdout).toBe('hi');
  });

  test('creates a file', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: true });
    const result = await handler.createFile('tmp.txt', 'data');
    expect(result).toBe(true);
  });

  test('reads a file', async () => {
    const handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: true });
    mockFs.readFile.mockResolvedValue('data');
    const res = await handler.getFileContent('tmp.txt');
    expect(res).toBe('data');
  });
});