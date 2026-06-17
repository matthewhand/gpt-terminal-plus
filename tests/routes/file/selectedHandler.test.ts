import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { listFiles } from '../../../src/routes/file/listFiles';
import { createFile } from '../../../src/routes/file/createFile';
import { readFile } from '../../../src/routes/file/readFile';
import { applyFuzzyPatch } from '../../../src/routes/file/fuzzyPatch';
import { LocalServerHandler } from '../../../src/handlers/local/LocalServerHandler';

type MockRes = Response & { statusCode: number; body: any };

function mockRes(): MockRes {
  const res: any = { statusCode: 200, body: undefined };
  res.status = jest.fn((code: number) => { res.statusCode = code; return res; });
  res.json = jest.fn((payload: any) => { res.body = payload; return res; });
  return res as MockRes;
}

function mockReq(overrides: Partial<Request> & { server?: any } = {}): Request {
  return { method: 'POST', query: {}, body: {}, ...overrides } as unknown as Request;
}

/** Fake remote (non-LocalServerHandler) handler — a plain object suffices. */
function fakeRemoteHandler(methods: Record<string, jest.Mock> = {}): Record<string, jest.Mock> {
  return { protocol: 'ssh', ...methods } as unknown as Record<string, jest.Mock>;
}

const localHandler = () => new LocalServerHandler({ hostname: 'localhost', protocol: 'local' } as any);

