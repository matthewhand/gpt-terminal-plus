import express, { Request, Response } from 'express';
import { loadRawConfig, saveRawConfig, getConfigPaths } from '../utils/configIO';
import http from 'http';
import https from 'https';

const router = express.Router();

function html(layout: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Setup</title>
  <style>body{font-family:sans-serif;max-width:900px;margin:20px auto;padding:0 12px}
  header{display:flex;gap:16px;align-items:center}
  nav a{margin-right:10px}
  form{margin:16px 0;padding:12px;border:1px solid #ddd;border-radius:8px}
  input,select,textarea{width:100%;padding:8px;margin:6px 0}
  code,pre{background:#f6f8fa;padding:6px;border-radius:6px}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .row>div{display:flex;flex-direction:column}
  .ok{color:green}.warn{color:#b36b00}.muted{color:#666}
  </style></head><body>${layout}</body></html>`;
}

router.get('/', (_req: Request, res: Response) => {
  const cfg = loadRawConfig();
  const { filePath } = getConfigPaths();
  const local = cfg.local || {};
  const ssh = (cfg.ssh && cfg.ssh.hosts) || [];
  const ssm = (cfg.ssm && cfg.ssm.targets) || [];
  const ai = cfg.ai || {};
  res.send(html(`
  <header><h1>Setup UI</h1><span class="muted">Config file: ${filePath}</span></header>
  <nav>
    <a href="/setup/local">Local</a>
    <a href="/setup/ssh">SSH</a>
    <a href="/setup/ssm">SSM</a>
    <a href="/setup/ai">AI Provider</a>
    <a href="/setup/health">Health Check</a>
  </nav>
  <h2>Overview</h2>
  <pre>${JSON.stringify({ local, ssh, ssm, ai }, null, 2)}</pre>
  `));
});

router.get('/local', (_req, res) => {
  const cfg = loadRawConfig();
  const local = cfg.local || { hostname: 'localhost', code: true };
  const llm = (local && local.llm) || {};
  res.send(html(`
    <h2>Local Endpoint</h2>
    <form method="post" action="/setup/local">
      <div class="row">
        <div><label>Hostname<input name="hostname" value="${local.hostname || 'localhost'}"/></label></div>
        <div><label>Enable Code Execution<select name="code"><option value="true" ${local.code!==false?'selected':''}>true</option><option value="false" ${local.code===false?'selected':''}>false</option></select></label></div>
      </div>
      <div><label>post-command<input name="postCommand" value="${local['post-command'] || ''}"/></label></div>
      <h3>Per-Server LLM (optional)</h3>
      <div class="row">
        <div><label>Provider<select name="llm.provider">
          <option ${!llm.provider?'selected':''}></option>
          <option ${llm.provider==='ollama'?'selected':''}>ollama</option>
          <option ${llm.provider==='lmstudio'?'selected':''}>lmstudio</option>
          <option ${llm.provider==='openai'?'selected':''}>openai</option>
        </select></label></div>
        <div><label>Base URL<input name="llm.baseUrl" placeholder="http://localhost:11434" value="${llm.baseUrl||''}"/></label></div>
      </div>
      <div><label>Model Map (JSON)<textarea name="llm.modelMap" rows="4" placeholder='{"gpt-oss:20b":"llama3.1:8b-instruct"}'>${llm.modelMap?JSON.stringify(llm.modelMap):''}</textarea></label></div>
      <button type="submit">Save Local</button>
    </form>
  `));
});

router.post('/local', (req, res) => {
  const cfg = loadRawConfig();
  cfg.local = cfg.local || {};
  cfg.local.hostname = req.body.hostname || 'localhost';
  cfg.local.code = String(req.body.code) === 'true';
  if (req.body.postCommand) cfg.local['post-command'] = req.body.postCommand;
  const llm: any = {};
  if (req.body['llm.provider']) llm.provider = req.body['llm.provider'];
  if (req.body['llm.baseUrl']) llm.baseUrl = req.body['llm.baseUrl'];
  if (req.body['llm.modelMap']) {
    try { llm.modelMap = JSON.parse(req.body['llm.modelMap']); } catch {}
  }
  if (Object.keys(llm).length) cfg.local.llm = llm;
  saveRawConfig(cfg);
  res.redirect('/setup');
});

router.get('/ssh', (req, res) => {
  const cfg = loadRawConfig();
  const edit = (req.query.edit as string) || '';
  const host = (cfg.ssh && cfg.ssh.hosts || []).find((h: any) => h.hostname === edit);
  const llm = (host && host.llm) || {};
  const isEdit = !!host;
  res.send(html(`
    <h2>${isEdit ? 'Edit SSH Host' : 'Add SSH Host'}</h2>
    <form method="post" action="/setup/ssh">
      ${isEdit ? `<input type="hidden" name="edit" value="${host.hostname}"/>` : ''}
      <div class="row">
        <div><label>Hostname<input name="hostname" ${isEdit?'readonly':''} value="${host?.hostname || ''}" ${isEdit?'':'required'} /></label></div>
        <div><label>Port<input name="port" value="${host?.port || 22}"/></label></div>
      </div>
      <div class="row">
        <div><label>Username<input name="username" value="${host?.username || 'chatgpt'}"/></label></div>
        <div><label>Private Key Path<input name="privateKeyPath" value="${host?.privateKeyPath || '/home/user/.ssh/id_rsa'}"/></label></div>
      </div>
      <h3>Per-Server LLM (optional)</h3>
      <div class="row">
        <div><label>Provider<select name="llm.provider">
          <option ${!llm.provider?'selected':''}></option>
          <option ${llm.provider==='ollama'?'selected':''}>ollama</option>
          <option ${llm.provider==='lmstudio'?'selected':''}>lmstudio</option>
          <option ${llm.provider==='openai'?'selected':''}>openai</option>
        </select></label></div>
        <div><label>Base URL<input name="llm.baseUrl" placeholder="http://host:11434" value="${llm.baseUrl||''}"/></label></div>
      </div>
      <div><label>Model Map (JSON)<textarea name="llm.modelMap" rows="4" placeholder='{"gpt-oss:20b":"llama3.1:8b-instruct"}'>${llm.modelMap?JSON.stringify(llm.modelMap):''}</textarea></label></div>
      <button type="submit">${isEdit ? 'Save SSH Host' : 'Add SSH Host'}</button>
    </form>
  `));
});

router.post('/ssh', (req, res) => {
  const cfg = loadRawConfig();
  cfg.ssh = cfg.ssh || { hosts: [] };
  const isEdit = !!req.body.edit;
  let host: any = {
    protocol: 'ssh',
    hostname: req.body.hostname,
    port: Number(req.body.port) || 22,
    username: req.body.username || 'chatgpt',
    privateKeyPath: req.body.privateKeyPath || ''
  };
  const llm: any = {};
  if (req.body['llm.provider']) llm.provider = req.body['llm.provider'];
  if (req.body['llm.baseUrl']) llm.baseUrl = req.body['llm.baseUrl'];
  if (req.body['llm.modelMap']) {
    try { llm.modelMap = JSON.parse(req.body['llm.modelMap']); } catch {}
  }
  if (Object.keys(llm).length) host.llm = llm;
  if (isEdit) {
    const i = cfg.ssh.hosts.findIndex((h: any) => h.hostname === req.body.edit);
    if (i >= 0) {
      cfg.ssh.hosts[i] = { ...cfg.ssh.hosts[i], ...host };
    } else {
      cfg.ssh.hosts.push(host);
    }
  } else {
    cfg.ssh.hosts.push(host);
  }
  saveRawConfig(cfg);
  res.redirect('/setup');
});

router.get('/ssm', (req, res) => {
  const cfg = loadRawConfig();
  const edit = (req.query.edit as string) || '';
  const target = (cfg.ssm && cfg.ssm.targets || []).find((t: any) => t.instanceId === edit);
  const llm = (target && target.llm) || {};
  const isEdit = !!target;
  res.send(html(`
    <h2>${isEdit ? 'Edit SSM Target' : 'Add SSM Target'}</h2>
    <form method="post" action="/setup/ssm">
      ${isEdit ? `<input type=hidden name="edit" value="${target.instanceId}"/>` : ''}
      <div class="row">
        <div><label>Instance ID<input name="instanceId" ${isEdit?'readonly':''} value="${target?.instanceId || ''}" ${isEdit?'':'required'} /></label></div>
        <div><label>Region<input name="region" value="${target?.region || 'us-west-2'}"/></label></div>
      </div>
      <div><label>Hostname (label)<input name="hostname" value="${target?.hostname || ''}" placeholder="optional label"/></label></div>
      <h3>Per-Server LLM (optional)</h3>
      <div class="row">
        <div><label>Provider<select name="llm.provider">
          <option ${!llm.provider?'selected':''}></option>
          <option ${llm.provider==='ollama'?'selected':''}>ollama</option>
          <option ${llm.provider==='lmstudio'?'selected':''}>lmstudio</option>
          <option ${llm.provider==='openai'?'selected':''}>openai</option>
        </select></label></div>
        <div><label>Base URL<input name="llm.baseUrl" placeholder="http://host:11434" value="${llm.baseUrl||''}"/></label></div>
      </div>
      <div><label>Model Map (JSON)<textarea name="llm.modelMap" rows="4" placeholder='{"gpt-oss:20b":"llama3.1:8b-instruct"}'>${llm.modelMap?JSON.stringify(llm.modelMap):''}</textarea></label></div>
      <button type="submit">${isEdit ? 'Save SSM Target' : 'Add SSM Target'}</button>
    </form>
  `));
});

router.post('/ssm', (req, res) => {
  const cfg = loadRawConfig();
  cfg.ssm = cfg.ssm || { targets: [], region: req.body.region || 'us-west-2' };
  const isEdit = !!req.body.edit;
  let target: any = {
    protocol: 'ssm',
    instanceId: req.body.instanceId,
    region: req.body.region || cfg.ssm.region,
    hostname: req.body.hostname || req.body.instanceId
  };
  const llm: any = {};
  if (req.body['llm.provider']) llm.provider = req.body['llm.provider'];
  if (req.body['llm.baseUrl']) llm.baseUrl = req.body['llm.baseUrl'];
  if (req.body['llm.modelMap']) {
    try { llm.modelMap = JSON.parse(req.body['llm.modelMap']); } catch {}
  }
  if (Object.keys(llm).length) target.llm = llm;
  if (isEdit) {
    const i = cfg.ssm.targets.findIndex((t: any) => t.instanceId === req.body.edit);
    if (i >= 0) cfg.ssm.targets[i] = { ...cfg.ssm.targets[i], ...target };
    else cfg.ssm.targets.push(target);
  } else {
    cfg.ssm.targets.push(target);
  }
  saveRawConfig(cfg);
  res.redirect('/setup');
});

router.get('/ai', (_req, res) => {
  const cfg = loadRawConfig();
  const ai = cfg.ai || { provider: 'ollama', providers: { ollama: { baseUrl: 'http://localhost:11434' } } };
  res.send(html(`
    <h2>Global AI Provider</h2>
    <form method="post" action="/setup/ai">
      <div><label>Provider<select name="provider"><option ${ai.provider==='ollama'?'selected':''}>ollama</option><option ${ai.provider==='lmstudio'?'selected':''}>lmstudio</option><option ${ai.provider==='openai'?'selected':''}>openai</option></select></label></div>
      <div class="row">
        <div><label>Ollama Base URL<input name="ollama.baseUrl" value="${ai.providers?.ollama?.baseUrl||''}"/></label></div>
        <div><label>LM Studio Base URL<input name="lmstudio.baseUrl" value="${ai.providers?.lmstudio?.baseUrl||''}"/></label></div>
      </div>
      <div class="row">
        <div><label>OpenAI Base URL<input name="openai.baseUrl" value="${ai.providers?.openai?.baseUrl||''}"/></label></div>
        <div><label>OpenAI API Key<input name="openai.apiKey" value="${ai.providers?.openai?.apiKey||''}"/></label></div>
      </div>
      <button type="submit">Save Provider</button>
    </form>
  `));
});

router.post('/ai', (req, res) => {
  const cfg = loadRawConfig();
  cfg.ai = cfg.ai || { provider: 'ollama', providers: {} };
  cfg.ai.provider = req.body.provider || cfg.ai.provider;
  cfg.ai.providers = cfg.ai.providers || {};
  cfg.ai.providers.ollama = { ...(cfg.ai.providers.ollama || {}), baseUrl: req.body['ollama.baseUrl'] } as any;
  cfg.ai.providers.lmstudio = { ...(cfg.ai.providers.lmstudio || {}), baseUrl: req.body['lmstudio.baseUrl'] } as any;
  cfg.ai.providers.openai = { ...(cfg.ai.providers.openai || {}), baseUrl: req.body['openai.baseUrl'], apiKey: req.body['openai.apiKey'] } as any;
  try { if (req.body['ollama.modelMap']) (cfg.ai.providers.ollama as any).modelMap = JSON.parse(req.body['ollama.modelMap']); } catch {}
  try { if (req.body['lmstudio.modelMap']) (cfg.ai.providers.lmstudio as any).modelMap = JSON.parse(req.body['lmstudio.modelMap']); } catch {}
  try { if (req.body['openai.modelMap']) (cfg.ai.providers.openai as any).modelMap = JSON.parse(req.body['openai.modelMap']); } catch {}
  saveRawConfig(cfg);
  res.redirect('/setup');
});

function fetchCompat(urlStr: string): Promise<{ ok: boolean; status: number; text: string }> {
  return new Promise((resolve) => {
    try {
      const u = new URL(urlStr);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.request(urlStr, { method: 'GET' }, (resp) => {
        const chunks: Buffer[] = [];
        resp.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
        resp.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({ ok: (resp.statusCode||0) >= 200 && (resp.statusCode||0) < 300, status: resp.statusCode||0, text });
        });
      });
      req.on('error', () => resolve({ ok: false, status: 0, text: 'connection error' }));
      req.end();
    } catch {
      resolve({ ok: false, status: 0, text: 'invalid url' });
    }
  });
}

router.get('/health', async (req, res) => {
  const provider = (req.query.provider as string) || '';
  const baseUrl = (req.query.baseUrl as string) || '';
  if (!provider || !baseUrl) {
    return res.send(html(`
      <h2>Health Check</h2>
      <form method="get" action="/setup/health">
        <div class="row">
          <div><label>Provider<select name="provider"><option>ollama</option></select></label></div>
          <div><label>Base URL<input name="baseUrl" placeholder="http://host:11434"/></label></div>
        </div>
        <button type="submit">Check</button>
      </form>
    `));
  }

  if (provider !== 'ollama') {
    return res.status(400).send(html(`<p class="warn">Only ollama health checks are supported here.</p>`));
  }
  const pingUrl = new URL('/api/tags', baseUrl).toString();
  const r = await fetchCompat(pingUrl);
  return res.send(html(`
    <h2>Health Check Result</h2>
    <p>Provider: <b>${provider}</b></p>
    <p>Base URL: <code>${baseUrl}</code></p>
    <p>Status: <b class="${r.ok?'ok':'warn'}">${r.status} ${r.ok?'OK':'FAIL'}</b></p>
    <pre>${r.text.substring(0, 1000)}</pre>
  `));
});

export default router;
