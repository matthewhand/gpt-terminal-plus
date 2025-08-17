import fs from 'fs';
import path from 'path';

export type ServerDescriptor = {
  key: string;
  label: string;
  protocol: 'local' | 'ssh' | 'ssm';
  hostname?: string;
  allowedTokens?: string[];
};

const CONFIG_PATH =
  process.env.SERVERS_CONFIG_PATH ||
  path.join(process.cwd(), 'config', 'servers.json');

function loadAll(): ServerDescriptor[] {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data as ServerDescriptor[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function listAllServers(): ServerDescriptor[] {
  return loadAll();
}

export function listServersForToken(token: string): ServerDescriptor[] {
  const all = loadAll();
  return all.filter(
    (s) => !s.allowedTokens || s.allowedTokens.length === 0 || s.allowedTokens.includes(token)
  );
}
