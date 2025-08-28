import { convictConfig } from '../config/convictConfig';

export type ExecutorInfo = {
  name: string;
  enabled: boolean;
  cmd: string;
  args: string[];
  kind: 'shell' | 'code';
};

export function listExecutors(): ExecutorInfo[] {
  const cfg = convictConfig();
  const raw = (cfg as any).get('executors');
  const entries: ExecutorInfo[] = [];
  for (const name of Object.keys(raw)) {
    const e = raw[name];
    const kind: 'shell' | 'code' = ['bash', 'zsh', 'powershell'].includes(name) ? 'shell' : 'code';
    entries.push({ name, enabled: !!e.enabled, cmd: String(e.cmd), args: (e.args || []).map(String), kind });
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
    const updated = listExecutors().find(e => e.name === name) || null;
    return updated;
  } catch {
    return null;
  }
}
