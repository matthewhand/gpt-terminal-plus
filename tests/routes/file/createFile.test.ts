import request from 'supertest';
import express, { Router } from 'express';
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

describe('POST /file/create', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../../tmp');
  const testFile = path.join(testDir, 'create-test.txt');
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
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

  it('should create file successfully', async () => {
    const response = await request(app)
      .post('/file/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        filePath: testFile,
        content: 'Hello World'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('File created successfully');
    expect(response.body.data.filePath).toBe(testFile);
    expect(fs.existsSync(testFile)).toBe(true);
    expect(fs.readFileSync(testFile, 'utf8')).toBe('Hello World');
  });

  it('should handle overwrite scenario', async () => {
    // Create initial file
    fs.writeFileSync(testFile, 'Original content');
    
    const response = await request(app)
      .post('/file/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        filePath: testFile,
        content: 'New content',
        backup: true
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(fs.readFileSync(testFile, 'utf8')).toBe('New content');
  });

  it('should return error for missing filePath', async () => {
    const response = await request(app)
      .post('/file/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello World' });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toContain('File path is required');
    expect(response.body.data).toBe(null);
  });

  it('should return error for invalid filePath type', async () => {
    const response = await request(app)
      .post('/file/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        filePath: 123,
        content: 'Hello World'
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toContain('must be a string');
  });
});