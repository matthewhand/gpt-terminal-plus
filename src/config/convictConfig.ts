import convict from 'convict';
import { loadProfilesConfig, getActiveProfileName } from './profiles';

type RedactedValue = string | number | boolean | null | string[] | number[] | boolean[] | Record<string, unknown>;

export const convictConfig = () => {
  // Schema with env mappings and defaults
  const instance: any = convict({
    execution: {
      shell: {
        enabled: {
          doc: 'Enable shell command execution endpoints',
          format: Boolean,
          default: true,
          env: 'SHELL_ENABLED'
        },
        allowed: {
          doc: 'List of allowed shells/interpreters when a shell is explicitly requested',
          format: Array,
          default: [],
          env: 'SHELL_ALLOWED'
        }
      },
      code: {
        enabled: {
          doc: 'Enable code execution endpoints',
          format: Boolean,
          default: true,
          env: 'CODE_ENABLED'
        }
      },
      llm: {
        enabled: {
          doc: 'Enable LLM execution endpoints',
          format: Boolean,
          default: true,
          env: 'LLM_ENABLED'
        },
        timeoutMs: {
          doc: 'Timeout for LLM command execution (ms)',
          format: 'nat',
          default: 120000,
          env: 'EXECUTE_LLM_TIMEOUT_MS'
        }
      }
    },
    server: {
      port: {
        doc: 'Port the HTTP server listens on',
        format: 'port',
        default: 5005,
        env: 'PORT'
      },
      httpsEnabled: {
        doc: 'Enable HTTPS',
        format: Boolean,
        default: false,
        env: 'HTTPS_ENABLED'
      },
      httpsKeyPath: {
        doc: 'Path to HTTPS private key (PEM) when HTTPS enabled',
        format: String,
        default: '',
        env: 'HTTPS_KEY_PATH'
      },
      httpsCertPath: {
        doc: 'Path to HTTPS certificate (PEM) when HTTPS enabled',
        format: String,
        default: '',
        env: 'HTTPS_CERT_PATH'
      },
      corsOrigin: {
        doc: 'Comma-separated list of allowed CORS origins',
        format: String,
        default: 'https://chat.openai.com,https://chatgpt.com',
        env: 'CORS_ORIGIN'
      },
      disableHealthLog: {
        doc: 'If true, suppress logs for /health',
        format: Boolean,
        default: false,
        env: 'DISABLE_HEALTH_LOG'
      },
      sseHeartbeatMs: {
        doc: 'SSE heartbeat interval (ms)',
        format: 'nat',
        default: 15000,
        env: 'SSE_HEARTBEAT_MS'
      },
      useServerless: {
        doc: 'Enable serverless-http handler export',
        format: Boolean,
        default: false,
        env: 'USE_SERVERLESS'
      },
      useMcp: {
        doc: 'Enable MCP server /mcp/messages',
        format: Boolean,
        default: false,
        env: 'USE_MCP'
      },
      publicBaseUrl: {
        doc: 'Absolute base URL advertised in OpenAPI servers[0].url',
        format: String,
        default: '',
        env: 'PUBLIC_BASE_URL'
      },
      publicHost: {
        doc: 'Host used when deriving public URL if PUBLIC_BASE_URL not set',
        format: String,
        default: 'localhost',
        env: 'PUBLIC_HOST'
      }
    },
    security: {
      apiToken: {
        doc: 'Bearer API token; generated at runtime if not set',
        format: String,
        default: '',
        env: 'API_TOKEN',
        sensitive: true
      },
      denyCommandRegex: {
        doc: 'Regex list (comma-separated) of deny patterns',
        format: String,
        default: '',
        env: 'DENY_COMMAND_REGEX'
      },
      confirmCommandRegex: {
        doc: 'Regex list (comma-separated) of confirm patterns',
        format: String,
        default: '',
        env: 'CONFIRM_COMMAND_REGEX'
      }
    },
    llm: {
      provider: {
        doc: 'Selected AI provider',
        format: ['openai', 'ollama', 'lmstudio', 'open-interpreter', 'auto', ''],
        default: '',
        env: 'AI_PROVIDER'
      },
      openai: {
        baseUrl: {
          doc: 'OpenAI-compatible base URL',
          format: String,
          default: '',
          env: 'OPENAI_BASE_URL'
        },
        apiKey: {
          doc: 'OpenAI API key',
          format: String,
          default: '',
          env: 'OPENAI_API_KEY',
          sensitive: true
        }
      },
      ollama: {
        baseUrl: {
          doc: 'Ollama base URL',
          format: String,
          default: '',
          env: 'OLLAMA_BASE_URL'
        }
      },
      lmstudio: {
        baseUrl: {
          doc: 'LM Studio base URL',
          format: String,
          default: '',
          env: 'LMSTUDIO_BASE_URL'
        }
      },
      // Compatibility with src/common/llmConfig.ts environment knobs
      compat: {
        llmProvider: {
          doc: 'Compat LLM provider (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'LLM_PROVIDER'
        },
        llmModel: {
          doc: 'Compat model (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'LLM_MODEL'
        },
        ollamaHost: {
          doc: 'Compat Ollama host (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'OLLAMA_HOST'
        },
        interpreterHost: {
          doc: 'Compat Open Interpreter host',
          format: String,
          default: '',
          env: 'INTERPRETER_SERVER_HOST'
        },
        interpreterPort: {
          doc: 'Compat Open Interpreter port',
          format: 'port',
          default: 0,
          env: 'INTERPRETER_SERVER_PORT'
        },
        interpreterOffline: {
          doc: 'Compat Open Interpreter offline flag',
          format: Boolean,
          default: false,
          env: 'INTERPRETER_OFFLINE'
        },
        interpreterVerbose: {
          doc: 'Compat Open Interpreter verbose flag',
          format: Boolean,
          default: true,
          env: 'INTERPRETER_VERBOSE'
        }
      }
    },
    // Engine-specific conveniences exposed to WebUI
    engines: {
      codex: {
        model: {
          doc: 'Codex model identifier',
          format: String,
          default: 'gpt-5',
          env: 'CODEX_MODEL'
        },
        fullAuto: {
          doc: 'Codex full-auto execution',
          format: Boolean,
          default: true,
          env: 'CODEX_FULL_AUTO'
        },
        config: {
          doc: 'Codex JSON configuration blob',
          format: Object,
          default: {}
        }
      },
      interpreter: {
        model: {
          doc: 'Interpreter model identifier',
          format: String,
          default: 'gpt-4o',
          env: 'INTERPRETER_MODEL'
        },
        temperature: {
          doc: 'Interpreter temperature',
          format: Number,
          default: 0.7,
          env: 'INTERPRETER_TEMPERATURE'
        },
        autoRun: {
          doc: 'Run automatically without prompting',
          format: Boolean,
          default: true,
          env: 'INTERPRETER_AUTO_RUN'
        },
        loop: {
          doc: 'Loop until completion',
          format: Boolean,
          default: false,
          env: 'INTERPRETER_LOOP'
        },
        contextWindow: {
          doc: 'Interpreter context window size',
          format: 'nat',
          default: 8192,
          env: 'INTERPRETER_CONTEXT_WINDOW'
        },
        maxTokens: {
          doc: 'Interpreter max tokens',
          format: 'nat',
          default: 2048,
          env: 'INTERPRETER_MAX_TOKENS'
        },
        debug: {
          doc: 'Interpreter debug mode',
          format: Boolean,
          default: false,
          env: 'INTERPRETER_DEBUG'
        },
        safeMode: {
          doc: 'Interpreter safe mode',
          format: ['auto', 'ask', 'off', ''],
          default: 'auto',
          env: 'INTERPRETER_SAFE_MODE'
        }
      },
      ollama: {
        model: {
          doc: 'Ollama model name',
          format: String,
          default: 'llama2',
          env: 'OLLAMA_MODEL'
        },
        host: {
          doc: 'Ollama base URL',
          format: String,
          default: 'http://localhost:11434',
          env: 'OLLAMA_HOST'
        },
        format: {
          doc: 'Ollama response format',
          format: String,
          default: 'text',
          env: 'OLLAMA_FORMAT'
        },
        noWordWrap: {
          doc: 'Disable word wrapping in output',
          format: Boolean,
          default: false,
          env: 'OLLAMA_NOWORDWRAP'
        },
        verbose: {
          doc: 'Verbose output',
          format: Boolean,
          default: false,
          env: 'OLLAMA_VERBOSE'
        }
      }
    },
    files: {
      enabled: {
        doc: 'Enable file operation routes (list, read, create, update, amend, setPostCommand)',
        format: Boolean,
        default: false,
        env: 'FILES_ENABLED'
      },
      consequential: {
        doc: 'Mark file operation endpoints as consequential in OpenAPI (x-openai-isConsequential)',
        format: Boolean,
        default: true,
        env: 'FILES_CONSEQUENTIAL'
      }
    },
    // Safety/circuit breakers
    limits: {
      maxInputChars: {
        doc: 'Maximum input characters per request',
        format: 'nat',
        default: 10000,
        env: 'MAX_INPUT_CHARS'
      },
      maxOutputChars: {
        doc: 'Maximum output characters returned from any tool/LLM',
        format: 'nat',
        default: 200000,
        env: 'MAX_OUTPUT_CHARS'
      },
      maxSessionDurationSec: {
        doc: 'Maximum seconds for a session',
        format: 'nat',
        default: 7200,
        env: 'MAX_SESSION_DURATION'
      },
      maxSessionIdleSec: {
        doc: 'Maximum idle seconds before session termination',
        format: 'nat',
        default: 600,
        env: 'MAX_SESSION_IDLE'
      },
      maxLlmCostUsd: {
        doc: 'Optional max budget in USD (null for unlimited)',
        format: (val: any) => (val === null || typeof val === 'number'),
        default: null,
        env: 'MAX_LLM_COST_USD'
      },
      allowTruncation: {
        doc: 'If true, inputs larger than limit may be truncated',
        format: Boolean,
        default: false,
        env: 'ALLOW_TRUNCATION'
      }
    },
    // Profiles (loaded from YAML; not env-mapped except activeProfile)
    profiles: {
      doc: 'Normalized profiles loaded from config/profiles.yaml (or fallbacks)',
      format: Array,
      default: []
    },
    activeProfile: {
      doc: 'Active profile name (overrides via env ACTIVE_PROFILE)',
      format: String,
      default: '',
      env: 'ACTIVE_PROFILE'
    }
  });
  
  // Load profiles from YAML and set active profile
  try {
    const profilesCfg = loadProfilesConfig();
    instance.set('profiles', Array.isArray(profilesCfg?.profiles) ? profilesCfg.profiles : []);
    const preferred = instance.get('activeProfile') as string;
    const active = getActiveProfileName(preferred);
    instance.set('activeProfile', active);
  } catch (err) {
    // Non-fatal: leave defaults if profiles cannot be loaded
  }

  // Normalize getSchema() to have `properties` for compatibility in tests/tools
  const originalGetSchema = instance.getSchema?.bind(instance);
  if (originalGetSchema) {
    instance.getSchema = () => {
      const schema = originalGetSchema();
      if (schema && !('properties' in schema) && schema._cvtProperties) {
        return { properties: schema._cvtProperties };
      }
      return schema;
    };
  }

  return instance;
};

export function getRedactedSettings() {
  const config = convictConfig();
  const settings = config.getProperties();
  
  // Redact sensitive information
  const redacted = JSON.parse(JSON.stringify(settings));
  
  // Redact API keys and passwords
  if (redacted.auth?.adminPassword) {
    redacted.auth.adminPassword = '[REDACTED]';
  }
  if (redacted.auth?.apiToken) {
    redacted.auth.apiToken = '[REDACTED]';
  }
  
  return redacted;
}
