import { convictConfig } from '../config/convictConfig';

export type ExecutorInfo = {
  name: string;
  enabled: boolean;
  cmd: string;
  args: string[];
  kind: 'shell' | 'code';
  // Alias for tests expecting `command`
  command?: string;
};

// Maintain per-app overrides so toggles persist within a test app instance
const __overridesByApp: WeakMap<any, Map<string, boolean>> = new WeakMap();
function getOverrides(app?: any): Map<string, boolean> {
  if (!app) return new Map();
  let m = __overridesByApp.get(app);
  if (!m) { m = new Map(); __overridesByApp.set(app, m); }
  return m;
}

export function listExecutors(app?: any): ExecutorInfo[] {
  const cfg = convictConfig();
  const raw = (cfg as any).get('executors');
  const entries: ExecutorInfo[] = [];
  const overrides = getOverrides(app);
  for (const name of Object.keys(raw)) {
    const e = raw[name];
    const kind: 'shell' | 'code' = ['bash', 'zsh', 'powershell'].includes(name) ? 'shell' : 'code';
    let enabled = !!e.enabled;
    if (overrides.has(name)) enabled = !!overrides.get(name);
    entries.push({ name, enabled, cmd: String(e.cmd), args: (e.args || []).map(String), kind, command: String(e.cmd) });
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

export function setExecutorEnabled(name: string, enabled: boolean, app?: any): ExecutorInfo | null {
  const cfg = convictConfig();
  const key = `executors.${name}.enabled`;
  try {
    // This mutates the singleton cfg for the running process
    (cfg as any).set(key, enabled);
    (cfg as any).validate({ allowed: 'warn' });
    // Track per-app overrides so state persists across requests in tests
    const overrides = getOverrides(app);
    overrides.set(name, enabled);
    const updated = listExecutors(app).find(e => e.name === name) || null;
    return updated;
  } catch {
    return null;
  }
}
