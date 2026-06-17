import fs from 'fs';
import path from 'path';
import { parse as yamlParse, stringify as yamlStringify } from 'yaml';

export type AssistOn = 'failed' | 'all';

export interface Profile {
  name: string;
  workingDir?: string;
  shell?: {
    default?: string;
    allowed?: string[];
  };
  code?: {
    languages?: string[];
  };
  file?: {
    enabled?: boolean;
    maxReadSize?: number;
    maxWriteSize?: number;
  };
  llm?: {
    engine?: string;
    model?: string;
    assist?: {
      enabled?: boolean;
      on?: AssistOn;
    };
  };
  session?: {
    enabled?: boolean;
    maxInputChars?: number;
    maxOutputChars?: number;
    maxDuration?: number;
    maxIdle?: number;
  };
}

export interface ProfilesFile {
  profiles: Profile[];
}

const DEFAULTS = {
  workingDir: '.',
  shellDefault: 'bash',
  llmEngine: 'ollama',
  llmModel: 'gpt-oss:20b',
  assist: {
    enabled: false,
    on: 'failed' as AssistOn
  },
  session: {
    enabled: true,
    maxInputChars: 1_000_000,
    maxOutputChars: 2_000_000
  }
};

const CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.resolve(__dirname, '..', '..', 'config');
const PRIMARY_PATH = path.join(CONFIG_DIR, 'profiles.yaml');
const FALLBACK_SIMPLE_PATH = path.join(CONFIG_DIR, 'profiles.simple.yaml');
const FALLBACK_EXAMPLE_PATH = path.join(CONFIG_DIR, 'profiles.example.yaml');

function readYamlIfExists(filePath: string): unknown | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return null;
    return yamlParse(raw);
  } catch {
    return null;
  }
}

function coerceToProfilesFile(obj: unknown): ProfilesFile | null {
  if (!obj || typeof obj !== 'object') return null;
  const anyObj: any = obj;
  if (Array.isArray(anyObj)) {
    // tolerate legacy format: top-level array of profiles
    return { profiles: anyObj as Profile[] };
  }
  if ('profiles' in anyObj && Array.isArray((anyObj as any).profiles)) {
    return { profiles: (anyObj as any).profiles as Profile[] };
  }
  return null;
}

function normalizeProfile(p: any): Profile | null {
  if (!p || typeof p !== 'object') return null;
  if (!p.name || typeof p.name !== 'string' || !p.name.trim()) return null;

  const name = p.name.trim();

  const workingDir = (p.workingDir ?? DEFAULTS.workingDir) as string;

  const shell = {
    default: (p.shell?.default ?? DEFAULTS.shellDefault) as string,
    allowed: Array.isArray(p.shell?.allowed) ? p.shell.allowed.slice() as string[] : p.shell?.allowed ?? undefined
  };

  const code = {
    languages: Array.isArray(p.code?.languages) ? p.code.languages.slice() as string[] : p.code?.languages ?? undefined
  };

  const file = {
    enabled: p.file?.enabled ?? p.file?.enabled ?? undefined,
    maxReadSize: typeof p.file?.maxReadSize === 'number' ? p.file.maxReadSize : p.file?.maxReadSize ?? undefined,
    maxWriteSize: typeof p.file?.maxWriteSize === 'number' ? p.file.maxWriteSize : p.file?.maxWriteSize ?? undefined
  };

  const llm = {
    engine: (p.llm?.engine ?? DEFAULTS.llmEngine) as string,
    model: (p.llm?.model ?? DEFAULTS.llmModel) as string,
    assist: {
      enabled: p.llm?.assist?.enabled ?? DEFAULTS.assist.enabled,
      on: (p.llm?.assist?.on ?? DEFAULTS.assist.on) as AssistOn
    }
  };

  const session = {
    enabled: p.session?.enabled ?? DEFAULTS.session.enabled,
    maxInputChars: typeof p.session?.maxInputChars === 'number' ? p.session.maxInputChars : DEFAULTS.session.maxInputChars,
    maxOutputChars: typeof p.session?.maxOutputChars === 'number' ? p.session.maxOutputChars : DEFAULTS.session.maxOutputChars,
    maxDuration: typeof p.session?.maxDuration === 'number' ? p.session.maxDuration : p.session?.maxDuration ?? undefined,
    maxIdle: typeof p.session?.maxIdle === 'number' ? p.session.maxIdle : p.session?.maxIdle ?? undefined
  };

  const profile: Profile = { name, workingDir, shell, code, file, llm, session };

  return profile;
}

