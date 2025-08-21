import fs from 'node:fs';
import path from 'node:path';
import { SettingsSchema, type Settings } from './schema';

const DEFAULTS: Settings = SettingsSchema.parse({});
const SETTINGS_FILE =
  process.env.GTP_SETTINGS_PATH ||
  path.resolve(process.cwd(), 'config', 'settings.json');

const IN_TEST = process.env.NODE_ENV === 'test';

let _settings: Settings = DEFAULTS;
let _loaded = false;
let _saveDebounce: NodeJS.Timeout | null = null;

function ensureLoaded() {
  if (_loaded) return;
  if (IN_TEST) {
    _settings = DEFAULTS;
    _loaded = true;
    return;
  }
  try {
    const text = fs.readFileSync(SETTINGS_FILE, 'utf8');
    const json = JSON.parse(text);
    _settings = SettingsSchema.parse(json);
  } catch {
    _settings = DEFAULTS;
    try {
      fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(_settings, null, 2), 'utf8');
    } catch {
      /* ignore */
    }
  } finally {
    _loaded = true;
  }
}

function scheduleSave() {
  if (IN_TEST) return;
  if (_saveDebounce) clearTimeout(_saveDebounce);
  _saveDebounce = setTimeout(() => {
    try {
      fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(_settings, null, 2), 'utf8');
    } catch {
      /* ignore */
    }
  }, 200);
}

export const SettingsStore = {
  get(): Settings {
    ensureLoaded();
    return JSON.parse(JSON.stringify(_settings));
  },

  set(partial: Partial<Settings>): Settings {
    ensureLoaded();
    const merged: Settings = SettingsSchema.parse({
      ..._settings,
      ...partial,
      features: partial.features
        ? {
            ..._settings.features,
            ...partial.features,
            executeShell: partial.features.executeShell
              ? { ..._settings.features.executeShell, ...partial.features.executeShell }
              : _settings.features.executeShell,
            executeCode: partial.features.executeCode
              ? { ..._settings.features.executeCode, ...partial.features.executeCode }
              : _settings.features.executeCode,
            executeLlm: partial.features.executeLlm
              ? { ..._settings.features.executeLlm, ...partial.features.executeLlm }
              : _settings.features.executeLlm,
          }
        : _settings.features,
      auth: partial.auth ? { ..._settings.auth, ...partial.auth } : _settings.auth,
      llm: partial.llm ? { ..._settings.llm, ...partial.llm } : _settings.llm,
    });
    _settings = merged;
    scheduleSave();
    return this.get();
  },

  replace(next: Settings): Settings {
    ensureLoaded();
    _settings = SettingsSchema.parse(next);
    scheduleSave();
    return this.get();
  },

  isEnabled(feature: 'executeShell' | 'executeCode' | 'executeLlm'): boolean {
    ensureLoaded();
    return Boolean(_settings.features[feature]?.enabled);
  },

  setEnabled(feature: 'executeShell' | 'executeCode' | 'executeLlm', enabled: boolean): Settings {
    ensureLoaded();
    return this.set({
      features: {
        ..._settings.features,
        [feature]: { ..._settings.features[feature], enabled },
      } as any,
    });
  },
};

export function getSettings(): Settings {
  return SettingsStore.get();
}
