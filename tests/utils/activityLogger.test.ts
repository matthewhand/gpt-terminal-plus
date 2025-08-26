import fs from 'fs/promises';
import path from 'path';
import { logSessionStep } from '../../src/utils/activityLogger';

// Mock the fs/promises module
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock path.join to return predictable paths
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

describe('activityLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Date.now mock
    jest.spyOn(Date, 'now').mockReturnValue(1640995200000); // 2022-01-01 00:00:00 UTC
    // Mock Date constructor for consistent timestamps
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      toISOString: () => '2022-01-01T00:00:00.000Z'
    }) as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('logSessionStep', () => {
    it('should create directory structure and log entry with provided sessionId', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found')); // meta.json doesn't exist
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([] as any);

      await logSessionStep('test-action', { data: 'test' }, 'custom-session');

      // Verify directory creation
      expect(mockFs.mkdir).toHaveBeenCalledWith('data/activity/2022-01-01', { recursive: true });
      expect(mockFs.mkdir).toHaveBeenCalledWith('data/activity/2022-01-01/custom-session', { recursive: true });

      // Verify meta.json creation
      expect(mockFs.access).toHaveBeenCalledWith('data/activity/2022-01-01/custom-session/meta.json');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/custom-session/meta.json',
        JSON.stringify({
          sessionId: 'custom-session',
          startedAt: '2022-01-01T00:00:00.000Z',
          user: 'gpt-bot',
          label: 'Session',
          source: 'N/A'
        }, null, 2)
      );

      // Verify step file creation
      expect(mockFs.readdir).toHaveBeenCalledWith('data/activity/2022-01-01/custom-session');
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/custom-session/01-test-action.json',
        JSON.stringify({
          timestamp: '2022-01-01T00:00:00.000Z',
          type: 'test-action',
          data: 'test'
        }, null, 2)
      );
    });

    it('should generate sessionId when not provided', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([] as any);

      await logSessionStep('auto-session', { action: 'test' });

      const expectedSessionId = `session_${Date.now()}`;
      expect(mockFs.mkdir).toHaveBeenCalledWith(`data/activity/2022-01-01/${expectedSessionId}`, { recursive: true });
    });

    it('should not create meta.json if it already exists', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockResolvedValue(undefined); // meta.json exists
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([]);

      await logSessionStep('existing-meta', { test: true }, 'session-123');

      // Should check for meta.json existence
      expect(mockFs.access).toHaveBeenCalledWith('data/activity/2022-01-01/session-123/meta.json');
      
      // Should only write the step file, not meta.json
      expect(mockFs.writeFile).toHaveBeenCalledTimes(1);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/session-123/01-existing-meta.json',
        expect.stringContaining('"type": "existing-meta"')
      );
    });

    it('should increment step number based on existing files', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([
        'meta.json',
        '01-first-step.json',
        '02-second-step.json',
        'some-other-file.txt'
      ] as any);

      await logSessionStep('third-step', { step: 3 }, 'session-456');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/session-456/03-third-step.json',
        expect.stringContaining('"type": "third-step"')
      );
    });

    it('should handle complex payload objects', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([] as any);

      const complexPayload = {
        command: 'ls -la',
        output: 'file1.txt\nfile2.txt',
        exitCode: 0,
        metadata: {
          duration: 150,
          server: 'localhost'
        },
        nested: {
          array: [1, 2, 3],
          boolean: true,
          null_value: null
        }
      };

      await logSessionStep('command-execution', complexPayload, 'complex-session');

      const expectedLogEntry = {
        timestamp: '2022-01-01T00:00:00.000Z',
        type: 'command-execution',
        ...complexPayload
      };

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/complex-session/01-command-execution.json',
        JSON.stringify(expectedLogEntry, null, 2)
      );
    });

    it('should handle empty payload', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([] as any);

      await logSessionStep('empty-payload', {}, 'empty-session');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/empty-session/01-empty-payload.json',
        JSON.stringify({
          timestamp: '2022-01-01T00:00:00.000Z',
          type: 'empty-payload'
        }, null, 2)
      );
    });

    it('should handle special characters in type and sessionId', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([] as any);

      await logSessionStep('special-chars@#$', { data: 'test' }, 'session-with-special@chars');

      expect(mockFs.mkdir).toHaveBeenCalledWith('data/activity/2022-01-01/session-with-special@chars', { recursive: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/session-with-special@chars/01-special-chars@#$.json',
        expect.stringContaining('"type": "special-chars@#$"')
      );
    });

    it('should handle step numbering with double digits', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);
      
      // Mock 15 existing step files
      const existingFiles = Array.from({ length: 15 }, (_, i) => 
        `${String(i + 1).padStart(2, '0')}-step-${i + 1}.json`
      );
      existingFiles.push('meta.json');
      mockFs.readdir.mockResolvedValue(existingFiles as any);

      await logSessionStep('step-sixteen', { step: 16 }, 'long-session');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        'data/activity/2022-01-01/long-session/16-step-sixteen.json',
        expect.stringContaining('"type": "step-sixteen"')
      );
    });

    it('should handle directory creation errors gracefully', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(logSessionStep('error-test', { data: 'test' }, 'error-session'))
        .rejects.toThrow('Permission denied');

      expect(mockFs.mkdir).toHaveBeenCalledWith('data/activity/2022-01-01', { recursive: true });
    });

    it('should handle file write errors gracefully', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockRejectedValue(new Error('Disk full'));
      mockFs.readdir.mockResolvedValue([] as any);

      await expect(logSessionStep('write-error', { data: 'test' }, 'write-error-session'))
        .rejects.toThrow('Disk full');
    });

    it('should handle readdir errors gracefully', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readdir.mockRejectedValue(new Error('Cannot read directory'));

      await expect(logSessionStep('readdir-error', { data: 'test' }, 'readdir-error-session'))
        .rejects.toThrow('Cannot read directory');
    });

    it('should use correct date formatting for directory structure', async () => {
      // Test with different date
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        toISOString: () => '2023-12-25T15:30:45.123Z'
      }) as any);

      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue([] as any);

      await logSessionStep('date-test', { data: 'test' }, 'date-session');

      expect(mockFs.mkdir).toHaveBeenCalledWith('data/activity/2023-12-25', { recursive: true });
      expect(mockFs.mkdir).toHaveBeenCalledWith('data/activity/2023-12-25/date-session', { recursive: true });
    });
  });
});