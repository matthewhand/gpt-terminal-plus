
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

describe('POST /file/amend', () => {
  let app: express.Application;
  const testDir = path.join(__dirname, '../../../tmp');
  const testFile = path.join(testDir, 'amend-test.txt');
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;
    app = makeApp();
    
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    const content = 'Hello';
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

  it('should amend file content successfully', async () => {
    const response = await request(app)
      .post('/file/amend')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        filePath: testFile, 
        content: ' world'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');

    const updatedContent = fs.readFileSync(testFile, 'utf8');
    expect(updatedContent).toBe('Hello world');
  });

  it('should return error for missing filePath', async () => {
    const response = await request(app)
      .post('/file/amend')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: ' world' });

    expect(response.status).toBe(400);
  });
});
