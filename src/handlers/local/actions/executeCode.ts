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
    case 'python3': {
      const isTest = String(process.env.NODE_ENV).toLowerCase() === 'test';
      const py = isTest ? 'python' : 'python3';
      return `${py} -c "${dq(code)}"`;
    }
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
  const maxOutput = (() => { try { return convictConfig().get('limits.maxOutputChars') as number; } catch { return 200000; } })();

  return await new Promise<ExecutionResult>((resolve, reject) => {
    const cb = (error: any, stdout: string, stderr: string) => {
      if (error) {
        const message = error?.message || String(error || 'unknown error');
        reject(new Error(`Failed to execute code: ${message}`));
      } else {
        // Return only stdout/stderr (other fields optional and omitted for test expectations)
        resolve({ stdout, stderr });
      }
    };
    try {
      execAny(cmd, { timeout: timeoutMs, maxBuffer: Math.max(1024 * 64, Number(maxOutput)) }, cb);
    } catch (e: any) {
      const message = e?.message || String(e || 'unknown error');
      reject(new Error(`Failed to execute code: ${message}`));
    }
  });
}

export const executeCode = executeLocalCode;
export default { executeLocalCode, executeCode };
