import request from 'supertest';
import express from 'express';
import setupMiddlewares from '../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../src/routes';

jest.mock('../../src/routes/file', () => ({
  createFile: jest.fn(),
  listFiles: jest.fn(),
  readFile: jest.fn(),
  updateFile: jest.fn(),
  amendFile: jest.fn(),
  applyDiff: jest.fn(),
  applyPatch: jest.fn(),
  applyFuzzyPatch: jest.fn(),
  fsSearch: jest.fn(),
  listFileOperations: jest.fn(),
  toggleFileOperation: jest.fn(),
  bulkToggleFileOperations: jest.fn()
}));

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('File Routes', () => {
  let app: express.Application;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('middleware application', () => {
    it('should apply authentication middleware', async () => {
      const response = await request(app)
        .post('/file/create')
        .send({ filePath: '/tmp/test.txt', content: 'test' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /file/create', () => {
    const { createFile } = require('../../src/routes/file');

    it('should call createFile handler', async () => {
      createFile.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', content: 'test content' });

      expect(createFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/list', () => {
    const { listFiles } = require('../../src/routes/file');

    it('should call listFiles handler', async () => {
      listFiles.mockImplementation((req: any, res: any) => {
        res.json({ files: [] });
      });

      const response = await request(app)
        .post('/file/list')
        .set('Authorization', `Bearer ${token}`)
        .send({ directory: '/tmp' });

      expect(listFiles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /file/list', () => {
    const { listFiles } = require('../../src/routes/file');

    it('should map query params to body and call listFiles', async () => {
      listFiles.mockImplementation((req: any, res: any) => {
        expect(req.body.directory).toBe('/tmp');
        expect(req.body.limit).toBe(10);
        expect(req.body.recursive).toBe(true);
        res.json({ files: [] });
      });

      const response = await request(app)
        .get('/file/list?directory=/tmp&limit=10&recursive=true')
        .set('Authorization', `Bearer ${token}`);

      expect(listFiles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/read', () => {
    const { readFile } = require('../../src/routes/file');

    it('should call readFile handler', async () => {
      readFile.mockImplementation((req: any, res: any) => {
        res.json({ content: 'file content' });
      });

      const response = await request(app)
        .post('/file/read')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt' });

      expect(readFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /file/read', () => {
    const { readFile } = require('../../src/routes/file');

    it('should map query params to body and call readFile', async () => {
      readFile.mockImplementation((req: any, res: any) => {
        expect(req.body.filePath).toBe('/tmp/test.txt');
        expect(req.body.startLine).toBe(1);
        expect(req.body.endLine).toBe(10);
        res.json({ content: 'file content' });
      });

      const response = await request(app)
        .get('/file/read?filePath=/tmp/test.txt&startLine=1&endLine=10')
        .set('Authorization', `Bearer ${token}`);

      expect(readFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/update', () => {
    const { updateFile } = require('../../src/routes/file');

    it('should call updateFile handler', async () => {
      updateFile.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', pattern: 'old', replacement: 'new' });

      expect(updateFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/amend', () => {
    const { amendFile } = require('../../src/routes/file');

    it('should call amendFile handler', async () => {
      amendFile.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/amend')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', content: 'additional content' });

      expect(amendFile).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/diff', () => {
    const { applyDiff } = require('../../src/routes/file');

    it('should call applyDiff handler', async () => {
      applyDiff.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/diff')
        .set('Authorization', `Bearer ${token}`)
        .send({ diff: 'diff content' });

      expect(applyDiff).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/patch', () => {
    const { applyPatch } = require('../../src/routes/file');

    it('should call applyPatch handler', async () => {
      applyPatch.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/patch')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', oldText: 'old', replace: 'new' });

      expect(applyPatch).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/fuzzy-patch', () => {
    const { applyFuzzyPatch } = require('../../src/routes/file');

    it('should call applyFuzzyPatch handler', async () => {
      applyFuzzyPatch.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/fuzzy-patch')
        .set('Authorization', `Bearer ${token}`)
        .send({ filePath: '/tmp/test.txt', search: 'old', replace: 'new' });

      expect(applyFuzzyPatch).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/search', () => {
    const { fsSearch } = require('../../src/routes/file');

    it('should call fsSearch handler', async () => {
      fsSearch.mockImplementation((req: any, res: any) => {
        res.json({ results: [] });
      });

      const response = await request(app)
        .post('/file/search')
        .set('Authorization', `Bearer ${token}`)
        .send({ pattern: 'test', path: '/tmp' });

      expect(fsSearch).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /file/operations', () => {
    const { listFileOperations } = require('../../src/routes/file');

    it('should call listFileOperations handler', async () => {
      listFileOperations.mockImplementation((req: any, res: any) => {
        res.json({ operations: {} });
      });

      const response = await request(app)
        .get('/file/operations')
        .set('Authorization', `Bearer ${token}`);

      expect(listFileOperations).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/:operation/toggle', () => {
    const { toggleFileOperation } = require('../../src/routes/file');

    it('should call toggleFileOperation handler', async () => {
      toggleFileOperation.mockImplementation((req: any, res: any) => {
        res.json({ enabled: true });
      });

      const response = await request(app)
        .post('/file/create/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });

      expect(toggleFileOperation).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('POST /file/operations/bulk', () => {
    const { bulkToggleFileOperations } = require('../../src/routes/file');

    it('should call bulkToggleFileOperations handler', async () => {
      bulkToggleFileOperations.mockImplementation((req: any, res: any) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/file/operations/bulk')
        .set('Authorization', `Bearer ${token}`)
        .send({ operations: { create: true, read: false } });

      expect(bulkToggleFileOperations).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });
});