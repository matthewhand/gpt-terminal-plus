import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { SettingsStore } from '../settings/store';

const router = Router();

const CONFIG_DIR = process.env.NODE_CONFIG_DIR || 'config';
const ENV = process.env.NODE_ENV || 'development';
const TARGET = path.join(CONFIG_DIR, `${ENV}.json`);

const LLM_PROVIDERS = ['none', 'ollama', 'lmstudio', 'openai'] as const;
type LlmProvider = (typeof LLM_PROVIDERS)[number];

function loadConfig(): any {
  try { return JSON.parse(fs.readFileSync(TARGET, 'utf8')); } catch { return {}; }
}
function saveConfig(obj: any) {
  fs.mkdirSync(path.dirname(TARGET), { recursive: true });
  fs.writeFileSync(TARGET, JSON.stringify(obj, null, 2));
}

/** Redact secrets before returning LLM settings to the browser. */
function redactLlm(llm: ReturnType<typeof SettingsStore.get>['llm']) {
  return {
    ...llm,
    apiKey: llm.apiKey ? '*****' : '',
  };
}

const SETUP_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Setup - GPT Terminal Plus</title>
  <style>
    :root {
      --bg: #0f1216; --fg: #e6edf3; --muted: #9aa4af; --card: #151a21;
      --accent: #2f81f7; --danger: #f85149; --border: #2d333b; --ok: #3fb950;
    }
    html, body {
      margin: 0; padding: 0; background: var(--bg); color: var(--fg);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
    }
    header { padding: 16px 20px; border-bottom: 1px solid var(--border); background: #0c0f13; }
    header h1 { margin: 0; font-size: 18px; letter-spacing: 0.3px; }
    header nav { margin-top: 8px; }
    header nav a { color: var(--muted); text-decoration: none; margin-right: 12px; font-size: 13px; }
    header nav a:hover { color: var(--fg); }
    main { padding: 20px; max-width: 760px; margin: 0 auto; }
    .panel {
      background: var(--card); border: 1px solid var(--border); border-radius: 8px;
      padding: 16px; margin-bottom: 16px;
    }
    .panel h2 { margin: 0 0 8px 0; font-size: 16px; }
    label { display: block; margin-top: 12px; font-size: 14px; color: var(--muted); }
    label.inline { display: inline-flex; align-items: center; gap: 8px; color: var(--fg); }
    input[type="text"], input[type="password"], select {
      display: block; margin-top: 4px; background: #0c0f13; color: var(--fg);
      border: 1px solid var(--border); border-radius: 6px; padding: 8px 10px;
      min-width: 320px; font-family: inherit;
    }
    button {
      background: var(--accent); color: white; border: 0; border-radius: 6px;
      padding: 8px 12px; margin-top: 16px; margin-right: 8px; cursor: pointer; font-weight: 600;
    }
    button.secondary { background: transparent; color: var(--fg); border: 1px solid var(--border); }
    .status { margin-top: 10px; font-size: 13px; color: var(--muted); }
    .status.error { color: var(--danger); }
    .status.ok { color: var(--ok); }
    .note { font-size: 13px; color: var(--muted); margin-top: 8px; }
    .provider-fields { display: none; }
    .provider-fields.visible { display: block; }
  </style>
</head>
<body>
  <header>
    <h1>Setup UI</h1>
    <nav>
      <a href="/dashboard.html">Dashboard</a>
      <a href="/settings.html">Settings</a>
      <a href="/docs">API Docs</a>
    </nav>
  </header>
  <main>
    <section class="panel">
      <h2>Authentication</h2>
      <label class="inline">API Token:
        <input type="password" id="token" placeholder="Paste API_TOKEN" autocomplete="off" />
      </label>
      <label class="inline"><input type="checkbox" id="remember" /> Remember token</label>
      <div class="note">The token is required to load and save settings.</div>
    </section>

    <section class="panel" id="llm-panel">
      <h2>LLM</h2>
      <label class="inline">
        <input type="checkbox" id="llm-enabled" /> Enable LLM execution
      </label>

      <label for="llm-provider">Provider
        <select id="llm-provider">
          <option value="none">none</option>
          <option value="ollama">ollama</option>
          <option value="lmstudio">lmstudio</option>
          <option value="openai">openai</option>
        </select>
      </label>

      <label for="llm-defaultModel">Default model
        <input type="text" id="llm-defaultModel" placeholder="e.g. llama3.2, gpt-4o-mini" />
      </label>

      <div id="fields-ollama" class="provider-fields">
        <label for="llm-ollamaURL">Ollama URL
          <input type="text" id="llm-ollamaURL" placeholder="http://localhost:11434" />
        </label>
      </div>

      <div id="fields-lmstudio" class="provider-fields">
        <label for="llm-lmstudioURL">LM Studio URL
          <input type="text" id="llm-lmstudioURL" placeholder="http://localhost:1234/v1" />
        </label>
      </div>

      <div id="fields-openai" class="provider-fields">
        <label for="llm-baseURL">Base URL
          <input type="text" id="llm-baseURL" placeholder="https://api.openai.com/v1" />
        </label>
        <label for="llm-apiKey">API key
          <input type="password" id="llm-apiKey" placeholder="sk-..." autocomplete="off" />
        </label>
      </div>

      <button id="llm-save-btn">Save LLM settings</button>
      <button id="llm-test-btn" class="secondary">Test connection</button>
      <div id="llm-status" class="status"></div>
      <div id="llm-test-status" class="status"></div>
    </section>
  </main>

  <script>
    (function () {
      const $ = (id) => document.getElementById(id);
      const tokenInput = $('token');
      const remember = $('remember');
      const statusEl = $('llm-status');
      const testStatusEl = $('llm-test-status');

      function setStatus(el, msg, cls) {
        el.textContent = msg || '';
        el.className = 'status' + (cls ? ' ' + cls : '');
      }
      function authHeaders() {
        const token = tokenInput.value.trim();
        return token ? { 'Authorization': 'Bearer ' + token } : {};
      }
      function saveTokenMaybe() {
        if (remember.checked) localStorage.setItem('settings_api_token', tokenInput.value || '');
        else localStorage.removeItem('settings_api_token');
      }
      function loadSavedToken() {
        try {
          const usp = new URLSearchParams(location.search);
          if (usp.has('token')) { tokenInput.value = usp.get('token'); return; }
        } catch {}
        const saved = localStorage.getItem('settings_api_token');
        if (saved) { tokenInput.value = saved; remember.checked = true; }
      }

      function showProviderFields() {
        const provider = $('llm-provider').value;
        ['ollama', 'lmstudio', 'openai'].forEach((p) => {
          $('fields-' + p).classList.toggle('visible', p === provider);
        });
      }

      async function loadLlmSettings() {
        try {
          const res = await fetch('/setup/llm', { headers: authHeaders() });
          if (!res.ok) {
            setStatus(statusEl, 'Could not load LLM settings (' + res.status + '). Paste a valid API token.', 'error');
            return;
          }
          const data = await res.json();
          const llm = data.llm || {};
          $('llm-enabled').checked = !!llm.enabled;
          $('llm-provider').value = llm.provider || 'none';
          $('llm-defaultModel').value = llm.defaultModel || '';
          $('llm-ollamaURL').value = llm.ollamaURL || '';
          $('llm-lmstudioURL').value = llm.lmstudioURL || '';
          $('llm-baseURL').value = llm.baseURL || '';
          $('llm-apiKey').value = llm.apiKey || '';
          showProviderFields();
          setStatus(statusEl, 'Loaded current LLM settings.', 'ok');
        } catch (err) {
          setStatus(statusEl, 'Network error: ' + err.message, 'error');
        }
      }

      async function saveLlmSettings() {
        setStatus(statusEl, 'Saving...', '');
        const body = {
          enabled: $('llm-enabled').checked,
          provider: $('llm-provider').value,
          defaultModel: $('llm-defaultModel').value.trim(),
          ollamaURL: $('llm-ollamaURL').value.trim(),
          lmstudioURL: $('llm-lmstudioURL').value.trim(),
          baseURL: $('llm-baseURL').value.trim(),
          apiKey: $('llm-apiKey').value.trim(),
        };
        try {
          const res = await fetch('/setup/llm', {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
            body: JSON.stringify(body),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            setStatus(statusEl, 'Saved.', 'ok');
            saveTokenMaybe();
          } else {
            setStatus(statusEl, 'Save failed: ' + (data.error || res.status), 'error');
          }
        } catch (err) {
          setStatus(statusEl, 'Network error: ' + err.message, 'error');
        }
      }

      async function testConnection() {
        setStatus(testStatusEl, 'Testing connection...', '');
        try {
          const res = await fetch('/chat/models', { headers: authHeaders() });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            const count = Array.isArray(data.supported) ? data.supported.length : 0;
            setStatus(testStatusEl,
              'Connection OK — provider: ' + (data.provider || 'unknown') + ', ' + count + ' model(s) available.',
              'ok');
          } else {
            setStatus(testStatusEl, 'Connection failed: ' + (data.message || data.error || res.status), 'error');
          }
        } catch (err) {
          setStatus(testStatusEl, 'Connection failed: ' + err.message, 'error');
        }
      }

      $('llm-provider').addEventListener('change', showProviderFields);
      $('llm-save-btn').addEventListener('click', saveLlmSettings);
      $('llm-test-btn').addEventListener('click', testConnection);
      remember.addEventListener('change', saveTokenMaybe);

      loadSavedToken();
      showProviderFields();
      if (tokenInput.value) loadLlmSettings();
    })();
  </script>
</body>
</html>`;

/** UI pages expected by tests */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).send(SETUP_PAGE);
});
router.get('/policy', (_req: Request, res: Response) => {
  res.status(200).send('<!doctype html><html><body><h2>Safety Policy</h2></body></html>');
});

/** GET /setup/llm — current LLM settings (apiKey redacted), token-protected */
router.get('/llm', checkAuthToken, (_req: Request, res: Response) => {
  try {
    const llm = SettingsStore.get().llm;
    return res.status(200).json({ llm: redactLlm(llm) });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

/** POST /setup/llm — persist LLM settings via the settings store, token-protected */
router.post('/llm', checkAuthToken, (req: Request, res: Response) => {
  try {
    const body: any = req.body || {};
    const current = SettingsStore.get().llm;

    if (body.provider !== undefined && !LLM_PROVIDERS.includes(body.provider)) {
      return res.status(400).json({
        error: `invalid provider "${body.provider}" (expected one of: ${LLM_PROVIDERS.join(', ')})`,
      });
    }

    const next = {
      ...current,
      enabled: body.enabled !== undefined
        ? body.enabled === true || body.enabled === 'true' || body.enabled === 'on'
        : current.enabled,
      provider: (body.provider as LlmProvider) ?? current.provider,
      defaultModel: typeof body.defaultModel === 'string' ? body.defaultModel : current.defaultModel,
      baseURL: typeof body.baseURL === 'string' ? body.baseURL : current.baseURL,
      ollamaURL: typeof body.ollamaURL === 'string' && body.ollamaURL !== '' ? body.ollamaURL : current.ollamaURL,
      lmstudioURL: typeof body.lmstudioURL === 'string' && body.lmstudioURL !== '' ? body.lmstudioURL : current.lmstudioURL,
      // Never overwrite a stored key with the redaction placeholder; empty string clears it.
      apiKey: typeof body.apiKey === 'string' && body.apiKey !== '*****' ? body.apiKey : current.apiKey,
    };

    const saved = SettingsStore.set({ llm: next });
    return res.status(200).json({ ok: true, llm: redactLlm(saved.llm) });
  } catch (e: any) {
    return res.status(400).json({ error: String(e?.message || e) });
  }
});

/** POST /setup/local — writes local & llm config */
router.post('/local', (req: Request, res: Response) => {
  try {
    const cfg = loadConfig();
    cfg.local = cfg.local || {};
    if ((req.body as any)['llm.provider']) {
      cfg.llm = cfg.llm || {};
      cfg.llm.provider = (req.body as any)['llm.provider'];
    }
    if ((req.body as any)['llm.baseUrl']) {
      cfg.providers = cfg.providers || {};
      cfg.providers.ollama = cfg.providers.ollama || {};
      cfg.providers.ollama.baseUrl = (req.body as any)['llm.baseUrl'];
    }
    if ((req.body as any).hostname) {
      cfg.hostname = (req.body as any).hostname;
    }
    saveConfig(cfg);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

/** POST /setup/policy — writes confirm/deny regex */
router.post('/policy', (req: Request, res: Response) => {
  try {
    const cfg = loadConfig();
    cfg.policy = cfg.policy || {};
    if ((req.body as any).confirmRegex) cfg.policy.confirmRegex = (req.body as any).confirmRegex;
    if ((req.body as any).denyRegex) cfg.policy.denyRegex = (req.body as any).denyRegex;
    saveConfig(cfg);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

/** POST /setup/ssh — writes/edits SSH host with llm overrides */
router.post('/ssh', (req: Request, res: Response) => {
  try {
    const body: any = req.body || {};
    const host = body.hostname || body.edit;
    if (!host) return res.status(400).json({ error: 'hostname required' });

    const cfg = loadConfig();
    cfg.servers = cfg.servers || {};
    cfg.servers[host] = {
      type: 'ssh',
      hostname: host,
      port: Number(body.port || 22),
      username: body.username || 'chatgpt',
      privateKeyPath: body.privateKeyPath || '',
      llm: {
        provider: body['llm.provider'],
        baseUrl: body['llm.baseUrl'],
      },
    };
    saveConfig(cfg);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

export default router;