function normalizeProfilesFile(data: ProfilesFile | null): ProfilesFile {
  const input = data?.profiles ?? [];
  const out: Profile[] = [];
  for (const p of input) {
    const np = normalizeProfile(p);
    if (np) out.push(np);
  }
  return { profiles: out };
}

/**
 * Load profiles.yaml (or fallbacks) from config directory and normalize with defaults.
 */
export function loadProfilesConfig(): ProfilesFile {
  const candidates = [PRIMARY_PATH, FALLBACK_SIMPLE_PATH, FALLBACK_EXAMPLE_PATH];
  let parsed: ProfilesFile | null = null;

  for (const fp of candidates) {
    const doc = readYamlIfExists(fp);
    if (!doc) continue;
    const coerced = coerceToProfilesFile(doc);
    if (coerced) {
      parsed = coerced;
      break;
    }
  }

  const normalized = normalizeProfilesFile(parsed);
  return normalized;
}

/**
 * Save the provided profiles to profiles.yaml in the config directory.
 */
export function saveProfilesConfig(config: ProfilesFile, targetPath: string = PRIMARY_PATH): void {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const normalized = normalizeProfilesFile(config);
  const yaml = yamlStringify(normalized, { indent: 2 });
  fs.writeFileSync(targetPath, yaml, 'utf8');
}

/**
 * Get active profile name based on provided override, environment variable, or first profile.
 */
export function getActiveProfileName(preferredName?: string): string {
  const cfg = loadProfilesConfig();
  if (preferredName && cfg.profiles.some(p => p.name === preferredName)) return preferredName;
  const envName = process.env.ACTIVE_PROFILE;
  if (envName && cfg.profiles.some(p => p.name === envName)) return envName;
  return cfg.profiles[0]?.name ?? '';
}

/**
 * Resolve the active profile object; falls back to the first profile or null when none exist.
 */
export function getActiveProfile(preferredName?: string): Profile | null {
  const cfg = loadProfilesConfig();
  const name = getActiveProfileName(preferredName);
  if (!name) return cfg.profiles[0] ?? null;
  return cfg.profiles.find(p => p.name === name) ?? cfg.profiles[0] ?? null;
}

/**
 * Upsert (create or replace) a profile by name and persist to disk (profiles.yaml).
 */
export function upsertProfile(profile: Profile): ProfilesFile {
  const current = loadProfilesConfig();
  const normalized = normalizeProfile(profile);
  if (!normalized) {
    throw new Error('Invalid profile payload');
  }
  const idx = current.profiles.findIndex(p => p.name === normalized.name);
  if (idx >= 0) {
    current.profiles[idx] = normalized;
  } else {
    current.profiles.push(normalized);
  }
  saveProfilesConfig(current);
  return current;
}

/**
 * Delete a profile by name and persist to disk.
 */
export function deleteProfile(name: string): ProfilesFile {
  const current = loadProfilesConfig();
  const next = { profiles: current.profiles.filter(p => p.name !== name) };
  saveProfilesConfig(next);
  return next;
}

/**
 * Export current normalized profiles as YAML string.
 */
export function exportProfilesYaml(): string {
  const cfg = loadProfilesConfig();
  return yamlStringify(cfg, { indent: 2 });
}

/**
 * Import profiles from YAML string and persist to disk (overwrites).
 */
export function importProfilesYaml(yaml: string): ProfilesFile {
  const doc = yamlParse(yaml);
  const coerced = coerceToProfilesFile(doc);
  const normalized = normalizeProfilesFile(coerced);
  saveProfilesConfig(normalized);
  return normalized;
}