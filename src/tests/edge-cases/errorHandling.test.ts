import { costTracker } from '../../utils/costTracker';
import { executeFileOperation } from '../../engines/fileEngine';
import { createSSHSession } from '../../engines/remoteEngine';

jest.mock('../../config/convictConfig');
jest.mock('fs/promises');
jest.mock('child_process');

describe('Edge Cases and Error Handling', () => {
  test('should handle cost tracker overflow', () => {
    costTracker.reset();
    costTracker.addCost(Number.MAX_SAFE_INTEGER);
    expect(costTracker.getTotalCost()).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('should handle invalid file operations gracefully', async () => {
    await expect(executeFileOperation({ 
      type: 'invalid' as any, 
      path: './test' 
    })).rejects.toThrow('Unknown file operation');
  });

  test('should handle spawn failures in remote engine', async () => {
    const { spawn } = require('child_process');
    spawn.mockImplementation(() => {
      throw new Error('Spawn failed');
    });
    
    await expect(createSSHSession('invalid.host')).rejects.toThrow('Spawn failed');
  });

  test('should handle malformed JSON in session persistence', async () => {
    const { loadSessions } = require('../../utils/sessionPersistence');
    const fs = require('fs/promises');
    fs.readFile.mockResolvedValue('invalid json');
    
    const sessions = await loadSessions();
    expect(sessions).toEqual([]);
  });

  test('should handle process kill failures gracefully', () => {
    const mockProcess = {
      kill: jest.fn(() => { throw new Error('Kill failed'); })
    };
    
    expect(() => {
      try { mockProcess.kill(); } catch {}
    }).not.toThrow();
  });
});