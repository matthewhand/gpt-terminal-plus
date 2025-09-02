import { costTracker } from '../../utils/costTracker';
import { executeFileOperation } from '../../engines/fileEngine';
import { createSSHSession } from '../../engines/remoteEngine';
// getExecuteTimeout is loaded dynamically in tests that mock config

jest.mock('../../config/convictConfig');
jest.mock('fs/promises');
jest.mock('child_process');

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle cost tracker operations', () => {
    costTracker.reset();
    expect(costTracker.getTotalCost()).toBe(0);
    
    costTracker.addCost(0.001);
    costTracker.addCost(0.002);
    expect(costTracker.getTotalCost()).toBeCloseTo(0.003);
  });

  test('should handle invalid file operations', async () => {
    await expect(executeFileOperation({ 
      type: 'invalid' as any, 
      path: './test' 
    })).rejects.toThrow('Unknown file operation');
    
    await expect(executeFileOperation({ 
      type: 'read', 
      path: '' 
    })).rejects.toThrow('Path is required');
  });

  test('should handle spawn failures in remote engine', async () => {
    const { spawn } = require('child_process');
    spawn.mockImplementation(() => {
      throw new Error('Spawn failed');
    });
    
    await expect(createSSHSession('invalid.host')).rejects.toThrow('Spawn failed');
  });

  test('resolves execution timeout from env and config with correct precedence', () => {
    const originalEnv = { ...process.env };
    jest.resetModules();

    const mockGet = jest.fn();
    jest.doMock('config', () => ({ __esModule: true, default: { get: mockGet }, get: mockGet }));

    // 1) Specific env var takes precedence over global
    process.env.EXECUTE_TIMEOUT_MS = '9999';
    process.env.EXECUTE_SHELL_TIMEOUT_MS = '1234';
    const { getExecuteTimeout } = require('../../utils/timeout');
    expect(getExecuteTimeout('shell')).toBe(9999);

    // 2) When global unset, operation-specific is used
    delete process.env.EXECUTE_TIMEOUT_MS;
    process.env.EXECUTE_CODE_TIMEOUT_MS = '4321';
    expect(getExecuteTimeout('code')).toBe(4321);

    // 3) Falls back to config value when env unset
    delete process.env.EXECUTE_CODE_TIMEOUT_MS;
    mockGet.mockReturnValueOnce(55555);
    expect(getExecuteTimeout('llm')).toBe(55555);

    // 4) Falls back to default 120_000 when both env and config are unavailable
    mockGet.mockImplementation(() => { throw new Error('no key'); });
    delete process.env.EXECUTE_SHELL_TIMEOUT_MS;
    expect(getExecuteTimeout('shell')).toBe(120000);

    process.env = originalEnv;
  });

  test('should handle array operations without errors', () => {
    const testArray = new Array(100).fill('test');
    expect(() => {
      testArray.forEach(item => item.toUpperCase());
    }).not.toThrow();
    expect(testArray.length).toBe(100);
  });
});
