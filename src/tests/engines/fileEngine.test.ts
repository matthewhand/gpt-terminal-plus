import { executeFileOperation } from '../../engines/fileEngine';
import fs from 'fs/promises';

jest.mock('fs/promises');
jest.mock('../../config/convictConfig', () => ({
  convictConfig: () => ({
    get: () => [process.cwd()]
  })
}));

describe('File Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should read file', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('file content');
    const result = await executeFileOperation({ type: 'read', path: './test.txt' });
    expect(result).toBe('file content');
  });

  test('should write file', async () => {
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    const result = await executeFileOperation({ 
      type: 'write', 
      path: './test.txt', 
      content: 'new content' 
    });
    expect(result.success).toBe(true);
  });

  test('should reject unauthorized paths', async () => {
    await expect(executeFileOperation({ 
      type: 'read', 
      path: '/etc/passwd' 
    })).rejects.toThrow('Path not allowed');
  });
});