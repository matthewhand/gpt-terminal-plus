import path from 'path';

/**
 * Root directory that local file operations (read/amend/update/changeDirectory)
 * are confined to.
 *
 * Defaults to the project root (safe). Set the `FILE_OPS_ROOT` env var to widen
 * access:
 *   - `FILE_OPS_ROOT=/`              → the whole filesystem (subject to OS perms)
 *   - `FILE_OPS_ROOT=/home/chatgpt`  → scope to a specific directory tree
 *
 * The app runs as an unprivileged user, so access is always bounded by that
 * user's filesystem permissions.
 */
export function getFileOpsRoot(): string {
  const env = process.env.FILE_OPS_ROOT;
  if (env && env.trim()) return path.resolve(env.trim());
  // This file lives at src/utils (dist/utils); the project root is two levels up.
  return path.resolve(__dirname, '..', '..');
}
