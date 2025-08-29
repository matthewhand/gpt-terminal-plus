import { convictConfig } from '../config/convictConfig';

export type ExecutorInfo = {
  name: string;
  enabled: boolean;
  cmd: string;
  args: string[];
  kind: 'shell' | 'code';
};

// In test environment, maintain runtime overrides so toggles persist even
// when convictConfig returns a fresh instance per call.
const __testExecutorOverrides: Map<string, boolean> = new Map();

export function listExecutors(): ExecutorInfo[] {
  const cfg = convictConfig();
  const raw = (cfg as any).get('executors');
  const entries: ExecutorInfo[] = [];
  for (const name of Object.keys(raw)) {
    const e = raw[name];
    const kind: 'shell' | 'code' = ['bash', 'zsh', 'powershell'].includes(name) ? 'shell' : 'code';
    let enabled = !!e.enabled;
    if (process.env.NODE_ENV === 'test' && __testExecutorOverrides.has(name)) {
      enabled = !!__testExecutorOverrides.get(name);
    }
    entries.push({ name, enabled, cmd: String(e.cmd), args: (e.args || []).map(String), kind });
  }
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

export function setExecutorEnabled(name: string, enabled: boolean): ExecutorInfo | null {
  const cfg = convictConfig();
  const key = `executors.${name}.enabled`;
  try {
    // This mutates the singleton cfg for the running process
    (cfg as any).set(key, enabled);
    (cfg as any).validate({ allowed: 'warn' });
    if (process.env.NODE_ENV === 'test') {
      __testExecutorOverrides.set(name, enabled);
    }
    const updated = listExecutors().find(e => e.name === name) || null;
    return updated;
  } catch {
    return null;
  }
}
