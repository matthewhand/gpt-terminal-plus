import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import Debug from 'debug';
import { getServerHandler } from '../../utils/getServerHandler';
import { handleServerError } from '../../utils/handleServerError';

const debug = Debug('app:file:applyPatch');

function execGit(args: string[], cwd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    execFile('git', args, { cwd }, (error, stdout, stderr) => {
      const code = (error as any)?.code ?? 0;
      resolve({ code, stdout: stdout?.toString() ?? '', stderr: stderr?.toString() ?? '' });
    });
  });
}

function ensureTrailingNewline(s: string): string {
  return s.endsWith('\n') ? s : (s + '\n');
}

function buildFullFileUnifiedDiff(relPath: string, oldContent: string, newContent: string): string {
  const oldLines = ensureTrailingNewline(oldContent).split(/\r?\n/);
  const newLines = ensureTrailingNewline(newContent).split(/\r?\n/);
  // drop final empty string that results from split on trailing newline
  if (oldLines.length && oldLines[oldLines.length - 1] === '') oldLines.pop();
  if (newLines.length && newLines[newLines.length - 1] === '') newLines.pop();

  const header = `--- a/${relPath}\n+++ b/${relPath}\n@@ -1,${oldLines.length} +1,${newLines.length} @@\n`;
  const minus = oldLines.map((l) => `-${l}\n`).join('');
  const plus = newLines.map((l) => `+${l}\n`).join('');
  return header + minus + plus;
}

export async function applyPatch(req: Request, res: Response): Promise<Response> {
  try {
    const { filePath, replace, search, oldText, all = false, startLine, endLine, dryRun = false, whitespaceNowarn = true } = (req.body || {}) as {
      filePath?: string;
      replace?: string;
      search?: string;
      oldText?: string;
      all?: boolean;
      startLine?: number;
      endLine?: number;
      dryRun?: boolean;
      whitespaceNowarn?: boolean;
    };

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ message: 'filePath is required' });
    }
    if (typeof replace !== 'string') {
      return res.status(400).json({ message: 'replace must be a string' });
    }
    if (!search && !oldText) {
      return res.status(400).json({ message: 'Either search or oldText must be provided' });
    }
    if ((startLine !== undefined && (!Number.isInteger(startLine) || startLine <= 0)) ||
        (endLine !== undefined && (!Number.isInteger(endLine) || endLine <= 0))) {
      return res.status(400).json({ message: 'startLine/endLine must be positive integers when provided' });
    }
    if (startLine !== undefined && endLine !== undefined && endLine < startLine) {
      return res.status(400).json({ message: 'endLine must be >= startLine' });
    }

    const server = getServerHandler(req);
    const handlerName = (server as any)?.constructor?.name || 'UnknownHandler';
    if (handlerName !== 'LocalServerHandler') {
      return res.status(501).json({ message: 'applyPatch currently supported only for local server handler' });
    }

    const cwd = await server.presentWorkingDirectory();
    const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
    const relPath = path.relative(cwd, absPath);
    if (relPath.startsWith('..') || path.isAbsolute(relPath)) {
      return res.status(400).json({ message: 'filePath must be within the working directory' });
    }

    const original = await fs.readFile(absPath, 'utf8');

    let next = original;
    if (typeof oldText === 'string') {
      const idx = next.indexOf(oldText);
      if (idx === -1) {
        return res.status(400).json({ message: 'oldText not found in file' });
      }
      next = next.replace(oldText, replace);
    } else if (typeof search === 'string') {
      if (startLine !== undefined || endLine !== undefined) {
        const lines = next.split(/\r?\n/);
        const start = (startLine ?? 1) - 1;
        const end = (endLine ?? lines.length) - 1;
        const before = lines.slice(0, Math.max(0, start));
        const target = lines.slice(Math.max(0, start), Math.min(lines.length, end + 1)).join('\n');
        const after = lines.slice(Math.min(lines.length, end + 1));
        const replaced = all ? target.split(search).join(replace) : target.replace(search, replace);
        next = [...before, replaced, ...after].join('\n');
      } else {
        next = all ? next.split(search).join(replace) : next.replace(search, replace);
      }
    }

    if (next === original) {
      return res.status(400).json({ message: 'No changes computed for the provided patch request' });
    }

    const diffText = buildFullFileUnifiedDiff(relPath, original, next);

    // write diff to a temp file
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gpt-tp-'));
    const patchPath = path.join(tmpDir, 'update.patch');
    await fs.writeFile(patchPath, diffText, 'utf8');

    debug('Validating patch with git apply --check');
    const checkArgs = ['apply', '--check'];
    if (whitespaceNowarn) checkArgs.push('--whitespace=nowarn');
    checkArgs.push(patchPath);
    const checkRes = await execGit(checkArgs, cwd);
    if (checkRes.code !== 0) {
      return res.status(400).json({ success: false, message: 'Patch validation failed', stderr: checkRes.stderr });
    }

    if (dryRun) {
      return res.status(200).json({ success: true, validatedOnly: true, filesPatched: [relPath] });
    }

    debug('Applying patch with git apply');
    const applyArgs = ['apply'];
    if (whitespaceNowarn) applyArgs.push('--whitespace=nowarn');
    applyArgs.push(patchPath);
    const applyRes = await execGit(applyArgs, cwd);
    if (applyRes.code !== 0) {
      return res.status(500).json({ success: false, message: 'git apply failed', stderr: applyRes.stderr });
    }
    return res.status(200).json({ success: true, filesPatched: [relPath], warnings: applyRes.stderr ? String(applyRes.stderr) : undefined });
  } catch (error) {
    handleServerError(error, res, 'Error applying structured patch');
    return res;
  }
}
