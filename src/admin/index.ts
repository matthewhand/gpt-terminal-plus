import AdminJS from 'adminjs';
import * as AdminJSExpress from '@adminjs/express';
import { Application } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { SettingsSchema, Settings } from '../settings/schema';

// Simple file-based settings store
class SettingsStore {
  private settingsPath = path.join(process.cwd(), 'data', 'admin-settings.json');

  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(this.settingsPath);
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
  }

  getSettings(): Settings {
    try {
      if (existsSync(this.settingsPath)) {
        const data = JSON.parse(readFileSync(this.settingsPath, 'utf8'));
        return SettingsSchema.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load settings, using defaults:', error);
    }
    return SettingsSchema.parse({});
  }

  saveSettings(settings: Settings): void {
    const validated = SettingsSchema.parse(settings);
    writeFileSync(this.settingsPath, JSON.stringify(validated, null, 2));
  }
}

const settingsStore = new SettingsStore();

// AdminJS Resource for Settings
const SettingsResource = {
  resource: {
    model: class SettingsModel {
      static async findOne() {
        return { id: 'settings', ...settingsStore.getSettings() };
      }
      
      static async update(id: string, payload: any) {
        const settings = SettingsSchema.parse(payload);
        settingsStore.saveSettings(settings);
        return { id: 'settings', ...settings };
      }
    },
    primaryKey: 'id'
  },
  options: {
    id: 'Settings',
    properties: {
      id: { isVisible: false },
      'app.corsOrigins': {
        type: 'mixed',
        isArray: true,
        description: 'Allowed CORS origins for ChatGPT integration'
      },
      'features.executeShell.enabled': {
        type: 'boolean',
        description: 'Enable shell command execution'
      },
      'features.executeCode.enabled': {
        type: 'boolean', 
        description: 'Enable code execution (Python, Node.js, etc.)'
      },
      'features.executeLlm.enabled': {
        type: 'boolean',
        description: 'Enable LLM delegation features'
      },
      'llm.enabled': {
        type: 'boolean',
        description: 'Enable LLM provider integration'
      },
      'llm.provider': {
        type: 'string',
        availableValues: [
          { value: 'none', label: 'None' },
          { value: 'openai', label: 'OpenAI' },
          { value: 'ollama', label: 'Ollama' },
          { value: 'lmstudio', label: 'LM Studio' },
          { value: 'litellm', label: 'LiteLLM' }
        ],
        description: 'LLM provider to use'
      },
      'llm.defaultModel': {
        type: 'string',
        description: 'Default model name'
      },
      'llm.baseURL': {
        type: 'string',
        description: 'Base URL for LLM API'
      },
      'llm.ollamaURL': {
        type: 'string',
        description: 'Ollama server URL'
      },
      'llm.lmstudioURL': {
        type: 'string',
        description: 'LM Studio server URL'
      }
    },
    actions: {
      new: { isVisible: false },
      delete: { isVisible: false },
      bulkDelete: { isVisible: false }
    }
  }
};

export function mountAdmin(app: Application): void {
  const admin = new AdminJS({
    rootPath: '/admin',
    branding: {
      companyName: 'GPT Terminal Plus',
      logo: false,
      favicon: '/favicon.ico'
    },
    resources: [SettingsResource]
  });

  const router = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email: string, password: string) => {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@gpt-terminal-plus.local';
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (email === adminEmail && password === adminPass) {
        return { email, role: 'admin' };
      }
      return null;
    },
    cookieName: 'gtp_admin_session',
    cookiePassword: process.env.SESSION_SECRET || 'change-this-secret-in-production'
  });

  app.use(admin.options.rootPath, router);
  console.log(`AdminJS mounted at ${admin.options.rootPath}`);
}