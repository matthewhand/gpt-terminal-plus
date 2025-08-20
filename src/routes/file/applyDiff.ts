import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import Debug from 'debug';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:file:applyDiff');

function execGit(args: string[], cwd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    execFile('git', args, { cwd }, (error, stdout, stderr) => {
      const code = (error as any)?.code ?? 0;
      resolve({ code, stdout: stdout?.toString() ?? '', stderr: stderr?.toString() ?? '' });
    });
  });
}

function parseGitApplyOutput(stderr: string): { errors: string[]; warnings: string[]; rejects: { file: string; line?: number; reason?: string }[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rejects: { file: string; line?: number; reason?: string }[] = [];
  for (const raw of stderr.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (/^warning:/i.test(line)) {
      warnings.push(line.replace(/^warning:\s*/i, ''));
      continue;
    }
    if (/^error:/i.test(line) || /^fatal:/i.test(line)) {
      // error: patch failed: path/to/file:123
      const m = line.match(/patch failed:\s+([^:]+):(\d+)/i);
      if (m) {
        rejects.push({ file: m[1], line: Number(m[2]), reason: 'patch failed' });
      }
      errors.push(line.replace(/^(error|fatal):\s*/i, ''));
      continue;
    }
  }
  return { errors, warnings, rejects };
}

function parseFilesFromDiff(diffText: string): string[] {
  const files = new Set<string>();
  for (const line of diffText.split(/\r?\n/)) {
    if (line.startsWith('+++ ')) {
      const p = line.substring(4).trim();
      if (p !== '/dev/null') {
        // strip possible a/ or b/ prefixes
        const cleaned = p.replace(/^a\//, '').replace(/^b\//, '');
        files.add(cleaned);
      }
    }
  }
  return Array.from(files);
}

export async function applyDiff(req: Request, res: Response): Promise<Response> {
  try {
    const { diff, dryRun = false, whitespaceNowarn = true } = (req.body || {}) as { diff?: string; dryRun?: boolean; whitespaceNowarn?: boolean };

    if (typeof diff !== 'string' || !diff.trim()) {
      return res.status(400).json({ message: 'diff must be provided as non-empty string' });
    }

    const server = getServerHandler(req);
    // Only supported on local handler for now (no remote patch streaming implemented)
    const handlerName = (server as any)?.constructor?.name || 'UnknownHandler';
    if (handlerName !== 'LocalServerHandler') {
      return res.status(501).json({ message: 'applyDiff currently supported only for local server handler' });
    }

    const cwd = await server.presentWorkingDirectory();

    // Write diff to a temp file
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gpt-tp-'));
    const patchPath = path.join(tmpDir, 'update.patch');
    await fs.writeFile(patchPath, diff, 'utf8');

    debug('Validating patch with git apply --check');
    const checkArgs = ['apply', '--check'];
    if (whitespaceNowarn) checkArgs.push('--whitespace=nowarn');
    checkArgs.push(patchPath);
    const checkRes = await execGit(checkArgs, cwd);
    if (checkRes.code !== 0) {
      const parsed = parseGitApplyOutput(checkRes.stderr);
      debug('Patch validation failed:', checkRes.stderr);
      return res.status(400).json({ success: false, message: 'Patch validation failed', stderr: checkRes.stderr, ...parsed });
    }

    if (dryRun) {
      const filesPatched = parseFilesFromDiff(diff);
      return res.status(200).json({ success: true, validatedOnly: true, filesPatched });
    }

    debug('Applying patch with git apply');
    const applyArgs = ['apply'];
    if (whitespaceNowarn) applyArgs.push('--whitespace=nowarn');
    applyArgs.push(patchPath);
    const applyRes = await execGit(applyArgs, cwd);
    if (applyRes.code !== 0) {
      const parsed = parseGitApplyOutput(applyRes.stderr);
      debug('git apply failed:', applyRes.stderr);
      return res.status(500).json({ success: false, message: 'git apply failed', stderr: applyRes.stderr, ...parsed });
    }
    const filesPatched = parseFilesFromDiff(diff);
    const parsed = parseGitApplyOutput(applyRes.stderr);
    return res.status(200).json({ success: true, filesPatched, warnings: parsed.warnings, stderr: applyRes.stderr || undefined });
  } catch (error) {
    handleServerError(error, res, 'Error applying diff');
    return res;
  }
}
