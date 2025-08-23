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
          env: 'LLM_COMPAT_PROVIDER'
        },
        llmModel: {
          doc: 'Compat model (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'LLM_COMPAT_MODEL'
        },
        ollamaHost: {
          doc: 'Compat Ollama host (used by llmConfig.ts)',
          format: String,
          default: '',
          env: 'LLM_COMPAT_OLLAMA_HOST'
        },
        interpreterHost: {
          doc: 'Compat Open Interpreter host',
          format: String,
          default: '',
          env: 'LLM_COMPAT_INTERPRETER_HOST'
        },
        interpreterPort: {
          doc: 'Compat Open Interpreter port',
          format: 'port',
          default: 0,
          env: 'LLM_COMPAT_INTERPRETER_PORT'
        },
        interpreterOffline: {
          doc: 'Compat Open Interpreter offline flag',
          format: Boolean,
          default: false,
          env: 'LLM_COMPAT_INTERPRETER_OFFLINE'
        },
        interpreterVerbose: {
          doc: 'Compat Open Interpreter verbose flag',
          format: Boolean,
          default: true,
          env: 'LLM_COMPAT_INTERPRETER_VERBOSE'
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
    }
    ,
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

/**
 * Build a redacted view with readOnly flags based on env overrides.
 * "readOnly" is set when the mapped env var is present.
 */
