import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import setupMiddlewares from '../../../src/middlewares/setupMiddlewares';
import * as routesMod from '../../../src/routes';

function makeApp() {
  const app = express();
  setupMiddlewares(app);

  const anyRoutes: any = routesMod as any;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  }
  return app;
}

describe('POST /file/read', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../../tmp');
  const testFile = path.join(testDir, 'read-test.txt');
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    const content = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';
    fs.writeFileSync(testFile, content);
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should read entire file successfully', async () => {
    const response = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .send({ filePath: testFile });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.content).toBe('Line 1\nLine 2\nLine 3\nLine 4\nLine 5');
    expect(response.body.data.truncated).toBe(false);
  });

  it('should read partial line range', async () => {
    const response = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .send({
        filePath: testFile,
        startLine: 2,
        endLine: 4
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.content).toBe('Line 2\nLine 3\nLine 4');
    expect(response.body.data.startLine).toBe(2);
    expect(response.body.data.endLine).toBe(4);
  });

  it('should handle out-of-bounds line numbers', async () => {
    const response = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .send({
        filePath: testFile,
        startLine: 10,
        endLine: 20
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.content).toBe('');
  });

  it('should return error for missing filePath', async () => {
    const response = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toContain('filePath must be provided');
  });

  it('should return error for invalid line numbers', async () => {
    const response = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .send({
        filePath: testFile,
        startLine: 0
      });

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('error');
  });

  it('should return error for endLine < startLine', async () => {
    const response = await request(app)
      .post('/file/read')
      .set('Authorization', `Bearer ${token}`)
      .send({
        filePath: testFile,
        startLine: 5,
        endLine: 2
      });

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('error');
  });
});
