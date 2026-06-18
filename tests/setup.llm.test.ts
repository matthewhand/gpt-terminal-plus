import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';
import { SettingsStore } from '../src/settings/store';

describe('Setup LLM panel', () => {
  let app: express.Express;
  let token: string;

  beforeEach(() => {
    const { _resetGlobalStateForTests } = require('../src/utils/GlobalStateHelper');
    const { __clearSessionsForTests } = require('../src/session/ShellSessionDriver');
    _resetGlobalStateForTests();
    __clearSessionsForTests();
    process.env.NODE_ENV = 'test';
    process.env.NODE_CONFIG_DIR = 'config/test';
    delete process.env.LLM_ENABLED;
    token = getOrGenerateApiToken();
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupApiRouter(app);
  });

  describe('GET /setup page', () => {
    it('renders the LLM panel with toggle, provider dropdown and test button', async () => {
      const res = await request(app).get('/setup').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      // Existing marker kept stable for setup.ui.test.ts and docs screenshots
      expect(res.text).toContain('<h1>Setup UI</h1>');
      expect(res.text).toContain('id="llm-panel"');
      expect(res.text).toContain('id="llm-enabled"');
      expect(res.text).toContain('id="llm-provider"');
      for (const provider of ['none', 'ollama', 'lmstudio', 'openai']) {
        expect(res.text).toContain(`<option value="${provider}">`);
      }
      // per-provider field groups
      expect(res.text).toContain('id="fields-ollama"');
      expect(res.text).toContain('id="fields-lmstudio"');
      expect(res.text).toContain('id="fields-openai"');
      // test connection wiring
      expect(res.text).toContain('id="llm-test-btn"');
      expect(res.text).toContain('/chat/models');
    });
  });

  describe('GET /setup/llm', () => {
    it('rejects requests without a token', async () => {
      const res = await request(app).get('/setup/llm');
      expect(res.status).toBe(401);
    });

    it('returns current llm settings', async () => {
      const res = await request(app).get('/setup/llm').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.llm).toBeDefined();
      expect(typeof res.body.llm.enabled).toBe('boolean');
      expect(res.body.llm.provider).toBeDefined();
    });
  });

  describe('POST /setup/llm', () => {
    it('rejects requests without a token', async () => {
      const res = await request(app).post('/setup/llm').send({ enabled: true });
      expect(res.status).toBe(401);
    });

    it('rejects unknown providers', async () => {
      const res = await request(app)
        .post('/setup/llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ provider: 'skynet' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('skynet');
    });

    it('persists enable toggle, provider and per-provider URLs', async () => {
      const res = await request(app)
        .post('/setup/llm')
        .set('Authorization', `Bearer ${token}`)
        .send({
          enabled: true,
          provider: 'ollama',
          defaultModel: 'llama3.2',
          ollamaURL: 'http://127.0.0.1:11434',
        });
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.llm.enabled).toBe(true);
      expect(res.body.llm.provider).toBe('ollama');

      const stored = SettingsStore.get().llm;
      expect(stored.enabled).toBe(true);
      expect(stored.provider).toBe('ollama');
      expect(stored.defaultModel).toBe('llama3.2');
      expect(stored.ollamaURL).toBe('http://127.0.0.1:11434');
    });

    it('redacts the apiKey in responses and ignores the redaction placeholder on save', async () => {
      const set = await request(app)
        .post('/setup/llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ provider: 'openai', baseURL: 'https://api.openai.com/v1', apiKey: 'sk-secret' });
      expect(set.status).toBe(200);
      expect(set.body.llm.apiKey).toBe('*****');
      expect(SettingsStore.get().llm.apiKey).toBe('sk-secret');

      // Re-saving the redacted placeholder must not clobber the stored key
      const resave = await request(app)
        .post('/setup/llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ apiKey: '*****' });
      expect(resave.status).toBe(200);
      expect(SettingsStore.get().llm.apiKey).toBe('sk-secret');

      const get = await request(app).get('/setup/llm').set('Authorization', `Bearer ${token}`);
      expect(get.body.llm.apiKey).toBe('*****');
    });
  });

  describe('GET /settings reports llm.enabled for the WebUI auto-hide', () => {
    it('reflects the toggle persisted via POST /setup/llm', async () => {
      await request(app)
        .post('/setup/llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: true });
      let res = await request(app).get('/settings').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      // actual shape from getRedactedSettings is groups directly under body (llm.enabled.value)
      expect(res.body.llm && res.body.llm.enabled && res.body.llm.enabled.value).toBe(true);

      await request(app)
        .post('/setup/llm')
        .set('Authorization', `Bearer ${token}`)
        .send({ enabled: false });
      res = await request(app).get('/settings').set('Authorization', `Bearer ${token}`);
      expect(res.body.llm && res.body.llm.enabled && res.body.llm.enabled.value).toBe(false);
      expect(res.body.llm && res.body.llm.enabled && res.body.llm.enabled.readOnly).toBe(false);
    });
  });
});
