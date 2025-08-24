import fs from 'fs/promises';
import path from 'path';
import { convictConfig } from '../config/convictConfig';

export interface FileOperation {
  type: 'read' | 'write' | 'delete' | 'list' | 'mkdir';
  path: string;
  content?: string;
  recursive?: boolean;
}

export async function executeFileOperation(op: FileOperation): Promise<any> {
  // Validate operation type early to surface clear errors regardless of config mocking
  const validTypes = new Set(['read', 'write', 'delete', 'list', 'mkdir']);
  if (!validTypes.has(op.type)) {
    throw new Error(`Unknown file operation: ${op.type}`);
  }

  // Read allowed paths safely; fall back to CWD if schema key not present or config mocked
  let allowedPaths: string[] = [process.cwd()];
  try {
    const cfg = convictConfig();
    const fromCfg = (cfg as any)?.get?.('fileOps.allowedPaths');
    if (Array.isArray(fromCfg) && fromCfg.length > 0) {
      allowedPaths = fromCfg as string[];
    }
  } catch {
    // ignore and use default
  }
  
  // Security check
  const resolvedPath = path.resolve(op.path);
  const isAllowed = allowedPaths.some((allowed: string) => 
    resolvedPath.startsWith(path.resolve(allowed))
  );
  
  if (!isAllowed) {
    throw new Error(`Path not allowed: ${op.path}`);
  }
  
  switch (op.type) {
    case 'read':
      return await fs.readFile(resolvedPath, 'utf8');
    
    case 'write':
      if (!op.content) throw new Error('Content required for write operation');
      await fs.writeFile(resolvedPath, op.content);
      return { success: true };
    
    case 'delete':
      await fs.unlink(resolvedPath);
      return { success: true };
    
    case 'list':
      const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
      return entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        path: path.join(resolvedPath, entry.name),
      }));
    
    case 'mkdir':
      await fs.mkdir(resolvedPath, { recursive: op.recursive });
      return { success: true };
    
    default:
      throw new Error(`Unknown file operation: ${op.type}`);
  }
}
