import request from 'supertest';
import type { Application } from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * GET /server/list is backed by src/managers/serverList.ts, which reads a
 * file-based server config (config/servers.json or SERVERS_CONFIG_PATH) and
 * filters entries by the caller's bearer token (allowedTokens).
 *
 * The legacy in-memory registry (serverRegistry/serverLoader) is no longer
 * consulted by any route, so this suite seeds a temp servers.json fixture and
 * points SERVERS_CONFIG_PATH at it before the route modules load.
 */
describe('Server Routes with file-based server list', () => {
  let app: Application;
  let tmpDir: string;
  const token = 'test-token';

  beforeAll(() => {
    process.env.API_TOKEN = token;

    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'servers-fixture-'));
    const configPath = path.join(tmpDir, 'servers.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify([
        { key: 'localhost', label: 'Localhost', protocol: 'local', hostname: 'localhost' },
        {
          key: 'restricted',
          label: 'Restricted',
          protocol: 'ssh',
          hostname: 'restricted.example.com',
          allowedTokens: ['some-other-token'],
        },
      ])
    );
    process.env.SERVERS_CONFIG_PATH = configPath;

    // serverList computes its config path at module load, so (re)load the
    // route modules only after SERVERS_CONFIG_PATH is set.
    jest.resetModules();
    /* eslint-disable @typescript-eslint/no-var-requires */
    const express = require('express');
    const setupMiddlewares = require('../../src/middlewares/setupMiddlewares').default;
    const routesMod: any = require('../../src/routes');
    /* eslint-enable @typescript-eslint/no-var-requires */

    app = express();
    setupMiddlewares(app);
    if (typeof routesMod.setupApiRouter === 'function') {
      routesMod.setupApiRouter(app);
    } else {
      const router = express.Router();
      const setup = routesMod.setupRoutes || routesMod.default;
      if (typeof setup === 'function') setup(router);
      app.use('/', router);
    }
  });

  afterAll(() => {
    delete process.env.SERVERS_CONFIG_PATH;
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should return servers from the configured servers.json', async () => {
    const response = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('servers');
    expect(Array.isArray(response.body.servers)).toBe(true);
    expect(response.body.servers.length).toBeGreaterThan(0);

    const server = response.body.servers[0];
    expect(server).toHaveProperty('key');
    expect(server).toHaveProperty('label');
    expect(server).toHaveProperty('protocol');
    expect(server).toHaveProperty('hostname');
  });

  it('should include localhost server from config', async () => {
    const response = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    const hostnames = response.body.servers.map((s: any) => s.hostname);
    expect(hostnames).toContain('localhost');
  });

  it('should hide servers whose allowedTokens exclude the caller', async () => {
    const response = await request(app)
      .get('/server/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    const keys = response.body.servers.map((s: any) => s.key);
    expect(keys).toContain('localhost');
    expect(keys).not.toContain('restricted');
  });
});
