import express, { Request, Response } from 'express';
import { loadRawConfig, saveRawConfig, getConfigPaths } from '../utils/configIO';

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
  </nav>
  <h2>Overview</h2>
  <pre>${JSON.stringify({ local, ssh, ssm, ai }, null, 2)}</pre>
  `));
});

router.get('/local', (_req, res) => {
  const cfg = loadRawConfig();
  const local = cfg.local || { hostname: 'localhost', code: true };
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
        <div><label>Provider<select name="llm.provider"><option></option><option>ollama</option><option>lmstudio</option><option>openai</option></select></label></div>
        <div><label>Base URL<input name="llm.baseUrl" placeholder="http://localhost:11434"/></label></div>
      </div>
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
  if (Object.keys(llm).length) cfg.local.llm = llm;
  saveRawConfig(cfg);
  res.redirect('/setup');
});

router.get('/ssh', (_req, res) => {
  res.send(html(`
    <h2>Add SSH Host</h2>
    <form method="post" action="/setup/ssh">
      <div class="row">
        <div><label>Hostname<input name="hostname" required/></label></div>
        <div><label>Port<input name="port" value="22"/></label></div>
      </div>
      <div class="row">
        <div><label>Username<input name="username" value="chatgpt"/></label></div>
        <div><label>Private Key Path<input name="privateKeyPath" value="/home/user/.ssh/id_rsa"/></label></div>
      </div>
      <h3>Per-Server LLM (optional)</h3>
      <div class="row">
        <div><label>Provider<select name="llm.provider"><option></option><option>ollama</option><option>lmstudio</option><option>openai</option></select></label></div>
        <div><label>Base URL<input name="llm.baseUrl" placeholder="http://host:11434"/></label></div>
      </div>
      <button type="submit">Add SSH Host</button>
    </form>
  `));
});

router.post('/ssh', (req, res) => {
  const cfg = loadRawConfig();
  cfg.ssh = cfg.ssh || { hosts: [] };
  const host: any = {
    protocol: 'ssh',
    hostname: req.body.hostname,
    port: Number(req.body.port) || 22,
    username: req.body.username || 'chatgpt',
    privateKeyPath: req.body.privateKeyPath || ''
  };
  const llm: any = {};
  if (req.body['llm.provider']) llm.provider = req.body['llm.provider'];
  if (req.body['llm.baseUrl']) llm.baseUrl = req.body['llm.baseUrl'];
  if (Object.keys(llm).length) host.llm = llm;
  cfg.ssh.hosts.push(host);
  saveRawConfig(cfg);
  res.redirect('/setup');
});

router.get('/ssm', (_req, res) => {
  res.send(html(`
    <h2>Add SSM Target</h2>
    <form method="post" action="/setup/ssm">
      <div class="row">
        <div><label>Instance ID<input name="instanceId" required/></label></div>
        <div><label>Region<input name="region" value="us-west-2"/></label></div>
      </div>
      <div><label>Hostname (label)<input name="hostname" placeholder="optional label"/></label></div>
      <h3>Per-Server LLM (optional)</h3>
      <div class="row">
        <div><label>Provider<select name="llm.provider"><option></option><option>ollama</option><option>lmstudio</option><option>openai</option></select></label></div>
        <div><label>Base URL<input name="llm.baseUrl" placeholder="http://host:11434"/></label></div>
      </div>
      <button type="submit">Add SSM Target</button>
    </form>
  `));
});

router.post('/ssm', (req, res) => {
  const cfg = loadRawConfig();
  cfg.ssm = cfg.ssm || { targets: [], region: req.body.region || 'us-west-2' };
  const target: any = {
    protocol: 'ssm',
    instanceId: req.body.instanceId,
    region: req.body.region || cfg.ssm.region,
    hostname: req.body.hostname || req.body.instanceId
  };
  const llm: any = {};
  if (req.body['llm.provider']) llm.provider = req.body['llm.provider'];
  if (req.body['llm.baseUrl']) llm.baseUrl = req.body['llm.baseUrl'];
  if (Object.keys(llm).length) target.llm = llm;
  cfg.ssm.targets.push(target);
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
  cfg.ai.providers.ollama = { ...(cfg.ai.providers.ollama || {}), baseUrl: req.body['ollama.baseUrl'] };
  cfg.ai.providers.lmstudio = { ...(cfg.ai.providers.lmstudio || {}), baseUrl: req.body['lmstudio.baseUrl'] };
  cfg.ai.providers.openai = { ...(cfg.ai.providers.openai || {}), baseUrl: req.body['openai.baseUrl'], apiKey: req.body['openai.apiKey'] };
  saveRawConfig(cfg);
  res.redirect('/setup');
});

export default router;

