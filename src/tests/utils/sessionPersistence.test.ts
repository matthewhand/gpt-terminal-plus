import { saveSessions, loadSessions } from '../../utils/sessionPersistence';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('Session Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save sessions to disk', async () => {
    const sessions = new Map([
      ['sess-1', { id: 'sess-1', shell: 'bash', startedAt: '2024-01-01', status: 'running' }]
    ]);
    
    await saveSessions(sessions);
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('.sessions.json'),
      expect.stringContaining('sess-1')
    );
  });

  test('should load sessions from disk', async () => {
    const mockData = JSON.stringify([
      { id: 'sess-1', shell: 'bash', startedAt: '2024-01-01', status: 'running' }
    ]);
    (fs.readFile as jest.Mock).mockResolvedValue(mockData);
    
    const sessions = await loadSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe('sess-1');
  });

  test('should return empty array on file not found', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));
    const sessions = await loadSessions();
    expect(sessions).toEqual([]);
  });
});