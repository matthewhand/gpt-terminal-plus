/**
 * OAuth resource-server behavior for the MCP endpoint. Uses a real local JWKS
 * server + jose-signed tokens so JWT verification is exercised end-to-end (not
 * mocked). Auth is asserted via GET /mcp: passing the guard yields a 400
 * "missing mcp-session-id" (transport-level), so 400 == authenticated and
 * 401 == rejected — cleanly isolating auth from the MCP transport.
 */
import express from 'express';
import request from 'supertest';
import http from 'http';
import { generateKeyPair, exportJWK, SignJWT, type KeyLike } from 'jose';
import { setupMcpServer } from '../../src/modules/mcpServer';
import { __resetJwksForTests } from '../../src/auth/mcpOAuth';
import { getOrGenerateApiToken } from '../../src/common/apiToken';

const ISSUER = 'https://as.test.local';
const AUDIENCE = 'https://mcp.test.local/mcp';

describe('MCP OAuth resource server', () => {
  let jwksServer: http.Server;
  let jwksUrl: string;
  let privateKey: KeyLike;
  let apiToken: string;
  const savedEnv: Record<string, string | undefined> = {};

  beforeAll(async () => {
    apiToken = getOrGenerateApiToken();
    const { publicKey, privateKey: pk } = await generateKeyPair('RS256');
    privateKey = pk as KeyLike;
    const jwk = await exportJWK(publicKey);
    jwk.kid = 'test-key-1';
    jwk.alg = 'RS256';
    jwk.use = 'sig';

    jwksServer = http.createServer((_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ keys: [jwk] }));
    });
    await new Promise<void>((resolve) => jwksServer.listen(0, resolve));
    const addr = jwksServer.address();
    if (!addr || typeof addr === 'string') throw new Error('no jwks port');
    jwksUrl = `http://127.0.0.1:${addr.port}/jwks`;

    for (const k of ['MCP_OAUTH_ENABLED', 'MCP_OAUTH_ISSUER', 'MCP_OAUTH_JWKS_URI', 'MCP_OAUTH_AUDIENCE', 'MCP_OAUTH_RESOURCE', 'MCP_OAUTH_ALLOW_STATIC_FALLBACK']) {
      savedEnv[k] = process.env[k];
    }
  });

  afterAll(async () => {
    for (const [k, v] of Object.entries(savedEnv)) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
    await new Promise<void>((resolve) => jwksServer.close(() => resolve()));
  });

  beforeEach(() => {
    __resetJwksForTests();
    process.env.MCP_OAUTH_ISSUER = ISSUER;
    process.env.MCP_OAUTH_JWKS_URI = jwksUrl;
    process.env.MCP_OAUTH_AUDIENCE = AUDIENCE;
    process.env.MCP_OAUTH_RESOURCE = AUDIENCE;
    delete process.env.MCP_OAUTH_ALLOW_STATIC_FALLBACK;
  });

  function makeApp() {
    const app = express();
    app.use(express.json());
    setupMcpServer(app);
    return app;
  }

  async function signToken(overrides: { exp?: string; aud?: string; iss?: string } = {}) {
    return await new SignJWT({})
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key-1' })
      .setIssuer(overrides.iss ?? ISSUER)
      .setAudience(overrides.aud ?? AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(overrides.exp ?? '5m')
      .sign(privateKey);
  }

  describe('with OAuth enabled', () => {
    beforeEach(() => { process.env.MCP_OAUTH_ENABLED = 'true'; });

    it('serves protected-resource metadata', async () => {
      const res = await request(makeApp()).get('/.well-known/oauth-protected-resource');
      expect(res.status).toBe(200);
      expect(res.body.resource).toBe(AUDIENCE);
      expect(res.body.authorization_servers).toEqual([ISSUER]);
      expect(res.body.jwks_uri).toBe(jwksUrl);
      expect(res.body.bearer_methods_supported).toContain('header');
    });

    it('rejects a request with no token and points at the metadata', async () => {
      const res = await request(makeApp()).get('/mcp');
      expect(res.status).toBe(401);
      expect(res.headers['www-authenticate']).toContain('resource_metadata=');
      expect(res.headers['www-authenticate']).toContain('/.well-known/oauth-protected-resource');
    });

    it('accepts a valid JWT (passes the guard -> 400 missing session)', async () => {
      const token = await signToken();
      const res = await request(makeApp()).get('/mcp').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.text).toContain('mcp-session-id');
    });

    it('rejects an expired JWT with a 401 challenge', async () => {
      const token = await signToken({ exp: '-1m' });
      const res = await request(makeApp()).get('/mcp').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
      expect(res.headers['www-authenticate']).toContain('error="invalid_token"');
    });

    it('rejects a JWT with the wrong audience', async () => {
      const token = await signToken({ aud: 'https://someone-else/mcp' });
      const res = await request(makeApp()).get('/mcp').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
    });

    it('still accepts the static API token by default (fallback)', async () => {
      const res = await request(makeApp()).get('/mcp').set('Authorization', `Bearer ${apiToken}`);
      expect(res.status).toBe(400); // passed auth, failed at transport
    });

    it('rejects the static API token when fallback is disabled', async () => {
      process.env.MCP_OAUTH_ALLOW_STATIC_FALLBACK = 'false';
      const res = await request(makeApp()).get('/mcp').set('Authorization', `Bearer ${apiToken}`);
      expect(res.status).toBe(401);
    });
  });

  describe('with OAuth disabled (default)', () => {
    beforeEach(() => { delete process.env.MCP_OAUTH_ENABLED; });

    it('does not serve protected-resource metadata', async () => {
      const res = await request(makeApp()).get('/.well-known/oauth-protected-resource');
      expect(res.status).toBe(404);
    });

    it('still enforces the static API token', async () => {
      const noTok = await request(makeApp()).get('/mcp');
      expect(noTok.status).toBe(401);
      const withTok = await request(makeApp()).get('/mcp').set('Authorization', `Bearer ${apiToken}`);
      expect(withTok.status).toBe(400); // passed static auth
    });
  });
});
