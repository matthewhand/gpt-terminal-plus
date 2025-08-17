import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const CONFIG_DIR = process.env.NODE_CONFIG_DIR || 'config';
const ENV = process.env.NODE_ENV || 'development';
const TARGET = path.join(CONFIG_DIR, `${ENV}.json`);

function loadConfig(): any {
  try { return JSON.parse(fs.readFileSync(TARGET, 'utf8')); } catch { return {}; }
}
function saveConfig(obj: any) {
  fs.mkdirSync(path.dirname(TARGET), { recursive: true });
  fs.writeFileSync(TARGET, JSON.stringify(obj, null, 2));
}

/** UI pages expected by tests */
router.get('/', (_req: Request, res: Response) => {
  const html = [
    '<!doctype html>',
    '<html>',
    '  <body>',
    '    <h1>Setup UI</h1>',
    '    <section id="llm">',
    '      <h2>LLM Settings</h2>',
    '      <label><input type="checkbox" id="llm-enabled"> Enable LLM</label><br/>',
    '      <label>Provider:',
    '        <select id="llm-provider">',
    '          <option value="">None</option>',
    '          <option value="openai">OpenAI</option>',
    '          <option value="litellm">LiteLLM</option>',
    '          <option value="ollama">Ollama</option>',
    '          <option value="lmstudio">LM Studio</option>',
    '        </select>',
    '      </label>',
    '      <div id="llm-fields"></div>',
    '      <button id="llm-test" type="button">Test</button>',
    '      <span id="llm-test-result"></span>',
    '      <button id="llm-save" type="button">Save</button>',
    '    </section>',
    '    <script>',
    '      async function load() {',
    "        const res = await fetch('/settings');",
    '        const json = await res.json();',
    '        const llm = json.llm || {};',
    "        document.getElementById('llm-enabled').checked = !!llm.enabled;",
    "        document.getElementById('llm-provider').value = llm.provider || '';",
    '        renderFields();',
    "        if (llm.provider === 'openai' || llm.provider === 'litellm') {",
    "          document.getElementById('baseURL').value = llm.baseURL || '';",
    "          document.getElementById('apiKey').value = '';",
    "          document.getElementById('defaultModel').value = llm.defaultModel || '';",
    '        } else if (llm.provider === \"ollama\") {',
    "          document.getElementById('ollamaURL').value = llm.ollamaURL || '';",
    "          document.getElementById('defaultModel').value = llm.defaultModel || '';",
    '        } else if (llm.provider === \"lmstudio\") {',
    "          document.getElementById('lmstudioURL').value = llm.lmstudioURL || '';",
    "          document.getElementById('defaultModel').value = llm.defaultModel || '';",
    '        }',
    '      }',
    '',
    '      function renderFields() {',
    "        const provider = document.getElementById('llm-provider').value;",
    "        const wrap = document.getElementById('llm-fields');",
    "        if (!provider) { wrap.innerHTML = ''; return; }",
    "        if (provider === 'openai' || provider === 'litellm') {",
    "          wrap.innerHTML = 'Base URL: <input id=\"baseURL\"/><br/>API Key: <input id=\"apiKey\" type=\"password\"/><br/>Default Model: <input id=\"defaultModel\"/>';",
    "        } else if (provider === 'ollama') {",
    "          wrap.innerHTML = 'Ollama URL: <input id=\"ollamaURL\"/><br/>Default Model: <input id=\"defaultModel\"/>';",
    "        } else if (provider === 'lmstudio') {",
    "          wrap.innerHTML = 'LM Studio URL: <input id=\"lmstudioURL\"/><br/>Default Model: <input id=\"defaultModel\"/>';",
    '        } else {',
    "          wrap.innerHTML = '';",
    '        }',
    '      }',
    '',
    '      function gather() {',
    "        const provider = document.getElementById('llm-provider').value;",
    "        const enabled = document.getElementById('llm-enabled').checked;",
    '        const cfg = { enabled, provider };',
    "        if (provider === 'openai' || provider === 'litellm') {",
    "          cfg.baseURL = document.getElementById('baseURL').value;",
    "          const key = document.getElementById('apiKey').value;",
    '          if (key) cfg.apiKey = key;',
    "          cfg.defaultModel = document.getElementById('defaultModel').value;",
    "        } else if (provider === 'ollama') {",
    "          cfg.ollamaURL = document.getElementById('ollamaURL').value;",
    "          cfg.defaultModel = document.getElementById('defaultModel').value;",
    "        } else if (provider === 'lmstudio') {",
    "          cfg.lmstudioURL = document.getElementById('lmstudioURL').value;",
    "          cfg.defaultModel = document.getElementById('defaultModel').value;",
    '        }',
    '        return cfg;',
    '      }',
    '',
    "      document.getElementById('llm-provider').addEventListener('change', renderFields);",
    "      document.getElementById('llm-test').addEventListener('click', async () => {",
    '        const cfg = gather();',
    "        const res = await fetch('/settings/llm/test', {",
    "          method: 'POST',",
    "          headers: { 'Content-Type': 'application/json' },",
    '          body: JSON.stringify(cfg)',
    '        });',
    '        const json = await res.json();',
    "        document.getElementById('llm-test-result').textContent = json.ok ? '✅' : '❌ ' + (json.details || 'failed');",
    '      });',
    "      document.getElementById('llm-save').addEventListener('click', async () => {",
    '        const cfg = gather();',
    "        await fetch('/settings', {",
    "          method: 'PUT',",
    "          headers: { 'Content-Type': 'application/json' },",
    "          body: JSON.stringify({ llm: cfg })",
    '        });',
    '      });',
    '',
    '      load();',
    '    </script>',
    '  </body>',
    '</html>'
  ].join('\n');
  res.status(200).send(html);
});

router.get('/policy', (_req: Request, res: Response) => {
  res.status(200).send('<!doctype html><html><body><h2>Safety Policy</h2></body></html>');
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

