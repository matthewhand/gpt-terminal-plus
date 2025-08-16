import fs from 'fs';
import path from 'path';

export function getConfigPaths() {
  const configDir = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, '..', '..', 'config');
  let filePath: string;
  if (process.env.NODE_ENV === 'test') {
    // keep test config under config/test/test.json if present
    const testDir = path.join(configDir, 'test');
    filePath = path.join(testDir, 'test.json');
  } else {
    filePath = path.join(configDir, 'production.json');
  }
  return { configDir, filePath };
}

export function loadRawConfig(): any {
  const { configDir, filePath } = getConfigPaths();
  try {
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export function saveRawConfig(obj: any): void {
  const { configDir, filePath } = getConfigPaths();
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
}

