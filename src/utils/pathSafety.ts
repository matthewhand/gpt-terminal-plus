import path from 'path';

/**
 * Root directory that local file operations are confined to.
 * Defaults to the process working directory; override with FILE_OPS_ROOT.
 */
export function getWorkingRoot(): string {
  const envRoot = process.env.FILE_OPS_ROOT;
  const root = envRoot && envRoot.trim() !== '' ? envRoot : process.cwd();
  return path.resolve(root);
}

/**
 * Resolves a requested path against the working root and rejects traversal
 * outside of it.
 *
 * @returns The resolved absolute path, or null when the path is empty or the
 *          resolved path escapes the working root.
 */
export function resolveSafePath(requested: string, root: string = getWorkingRoot()): string | null {
  if (typeof requested !== 'string' || requested.trim() === '') {
    return null;
  }
  const normalizedRoot = path.resolve(root);
  const resolved = path.resolve(normalizedRoot, requested);
  if (resolved === normalizedRoot || resolved.startsWith(normalizedRoot + path.sep)) {
    return resolved;
  }
  return null;
}

/**
 * Checks whether a (possibly relative) path climbs above its starting
 * directory after normalization (e.g. "../../etc"). Used for remote targets
 * where we cannot resolve against the local filesystem but still want to
 * reject obvious traversal attempts.
 */
export function escapesRelativeRoot(requested: string): boolean {
  if (typeof requested !== 'string' || requested.trim() === '') {
    return true;
  }
  const normalized = path.posix.normalize(requested.replace(/\\/g, '/'));
  return normalized === '..' || normalized.startsWith('../');
}
