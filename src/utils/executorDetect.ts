import { spawnSync } from 'child_process';
import os from 'os';

type Detected = { available: boolean; cmd?: string };
type DetectMap = Record<string, Detected>;

function whichPosix(cmd: string): string | null {
  try {
    const out = spawnSync('sh', ['-lc', `command -v ${cmd} || which ${cmd}`], { encoding: 'utf8' });
    if (out.status === 0) {
      const path = String(out.stdout || '').trim();
      return path || cmd;
    }
  } catch {}
  return null;
}

function whereWin(cmd: string): string | null {
  try {
    const out = spawnSync('where', [cmd], { encoding: 'utf8' });
    if (out.status === 0) {
      const path = String(out.stdout || '').split(/\r?\n/).filter(Boolean)[0];
      return path || cmd;
    }
  } catch {}
  return null;
}

export function detectSystemExecutors(): DetectMap {
  const isWin = os.platform().startsWith('win');
  const find = (cmd: string): string | null => isWin ? whereWin(cmd) : whichPosix(cmd);

  const candidates = [
    'bash', 'zsh', 'pwsh', 'powershell',
    'python3', 'python',
    'node', 'deno'
  ];

  const result: DetectMap = {};
  for (const name of candidates) {
    const found = find(name);
    result[name] = { available: !!found, cmd: found || undefined };
  }
  return result;
}

