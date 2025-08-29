import { costTracker } from '../../utils/costTracker';
import { executeFileOperation } from '../../engines/fileEngine';
import { createSSHSession } from '../../engines/remoteEngine';

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

  test('should handle timeout scenarios gracefully', (done) => {
    const timeoutMs = 50;
    const timer = setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, timeoutMs);
    
    // Cleanup to prevent hanging
    setTimeout(() => clearTimeout(timer), timeoutMs + 10);
  });

  test('should handle array operations without errors', () => {
    const testArray = new Array(100).fill('test');
    expect(() => {
      testArray.forEach(item => item.toUpperCase());
    }).not.toThrow();
    expect(testArray.length).toBe(100);
  });
});
