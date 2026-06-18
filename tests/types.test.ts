import { SystemInfo } from '../src/types/SystemInfo';
import { getSystemInfo as getLocalSystemInfo } from '../src/handlers/local/actions/getSystemInfo';
import { executeFileOperation } from '../src/engines/fileEngine';
import path from 'path';
import fs from 'fs/promises';

describe('Type Definitions exercised at runtime', () => {
  it('FileOperation supports write/read/list/delete/mkdir within allowed paths', async () => {
    const baseDir = path.join(process.cwd(), 'tmp-types-test');
    const filePath = path.join(baseDir, 'note.txt');

    await expect(executeFileOperation({ type: 'mkdir', path: baseDir, recursive: true })).resolves.toEqual({ success: true });
    await expect(
      executeFileOperation({ type: 'write', path: filePath, content: 'hello' })
    ).resolves.toEqual({ success: true });
    await expect(executeFileOperation({ type: 'read', path: filePath })).resolves.toEqual({ content: 'hello', success: true });

    const listed = await executeFileOperation({ type: 'list', path: baseDir });
    expect(listed.success).toBe(true);
    expect(Array.isArray(listed.files)).toBe(true);
    expect(listed.files.find((e: any) => e.name === 'note.txt')?.isDirectory).toBe(false);

    await expect(executeFileOperation({ type: 'delete', path: filePath })).resolves.toEqual({ success: true });

    await fs.rmdir(baseDir).catch(() => void 0);
  });

  it('SystemInfo matches runtime contract from getSystemInfo()', async () => {
    const info: SystemInfo = await getLocalSystemInfo();
    expect(typeof info.type).toBe('string');
    expect(typeof info.platform).toBe('string');
    expect(typeof info.architecture).toBe('string');
    expect(typeof info.totalMemory).toBe('number');
    expect(typeof info.freeMemory).toBe('number');
    expect(typeof info.uptime).toBe('number');
    expect(typeof info.currentFolder).toBe('string');
    expect(info.totalMemory).toBeGreaterThan(0);
    expect(info.uptime).toBeGreaterThanOrEqual(0);
  });
});