describe('file routes dispatch to the selected server handler', () => {
  describe('GET /file/list (listFiles)', () => {
    it('uses the selected remote handler listFiles', async () => {
      const paginated = { items: [{ name: 'a.txt', isDirectory: false }], total: 1, limit: 42, offset: 0 };
      const handler = fakeRemoteHandler({ listFiles: jest.fn().mockResolvedValue(paginated) });
      const req = mockReq({ method: 'GET', query: { directory: 'sub/dir', limit: '42' } as any, server: handler });
      const res = mockRes();

      await listFiles(req, res);

      expect(handler.listFiles).toHaveBeenCalledWith(expect.objectContaining({ directory: 'sub/dir', limit: 42 }));
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(paginated);
    });

    it('returns 501 when the selected handler lacks listFiles', async () => {
      const req = mockReq({ method: 'GET', query: {} as any, server: fakeRemoteHandler() });
      const res = mockRes();

      await listFiles(req, res);

      expect(res.statusCode).toBe(501);
      expect(res.body.error).toMatch(/not supported/i);
    });

    it('rejects traversal for remote handlers without calling them', async () => {
      const handler = fakeRemoteHandler({ listFiles: jest.fn() });
      const req = mockReq({ method: 'GET', query: { directory: '../../etc' } as any, server: handler });
      const res = mockRes();

      await listFiles(req, res);

      expect(res.statusCode).toBe(400);
      expect(handler.listFiles).not.toHaveBeenCalled();
    });

    it('rejects traversal outside the working root for the local handler', async () => {
      const req = mockReq({ method: 'GET', query: { directory: '../../../../etc' } as any, server: localHandler() });
      const res = mockRes();

      await listFiles(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/outside the working root/i);
    });

    it('lists a directory inside the working root via the local handler', async () => {
      const req = mockReq({ method: 'GET', query: { directory: 'src/routes/file' } as any, server: localHandler() });
      const res = mockRes();

      await listFiles(req, res);

      expect(res.statusCode).toBe(200);
      const names = (res.body.items || []).map((f: any) => f.name);
      expect(names).toContain('listFiles.ts');
    });
  });

  describe('POST /file/create (createFile)', () => {
    it('uses the selected remote handler createFile', async () => {
      const handler = fakeRemoteHandler({ createFile: jest.fn().mockResolvedValue(true) });
      const req = mockReq({ body: { filePath: 'sub/new.txt', content: 'hi', backup: false }, server: handler });
      const res = mockRes();

      await createFile(req, res);

      expect(handler.createFile).toHaveBeenCalledWith('sub/new.txt', 'hi', false);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });

    it('returns 501 when the selected handler lacks createFile', async () => {
      const req = mockReq({ body: { filePath: 'sub/new.txt', content: 'hi' }, server: fakeRemoteHandler() });
      const res = mockRes();

      await createFile(req, res);

      expect(res.statusCode).toBe(501);
      expect(res.body.message).toMatch(/not supported/i);
    });

    it('returns 500 when the remote handler reports failure', async () => {
      const handler = fakeRemoteHandler({ createFile: jest.fn().mockResolvedValue(false) });
      const req = mockReq({ body: { filePath: 'sub/new.txt', content: 'hi' }, server: handler });
      const res = mockRes();

      await createFile(req, res);

      expect(res.statusCode).toBe(500);
    });

    it('rejects traversal for remote handlers without calling them', async () => {
      const handler = fakeRemoteHandler({ createFile: jest.fn() });
      const req = mockReq({ body: { filePath: '../escape.txt', content: 'x' }, server: handler });
      const res = mockRes();

      await createFile(req, res);

      expect(res.statusCode).toBe(400);
      expect(handler.createFile).not.toHaveBeenCalled();
    });

    it('rejects local writes outside the working root', async () => {
      const req = mockReq({ body: { filePath: '/etc/gpt-terminal-plus-test.txt', content: 'x' }, server: localHandler() });
      const res = mockRes();

      await createFile(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/outside the working root/i);
    });
  });

  describe('POST /file/read (readFile)', () => {
    it('uses the selected remote handler getFileContent and slices line ranges', async () => {
      const handler = fakeRemoteHandler({ getFileContent: jest.fn().mockResolvedValue('l1\nl2\nl3\nl4') });
      const req = mockReq({ body: { filePath: 'notes.txt', startLine: 2, endLine: 3 }, server: handler });
      const res = mockRes();

      await readFile(req, res);

      expect(handler.getFileContent).toHaveBeenCalledWith('notes.txt');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.content).toBe('l2\nl3');
    });

    it('returns 501 when the selected handler lacks getFileContent', async () => {
      const req = mockReq({ body: { filePath: 'notes.txt' }, server: fakeRemoteHandler() });
      const res = mockRes();

      await readFile(req, res);

      expect(res.statusCode).toBe(501);
      expect(res.body.message).toMatch(/not supported/i);
    });

    it('rejects traversal for remote handlers without calling them', async () => {
      const handler = fakeRemoteHandler({ getFileContent: jest.fn() });
      const req = mockReq({ body: { filePath: '../../secrets.txt' }, server: handler });
      const res = mockRes();

      await readFile(req, res);

      expect(res.statusCode).toBe(400);
      expect(handler.getFileContent).not.toHaveBeenCalled();
    });

    it('rejects local reads outside the working root', async () => {
      const req = mockReq({ body: { filePath: '/etc/passwd' }, server: localHandler() });
      const res = mockRes();

      await readFile(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/outside the working root/i);
    });

    it('reads a local file inside the working root', async () => {
      const req = mockReq({ body: { filePath: 'package.json' }, server: localHandler() });
      const res = mockRes();

      await readFile(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.content).toContain('"name"');
    });
  });

  describe('POST /file/fuzzy-patch (applyFuzzyPatch)', () => {
    const tmpFile = path.resolve(process.cwd(), 'tmp-selected-handler-fuzzy.txt');

    afterEach(() => {
      for (const f of fs.readdirSync(process.cwd())) {
        if (f.startsWith('tmp-selected-handler-fuzzy.txt')) {
          fs.unlinkSync(path.join(process.cwd(), f));
        }
      }
    });

    it('returns 501 for remote handlers instead of patching local files', async () => {
      fs.writeFileSync(tmpFile, 'hello old world\n');
      const req = mockReq({
        body: { filePath: tmpFile, oldText: 'hello old world\n', newText: 'hello new world\n' },
        server: fakeRemoteHandler(),
      });
      const res = mockRes();

      await applyFuzzyPatch(req, res);

      expect(res.statusCode).toBe(501);
      expect(fs.readFileSync(tmpFile, 'utf8')).toBe('hello old world\n');
    });

    it('rejects traversal outside the working root for the local handler', async () => {
      const req = mockReq({
        body: { filePath: '../outside.txt', oldText: 'a', newText: 'b' },
        server: localHandler(),
      });
      const res = mockRes();

      await applyFuzzyPatch(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/outside the working root/i);
    });

    it('patches a local file inside the working root', async () => {
      fs.writeFileSync(tmpFile, 'hello old world\n');
      const req = mockReq({
        body: { filePath: tmpFile, oldText: 'hello old world\n', newText: 'hello new world\n' },
        server: localHandler(),
      });
      const res = mockRes();

      await applyFuzzyPatch(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(fs.readFileSync(tmpFile, 'utf8')).toBe('hello new world\n');
    });
  });
});