export function getRedactedSettings(): Record<string, Record<string, { value: RedactedValue; readOnly: boolean }>> {
  const cfg = convictConfig();
  cfg.validate({ allowed: 'warn' });

  const redactKeys = new Set([
    'security.apiToken',
    'llm.openai.apiKey'
  ]);

  const result: Record<string, Record<string, { value: RedactedValue; readOnly: boolean }>> = {};

  const assign = (group: string, key: string, value: RedactedValue, envName?: string) => {
    if (!result[group]) result[group] = {};
    const path = `${group}.${key}`;
    const masked = redactKeys.has(path)
      ? (typeof value === 'string' && value.length > 0 ? '*****' : '')
      : value;
    result[group][key] = {
      value: masked,
      readOnly: !!(envName && process.env[envName] !== undefined)
    };
  };

  // Manually assign all known configuration values with their environment variable names
  // server group
  assign('server', 'port', cfg.get('server.port'), 'PORT');
  assign('server', 'httpsEnabled', cfg.get('server.httpsEnabled'), 'HTTPS_ENABLED');
  assign('server', 'httpsKeyPath', cfg.get('server.httpsKeyPath'), 'HTTPS_KEY_PATH');
  assign('server', 'httpsCertPath', cfg.get('server.httpsCertPath'), 'HTTPS_CERT_PATH');
  assign('server', 'corsOrigin', cfg.get('server.corsOrigin'), 'CORS_ORIGIN');
  assign('server', 'disableHealthLog', cfg.get('server.disableHealthLog'), 'DISABLE_HEALTH_LOG');
  assign('server', 'sseHeartbeatMs', cfg.get('server.sseHeartbeatMs'), 'SSE_HEARTBEAT_MS');
  assign('server', 'useServerless', cfg.get('server.useServerless'), 'USE_SERVERLESS');
  assign('server', 'useMcp', cfg.get('server.useMcp'), 'USE_MCP');
  assign('server', 'publicBaseUrl', cfg.get('server.publicBaseUrl'), 'PUBLIC_BASE_URL');
  assign('server', 'publicHost', cfg.get('server.publicHost'), 'PUBLIC_HOST');

  // security group
  assign('security', 'apiToken', cfg.get('security.apiToken'), 'API_TOKEN');
  assign('security', 'denyCommandRegex', cfg.get('security.denyCommandRegex'), 'DENY_COMMAND_REGEX');
  assign('security', 'confirmCommandRegex', cfg.get('security.confirmCommandRegex'), 'CONFIRM_COMMAND_REGEX');

  // llm group
  assign('llm', 'provider', cfg.get('llm.provider'), 'AI_PROVIDER');
  assign('llm', 'openai.baseUrl', cfg.get('llm.openai.baseUrl'), 'OPENAI_BASE_URL');
  assign('llm', 'openai.apiKey', cfg.get('llm.openai.apiKey'), 'OPENAI_API_KEY');
  assign('llm', 'ollama.baseUrl', cfg.get('llm.ollama.baseUrl'), 'OLLAMA_BASE_URL');
  assign('llm', 'lmstudio.baseUrl', cfg.get('llm.lmstudio.baseUrl'), 'LMSTUDIO_BASE_URL');

  // files group
  assign('files', 'enabled', cfg.get('files.enabled'), 'FILES_ENABLED');
  assign('files', 'consequential', cfg.get('files.consequential'), 'FILES_CONSEQUENTIAL');
  
  // execution group
  assign('execution', 'shell.enabled', cfg.get('execution.shell.enabled'), 'SHELL_ENABLED');
  assign('execution', 'shell.allowed', cfg.get('execution.shell.allowed'), 'SHELL_ALLOWED');
  assign('execution', 'code.enabled', cfg.get('execution.code.enabled'), 'CODE_ENABLED');
  assign('execution', 'llm.enabled', cfg.get('execution.llm.enabled'), 'LLM_ENABLED');
  assign('execution', 'llm.timeoutMs', cfg.get('execution.llm.timeoutMs'), 'EXECUTE_LLM_TIMEOUT_MS');
  
  // compat group
  assign('compat', 'llmProvider', cfg.get('llm.compat.llmProvider'), 'LLM_COMPAT_PROVIDER');
  assign('compat', 'llmModel', cfg.get('llm.compat.llmModel'), 'LLM_COMPAT_MODEL');
  assign('compat', 'ollamaHost', cfg.get('llm.compat.ollamaHost'), 'LLM_COMPAT_OLLAMA_HOST');
  assign('compat', 'interpreterHost', cfg.get('llm.compat.interpreterHost'), 'LLM_COMPAT_INTERPRETER_HOST');
  assign('compat', 'interpreterPort', cfg.get('llm.compat.interpreterPort'), 'LLM_COMPAT_INTERPRETER_PORT');
  assign('compat', 'interpreterOffline', cfg.get('llm.compat.interpreterOffline'), 'LLM_COMPAT_INTERPRETER_OFFLINE');
  assign('compat', 'interpreterVerbose', cfg.get('llm.compat.interpreterVerbose'), 'LLM_COMPAT_INTERPRETER_VERBOSE');
  
  // engines group (for WebUI convenience)
  assign('engines', 'codex.model', cfg.get('engines.codex.model'), 'CODEX_MODEL');
  assign('engines', 'codex.fullAuto', cfg.get('engines.codex.fullAuto'), 'CODEX_FULL_AUTO');
  assign('engines', 'interpreter.model', cfg.get('engines.interpreter.model'), 'INTERPRETER_MODEL');
  assign('engines', 'interpreter.temperature', cfg.get('engines.interpreter.temperature'), 'INTERPRETER_TEMPERATURE');
  assign('engines', 'interpreter.autoRun', cfg.get('engines.interpreter.autoRun'), 'INTERPRETER_AUTO_RUN');
  assign('engines', 'interpreter.loop', cfg.get('engines.interpreter.loop'), 'INTERPRETER_LOOP');
  assign('engines', 'interpreter.contextWindow', cfg.get('engines.interpreter.contextWindow'), 'INTERPRETER_CONTEXT_WINDOW');
  assign('engines', 'interpreter.maxTokens', cfg.get('engines.interpreter.maxTokens'), 'INTERPRETER_MAX_TOKENS');
  assign('engines', 'interpreter.debug', cfg.get('engines.interpreter.debug'), 'INTERPRETER_DEBUG');
  assign('engines', 'interpreter.safeMode', cfg.get('engines.interpreter.safeMode'), 'INTERPRETER_SAFE_MODE');
  assign('engines', 'ollama.model', cfg.get('engines.ollama.model'), 'OLLAMA_MODEL');
  assign('engines', 'ollama.host', cfg.get('engines.ollama.host'), 'OLLAMA_HOST');
  assign('engines', 'ollama.format', cfg.get('engines.ollama.format'), 'OLLAMA_FORMAT');
  assign('engines', 'ollama.noWordWrap', cfg.get('engines.ollama.noWordWrap'), 'OLLAMA_NOWORDWRAP');
  assign('engines', 'ollama.verbose', cfg.get('engines.ollama.verbose'), 'OLLAMA_VERBOSE');
 
  // profiles summary
  assign('profiles', 'activeProfile', cfg.get('activeProfile'), 'ACTIVE_PROFILE');
  try {
    const names = ((cfg.get('profiles') as any[]) || []).map((p: any) => p?.name).filter(Boolean);
    assign('profiles', 'names', names);
  } catch {
    assign('profiles', 'names', []);
  }

  // limits
  assign('limits', 'maxInputChars', cfg.get('limits.maxInputChars'), 'MAX_INPUT_CHARS');
  assign('limits', 'maxOutputChars', cfg.get('limits.maxOutputChars'), 'MAX_OUTPUT_CHARS');
  assign('limits', 'maxSessionDurationSec', cfg.get('limits.maxSessionDurationSec'), 'MAX_SESSION_DURATION');
  assign('limits', 'maxSessionIdleSec', cfg.get('limits.maxSessionIdleSec'), 'MAX_SESSION_IDLE');
  assign('limits', 'maxLlmCostUsd', cfg.get('limits.maxLlmCostUsd'), 'MAX_LLM_COST_USD');
  assign('limits', 'allowTruncation', cfg.get('limits.allowTruncation'), 'ALLOW_TRUNCATION');
  
  return result;
}

// Patch: normalize convict's getSchema() shape to expose `properties` for tests/tools
// Some consumers expect a `properties` field rather than convict's internal `_cvtProperties`.
// We wrap the returned instance to provide a backward/forward compatible getter.
// Deprecated alias if any external code imported it previously
export const convictConfigPatched = convictConfig;
