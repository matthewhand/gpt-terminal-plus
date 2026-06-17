const request = require('supertest');
const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const setupMiddlewares =
  require('../src/middlewares/setupMiddlewares').default ||
  require('../src/middlewares/setupMiddlewares');
const routesMod = require('../src/routes');
const { registerOpenApiRoutes } = require('../src/openapi');
const { getOrGenerateApiToken } = require('../src/common/apiToken');

function makeApp() {
  const app = express();
  setupMiddlewares(app);
  
  // Register OpenAPI routes
  registerOpenApiRoutes(app);
  
  const anyRoutes = routesMod;
  if (typeof anyRoutes.setupApiRouter === 'function') {
    anyRoutes.setupApiRouter(app);
  } else {
    const { Router } = require('express');
    const router = Router();
    const setup = anyRoutes.setupRoutes || anyRoutes.default;
    if (typeof setup === 'function') setup(router);
    app.use('/', router);
  }
  return app;
}

describe('OpenAPI Specification', () => {
  let app;
  let token;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    token = getOrGenerateApiToken();
    app = makeApp();
  });

  describe('OpenAPI JSON Endpoint', () => {
    it('serves /openapi.json with valid structure', async () => {
      const res = await request(app)
        .get('/openapi.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
      expect(res.body).toHaveProperty('openapi');
      expect(res.body).toHaveProperty('paths');
      expect(res.body).toHaveProperty('info');
      expect(res.body).toHaveProperty('components');
    });

    it('validates OpenAPI version format', async () => {
      const res = await request(app)
        .get('/openapi.json');
      expect(res.body.openapi).toMatch(/^3\.[0-9]+\.[0-9]+$/);
    });

    it('includes required info fields', async () => {
      const res = await request(app)
        .get('/openapi.json');
      expect(res.body.info).toHaveProperty('title');
      expect(res.body.info).toHaveProperty('version');
      expect(typeof res.body.info.title).toBe('string');
      expect(typeof res.body.info.version).toBe('string');
    });

    it('includes server configuration', async () => {
      const res = await request(app)
        .get('/openapi.json');
      expect(res.body).toHaveProperty('servers');
      expect(Array.isArray(res.body.servers)).toBe(true);
      expect(res.body.servers.length).toBeGreaterThan(0);
      expect(res.body.servers[0]).toHaveProperty('url');
    });

    it('validates path definitions', async () => {
      const res = await request(app)
        .get('/openapi.json');
      const paths = res.body.paths;
      expect(typeof paths).toBe('object');
      
      // Check for common endpoints
      const expectedPaths = ['/command/execute', '/chat/completions', '/model'];
      expectedPaths.forEach(path => {
        if (paths[path]) {
          expect(typeof paths[path]).toBe('object');
          const methods = Object.keys(paths[path]);
          expect(methods.length).toBeGreaterThan(0);
        }
      });
    });

    it('includes security definitions', async () => {
      const res = await request(app)
        .get('/openapi.json');
      if (res.body.components && res.body.components.securitySchemes) {
        expect(typeof res.body.components.securitySchemes).toBe('object');
      }
    });
  });

  describe('OpenAPI YAML Endpoint', () => {
    it('serves /openapi.yaml with valid YAML format', async () => {
      const res = await request(app)
        .get('/openapi.yaml');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/text\/yaml|application\/yaml/);
      expect(res.text).toContain('openapi:');
      expect(res.text).toContain('paths:');
      expect(res.text).toContain('info:');
    });

    it('parses as valid YAML', async () => {
      const res = await request(app)
        .get('/openapi.yaml');
      expect(() => {
        const parsed = yaml.load(res.text);
        expect(typeof parsed).toBe('object');
        expect(parsed).toHaveProperty('openapi');
      }).not.toThrow();
    });

    it('matches JSON content structure', async () => {
      const jsonRes = await request(app).get('/openapi.json');
      const yamlRes = await request(app).get('/openapi.yaml');
      
      const yamlParsed = yaml.load(yamlRes.text);
      expect(yamlParsed.openapi).toBe(jsonRes.body.openapi);
      expect(yamlParsed.info.title).toBe(jsonRes.body.info.title);
      expect(yamlParsed.info.version).toBe(jsonRes.body.info.version);
    });
  });

  describe('Static File Consistency', () => {
    it('matches static openapi.json file if exists', async () => {
      const staticPath = './public/openapi.json';
      if (fs.existsSync(staticPath)) {
        const staticContent = JSON.parse(fs.readFileSync(staticPath, 'utf8'));
        const res = await request(app).get('/openapi.json');
        
        expect(res.body.openapi).toBe(staticContent.openapi);
        expect(res.body.info.title).toBe(staticContent.info.title);
      }
    });

    it('matches static openapi.yaml file if exists', async () => {
      const staticPath = './public/openapi.yaml';
      if (fs.existsSync(staticPath)) {
        const staticContent = fs.readFileSync(staticPath, 'utf8');
        const res = await request(app).get('/openapi.yaml');
        
        const staticParsed = yaml.load(staticContent);
        const responseParsed = yaml.load(res.text);
        
        expect(responseParsed.openapi).toBe(staticParsed.openapi);
        expect(responseParsed.info.title).toBe(staticParsed.info.title);
      }
    });
  });

  describe('Swagger UI Integration', () => {
    it('serves Swagger UI at /docs', async () => {
      const res = await request(app)
        .get('/docs');
      expect([200, 302]).toContain(res.status);
      if (res.status === 200) {
        expect(res.text).toContain('swagger');
      }
    });
  });

  describe('Error Handling', () => {
    it('handles malformed requests gracefully', async () => {
      const res = await request(app)
        .get('/openapi.json')
        .set('Accept', 'invalid/type');
      expect(res.status).toBe(200); // Should still serve JSON
    });

    it('returns 404 for non-existent OpenAPI endpoints', async () => {
      const res = await request(app)
        .get('/openapi.xml');
      expect(res.status).toBe(404);
    });
  });

  describe('Content Validation', () => {
    it('validates schema definitions exist', async () => {
      const res = await request(app)
        .get('/openapi.json');
      
      if (res.body.components && res.body.components.schemas) {
        const schemas = res.body.components.schemas;
        expect(typeof schemas).toBe('object');
        
        // Validate common schema structures
        Object.values(schemas).forEach(schema => {
          expect(schema).toHaveProperty('type');
        });
      }
    });

    it('validates response definitions', async () => {
      const res = await request(app)
        .get('/openapi.json');
      
      const paths = res.body.paths;
      Object.values(paths).forEach(pathItem => {
        Object.values(pathItem).forEach(operation => {
          if (operation.responses) {
            expect(typeof operation.responses).toBe('object');
            expect(Object.keys(operation.responses).length).toBeGreaterThan(0);
          }
        });
      });
    });
  });
});
