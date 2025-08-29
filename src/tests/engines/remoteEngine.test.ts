import { createSSHSession, createSSMSession } from '../../engines/remoteEngine';
import { spawn } from 'child_process';

jest.mock('child_process');

describe('Remote Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create SSH session', async () => {
    const mockChild = { on: jest.fn() };
    (spawn as jest.Mock).mockReturnValue(mockChild);
    
    const session = await createSSHSession('test.com', 'user');
    expect(session.type).toBe('ssh');
    expect(session.target).toBe('user@test.com');
    expect(session.status).toBe('connected');
    expect(spawn).toHaveBeenCalled();
  });

  test('should create SSM session', async () => {
    const mockChild = { on: jest.fn() };
    (spawn as jest.Mock).mockReturnValue(mockChild);
    
    const session = await createSSMSession('i-1234567890abcdef0');
    expect(session.type).toBe('ssm');
    expect(session.target).toBe('i-1234567890abcdef0');
    expect(session.status).toBe('connected');
    expect(spawn).toHaveBeenCalled();
  });

  test('should handle SSH connection failure', async () => {
    (spawn as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });
    
    await expect(createSSHSession('invalid.com')).rejects.toThrow('Connection failed');
  });

  test('should handle SSM connection failure', async () => {
    (spawn as jest.Mock).mockImplementation(() => {
      throw new Error('AWS CLI error');
    });
    
    await expect(createSSMSession('i-1234567890abcdef0')).rejects.toThrow('AWS CLI error');
  });

  test('should handle spawn failures gracefully', async () => {
    (spawn as jest.Mock).mockImplementation(() => {
      throw new Error('Spawn failed');
    });
    
    await expect(createSSHSession('test.com', 'user')).rejects.toThrow('Spawn failed');
    await expect(createSSMSession('i-1234567890abcdef0')).rejects.toThrow('Spawn failed');
  });
});