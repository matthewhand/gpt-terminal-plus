import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import listFiles from '../../../../src/handlers/local/actions/listFiles.local';

describe('listFiles.local action', () => {
  let tmpRoot: string;

  beforeAll(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'gpttp-list-'));
    // Structure:
    // tmpRoot/
    //   a.txt
    //   sub1/
    //     b.txt
    //   sub2/
    await fs.writeFile(path.join(tmpRoot, 'a.txt'), 'a');
    await fs.mkdir(path.join(tmpRoot, 'sub1'));
    await fs.writeFile(path.join(tmpRoot, 'sub1', 'b.txt'), 'b');
    await fs.mkdir(path.join(tmpRoot, 'sub2'));
  });

  afterAll(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  it('lists flat files and folders by default', async () => {
    const res = await listFiles({ directory: tmpRoot });
    const names = res.files.map(f => f.name).sort();
    expect(res.total).toBe(3);
    expect(names).toEqual(['a.txt', 'sub1', 'sub2']);
  });

  it('lists recursively when enabled', async () => {
    const res = await listFiles({ directory: tmpRoot, recursive: true });
    const names = new Set(res.files.map(f => f.name));
    expect(names.has('a.txt')).toBe(true);
    expect(names.has('sub1')).toBe(true);
    expect(names.has(path.join('sub1', 'b.txt'))).toBe(true);
    expect(names.has('sub2')).toBe(true);
    // Should include 4 entries: a.txt, sub1, sub1/b.txt, sub2
    expect(res.total).toBe(4);
  });

  it('filters folders only', async () => {
    const res = await listFiles({ directory: tmpRoot, typeFilter: 'folders' });
    const names = res.files.map(f => f.name).sort();
    expect(names).toEqual(['sub1', 'sub2']);
    expect(res.files.every(f => f.isDirectory)).toBe(true);
  });

  it('filters files only with recursion', async () => {
    const res = await listFiles({ directory: tmpRoot, recursive: true, typeFilter: 'files' });
    const names = res.files.map(f => f.name).sort();
    expect(names).toEqual(['a.txt', path.join('sub1', 'b.txt')].sort());
    expect(res.files.every(f => !f.isDirectory)).toBe(true);
  });
});

