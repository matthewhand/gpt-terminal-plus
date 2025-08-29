import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';

describe('LocalServerHandler.listFiles integration', () => {
  let tmpRoot: string;
  let handler: LocalServerHandler;

  beforeAll(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'gpttp-list-h-'));
    await fs.writeFile(path.join(tmpRoot, 'root.txt'), 'x');
    await fs.mkdir(path.join(tmpRoot, 'dirA'));
    await fs.writeFile(path.join(tmpRoot, 'dirA', 'a.txt'), 'a');
  });

  afterAll(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  beforeEach(() => {
    handler = new LocalServerHandler({ protocol: 'local', hostname: 'localhost', code: false });
  });

  it('returns PaginatedResponse of objects (flat default)', async () => {
    const res = await handler.listFiles({ directory: tmpRoot });
    expect(Array.isArray(res.items)).toBe(true);
    // Should include root.txt and dirA
    expect(new Set(res.items.map(item => item.name))).toEqual(new Set(['root.txt', 'dirA']));
    expect(typeof res.total).toBe('number');
    expect(typeof res.limit).toBe('number');
    expect(typeof res.offset).toBe('number');
  });

  it('respects recursive and typeFilter options', async () => {
    const res = await handler.listFiles({ directory: tmpRoot, recursive: true, typeFilter: 'files' });
    // Should include root.txt and dirA/a.txt
    expect(new Set(res.items.map(item => item.name))).toEqual(new Set(['root.txt', path.join('dirA', 'a.txt')]));
  });
});

