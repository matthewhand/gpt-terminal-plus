import convict from 'convict';

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
          default: false,
          env: 'LLM_ENABLED'
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
  });

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
  
  // compat group
  assign('compat', 'llmProvider', cfg.get('llm.compat.llmProvider'), 'LLM_COMPAT_PROVIDER');
  assign('compat', 'llmModel', cfg.get('llm.compat.llmModel'), 'LLM_COMPAT_MODEL');
  assign('compat', 'ollamaHost', cfg.get('llm.compat.ollamaHost'), 'LLM_COMPAT_OLLAMA_HOST');
  assign('compat', 'interpreterHost', cfg.get('llm.compat.interpreterHost'), 'LLM_COMPAT_INTERPRETER_HOST');
  assign('compat', 'interpreterPort', cfg.get('llm.compat.interpreterPort'), 'LLM_COMPAT_INTERPRETER_PORT');
  assign('compat', 'interpreterOffline', cfg.get('llm.compat.interpreterOffline'), 'LLM_COMPAT_INTERPRETER_OFFLINE');
  assign('compat', 'interpreterVerbose', cfg.get('llm.compat.interpreterVerbose'), 'LLM_COMPAT_INTERPRETER_VERBOSE');
  
  return result;
}

// Patch: normalize convict's getSchema() shape to expose `properties` for tests/tools
// Some consumers expect a `properties` field rather than convict's internal `_cvtProperties`.
// We wrap the returned instance to provide a backward/forward compatible getter.
// Deprecated alias if any external code imported it previously
export const convictConfigPatched = convictConfig;
