import { exec as _exec } from 'child_process';
import shellEscape from 'shell-escape';
import { ExecutionResult } from '../../../types/ExecutionResult';
import { convictConfig } from '../../../config/convictConfig';
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
  return s.replace(/(["\\`$])/g, '\\$1').replace(/\n/g, '\\n');
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
): Promise<ExecutionResult> { // Changed return type to ExecutionResult
  if (!code || !code.trim()) {
    throw new Error('Code is required for execution.');
  }
  if (!language || !language.trim()) {
    throw new Error('Language is required for code execution.');
  }

  const cmd = withDirectory(buildLanguageCommand(language, code), directory);
  debug(`👉 Executing local code: ${cmd}`);

  const execAny = _exec as unknown as (...args: any[]) => any;
  const maxOutput = (() => { try { return convictConfig().get('limits.maxOutputChars') as number; } catch { return 200000; } })();

  const res = await new Promise<ExecutionResult>((resolve, reject) => { // Changed Promise type to ExecutionResult
    const cb = (error: any, stdout: string, stderr: string) => {
      if (error) {
        // Handle maxBuffer exceeded specifically
        if (/maxBuffer/i.test(String(error?.message || ''))) {
          const exitCode = typeof error?.code === 'number' ? error.code : 1;
          resolve({ stdout, stderr, exitCode, success: false, error: true, truncated: true, terminated: true });
        } else {
          reject(error);
        }
      } else {
        resolve({ stdout, stderr, exitCode: 0, success: true, error: false }); // Added exitCode, success, error
      }
    };

    try {
      execAny(cmd, { timeout: timeoutMs, maxBuffer: Math.max(1024 * 64, Number(maxOutput)) }, cb);
    } catch (secondErr) {
      reject(secondErr);
    }
  }).catch((err: any) => {
    const msg = err?.message || 'unknown error';
    return { stdout: '', stderr: msg, exitCode: 1, success: false, error: true }; // Changed to return ExecutionResult
  });

  return res;
}

export const executeCode = executeLocalCode;
export default { executeLocalCode, executeCode };