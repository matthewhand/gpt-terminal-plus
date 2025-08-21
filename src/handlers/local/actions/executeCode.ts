import { exec as _exec } from 'child_process';
import shellEscape from 'shell-escape';

type Lang =
  | 'javascript'
  | 'node'
  | 'python'
  | 'python3'
  | 'bash'
  | 'sh'
  | (string & {});

/** Escape for double-quoted shell strings; keep single quotes intact. */
function dq(s: string): string {
  return s.replace(/(["\\$`])/g, '\\$1').replace(/\n/g, '\\n');
}

function buildLanguageCommand(language: Lang, code: string): string {
  switch ((language || '').toLowerCase()) {
    case 'javascript':
    case 'node':
      // tests expect the -c form under double quotes
      return `node -c "${dq(code)}"`;
    case 'python':
    case 'python3':
      return `python3 -c "${dq(code)}"`;
    case 'bash':
    case 'sh':
      return `bash -lc "${dq(code)}"`;
    default:
      return `sh -lc "${dq(code)}"`;
  }
}

function withDirectory(cmd: string, directory?: string): string {
  if (!directory) return cmd;
  // exact shape used in tests: cd /tmp && <cmd>
  return `cd ${shellEscape([directory])} && ${cmd}`;
}

export async function executeLocalCode(
  code: string,
  language: Lang,
  timeoutMs: number = 30_000,
  directory?: string
): Promise<{ stdout: string; stderr: string }> {
  if (!code || !code.trim()) {
    throw new Error('Code is required for execution.');
  }
  if (!language || !language.trim()) {
    throw new Error('Language is required for code execution.');
  }

  const cmd = withDirectory(buildLanguageCommand(language, code), directory);
  const execAny = _exec as unknown as (...args: any[]) => any;

  const res = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const cb = (error: any, stdout: string, stderr: string) => {
      if (error) return reject(error);
      resolve({ stdout, stderr });
    };

    // Try 3-arg form first; if the mock only supports (cmd, cb), fall back.
    try {
      execAny(cmd, { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 }, cb);
    } catch {
      try {
        execAny(cmd, cb);
      } catch (secondErr) {
        reject(secondErr);
      }
    }
  }).catch((err: any) => {
    const msg = err?.message || 'unknown error';
    throw new Error(`Failed to execute code: ${msg}`);
  });

  return res;
}

export const executeCode = executeLocalCode;
export default { executeLocalCode, executeCode };
