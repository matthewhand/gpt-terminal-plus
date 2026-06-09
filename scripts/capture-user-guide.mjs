#!/usr/bin/env node
/**
 * Captures the WebUI user story as screenshots for docs/USER_GUIDE.md.
 *
 * Usage: npm run docs:screenshots
 *
 * Boots the server on a scratch port with a demo API token and seeded
 * mock activity data, then walks the pages a new user would visit.
 * Screenshots land in docs/screenshots/ (overwritten each run, commit them).
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = process.env.GUIDE_PORT || 5111;
const BASE = `http://127.0.0.1:${PORT}`;
const TOKEN = 'demo-token-for-screenshots';
const OUT = path.resolve('docs/screenshots');
const VIEWPORT = { width: 1280, height: 800 };

async function seedMockActivity() {
  const day = new Date().toISOString().slice(0, 10);
  const session = path.join('data', 'activity', day, 'session_demo');
  await fs.mkdir(session, { recursive: true });
  const write = (f, obj) =>
    fs.writeFile(path.join(session, f), JSON.stringify(obj, null, 2));
  await write('meta.json', {
    sessionId: 'session_demo',
    startedAt: new Date().toISOString(),
    user: 'demo-user',
    label: 'Demo: disk usage check',
    source: 'user-guide',
  });
  await write('01-executeShell.json', {
    timestamp: new Date().toISOString(),
    type: 'executeShell',
    command: 'df -h /',
    exitCode: 0,
    stdout: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       217G  175G   31G  86% /',
    stderr: '',
  });
  await write('02-executeLlm.json', {
    timestamp: new Date().toISOString(),
    type: 'executeLlm',
    instructions: 'check how much disk space is left',
    plan: 'df -h /',
    dryRun: false,
    exitCode: 0,
  });
  return session;
}

function startServer() {
  const child = spawn('npx', ['ts-node', 'src/index.ts'], {
    env: {
      ...process.env,
      PORT: String(PORT),
      API_TOKEN: TOKEN,
      NODE_ENV: 'development',
      AUTO_ANALYZE_ERRORS: 'false',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));
  return child;
}

async function waitForServer(timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not come up on :${PORT}`);
}

const shots = [];
async function snap(page, name, caption) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  shots.push({ name, caption });
  console.log(`captured ${file}`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const seeded = await seedMockActivity();
  console.log(`seeded mock activity at ${seeded}`);

  const server = startServer();
  try {
    await waitForServer();

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: VIEWPORT });

    // 1. Landing page — what you see after `npm start`
    await page.goto(`${BASE}/`);
    await page.waitForLoadState('networkidle');
    await snap(page, '01-landing', 'Landing page');

    // 2. Interactive API docs (Swagger UI from the generated OpenAPI spec)
    await page.goto(`${BASE}/docs/`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await snap(page, '02-api-docs', 'Interactive API docs');

    // 3. Dashboard — feature cards reflect enabled features
    await page.goto(`${BASE}/dashboard.html`);
    await page.waitForLoadState('networkidle');
    await snap(page, '03-dashboard', 'Dashboard');

    // 4. Execute a real command through the API (the GPT-action / agent path),
    //    so the activity console below has a genuine entry too.
    const exec = await fetch(`${BASE}/command/execute-shell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ command: 'echo "hello from gpt-terminal-plus"' }),
    });
    console.log(`execute-shell -> ${exec.status}`);

    // 5. Settings — paste token, load redacted config
    await page.goto(`${BASE}/settings.html`);
    await page.fill('#token', TOKEN);
    const loadBtn = page.locator('button', { hasText: /load|fetch|view/i }).first();
    if (await loadBtn.count()) await loadBtn.click();
    await page.waitForTimeout(1500);
    await snap(page, '04-settings', 'Redacted settings view');

    // 6. LLM console — seeded demo session visible in the sidebar
    await page.goto(`${BASE}/llm-console.html`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await snap(page, '05-llm-console', 'Activity / LLM console with demo session');

    await browser.close();
    console.log(`\n${shots.length} screenshots captured into docs/screenshots/`);
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
