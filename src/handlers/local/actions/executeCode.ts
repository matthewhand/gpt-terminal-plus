import { exec as _exec } from 'child_process';
import shellEscape from 'shell-escape';
import { ExecutionResult } from '../../../types/ExecutionResult';
import Debug from 'debug';

const debug = Debug('app:local:executeCode');

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
  return `cd ${shellEscape([directory])} && ${cmd}`;
}

export async function executeLocalCode(
  code: string,
  language: Lang,
  timeoutMs: number = 30_000,
  directory?: string
): Promise<ExecutionResult> {
  if (!code || !code.trim()) {
    throw new Error('Code is required for execution.');
  }
  if (!language || !language.trim()) {
    throw new Error('Language is required for code execution.');
  }

  const cmd = withDirectory(buildLanguageCommand(language, code), directory);
  debug(`👉 Executing local code: ${cmd}`);

  const execAny = _exec as unknown as (...args: any[]) => any;

  const res = await new Promise<ExecutionResult>((resolve, reject) => {
    const cb = (error: any, stdout: string, stderr: string) => {
      const exitCode = error?.code ?? 0;
      const success = exitCode === 0;
      resolve({ stdout, stderr, exitCode, success, error: !success });
    };

    try {
      execAny(cmd, { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 }, cb);
    } catch {
      try {
        execAny(cmd, cb);
      } catch (secondErr) {
        reject(secondErr);
      }
    }
  }).catch((err: any): ExecutionResult => {
    return {
      stdout: '',
      stderr: err?.message || 'unknown error',
      exitCode: err?.code ?? 1,
      success: false,
      error: true
    };
  });

  return res;
}

export const executeCode = executeLocalCode;
export default { executeLocalCode, executeCode };
