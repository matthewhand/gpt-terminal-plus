import express, { Request } from 'express';
import { stringify as yamlStringify } from 'yaml';
// import fs from 'fs';
// import path from 'path';
import { convictConfig } from './config/convictConfig';
import { listExecutors } from './utils/executors';

function buildExecutorPaths(cfg: any) {
  const execMode = (cfg as any).get('executors.exposureMode') as string;
  const includeGeneric = execMode === 'generic' || execMode === 'both';
  const includeSpecific = execMode === 'specific' || execMode === 'both';
  const paths: Record<string, any> = {};
  if (includeGeneric) {
    paths['/command/execute-shell'] = {
      post: {
        operationId: 'executeShell',
        tags: ['Commands'],
        summary: 'Execute a command using configured shell (generic)',
        description: 'Runs a single command through the configured shell on the active server and returns stdout, stderr, and exit code.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { command: { type: 'string' }, args: { type: 'array', items: { type: 'string' } }, shell: { type: 'string' } },
                required: ['command'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Execution complete',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    result: { $ref: '#/components/schemas/ExecutionResult' },
                    aiAnalysis: { type: 'object' },
                  },
                  required: ['result'],
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] as any[] }],
      },
    };
  }
  if (includeSpecific) {
    const execs = listExecutors();
    for (const ex of execs) {
      const pathKey = `/command/execute-${ex.name}`;
      if (ex.kind === 'shell') {
        paths[pathKey] = {
          post: {
            operationId: `execute_${ex.name}`,
            tags: ['Commands'],
            summary: `Execute a ${ex.name} command`,
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { command: { type: 'string' }, args: { type: 'array', items: { type: 'string' } } },
                    required: ['command'],
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Execution complete',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        result: { $ref: '#/components/schemas/ExecutionResult' },
                        aiAnalysis: { type: 'object' },
                      },
                      required: ['result'],
                    },
                  },
                },
              },
            },
            security: [{ bearerAuth: [] as any[] }],
          },
        };
      } else {
        paths[pathKey] = {
          post: {
            operationId: `execute_${ex.name}`,
            tags: ['Commands'],
            summary: `Execute a ${ex.name} snippet`,
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { code: { type: 'string' }, timeoutMs: { type: 'integer' } },
                    required: ['code'],
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Execution complete',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        result: { $ref: '#/components/schemas/ExecutionResult' },
                        aiAnalysis: { type: 'object' },
                      },
                      required: ['result'],
                    },
                  },
                },
              },
            },
            security: [{ bearerAuth: [] as any[] }],
          },
        };
      }
    }
  }
  return paths;
}

/** Public base URL for OpenAPI `servers` — prefers env, else request, else fallbacks. */
export function getPublicBaseUrl(req?: Request): string {
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl && /^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/+$/, '');

  if (req) {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const host = req.get('host') || 'localhost:3100';
    return `${proto}://${host}`;
  }

  const protocol = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
  const port = process.env.PORT ? Number(process.env.PORT) : 3100;
  const host = process.env.PUBLIC_HOST || 'localhost';
  return `${protocol}://${host}:${port}`;
}

// Note: runtime spec is built below; static public OpenAPI file loading removed as unused

/** Build the OpenAPI object; derive servers[] from the actual request unless PUBLIC_BASE_URL is set. */
export function buildSpec(req?: Request) {
  const baseUrl = getPublicBaseUrl(req);
  const cfg = convictConfig();
  const filesConsequential = (cfg as any).get('files.consequential'); // Get files.consequential from config

  return {
    openapi: '3.0.3',
    info: {
      title: 'gpt-terminal-plus API',
      version: '1.0.0',
      description: [
        'Remote terminal, file, and LLM-execution API for gpt-terminal-plus.',
        '',
        'Exposes endpoints to run shell commands and code, manage files, list',
        'registered servers, and drive LLM-planned execution. Designed to be',
        'consumed by OpenAPI clients and by mcp-openapi-proxy / mcp-gateway as an',
        'MCP tool server.',
        '',
        'All endpoints require a Bearer API token (`Authorization: Bearer <API_TOKEN>`).',
      ].join('\n'),
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    },
    servers: [{ url: baseUrl, description: 'Runtime base URL' }],
    tags: [
      { name: 'Commands', description: 'Execute shell commands, code, and LLM-planned actions' },
      { name: 'Files', description: 'Create, read, list, edit, and patch files on the active server' },
      { name: 'Servers', description: 'List and select registered execution targets' },
      { name: 'Activity', description: 'Inspect recorded execution/activity sessions' },
      { name: 'Settings', description: 'Read redacted runtime configuration' },
      { name: 'Config', description: 'Toggle features and persist configuration' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'API_TOKEN' },
      },
      schemas: {
        ExecutionResult: {
          type: 'object',
          properties: {
            stdout: { type: 'string' },
            stderr: { type: 'string' },
            exitCode: { type: 'integer' },
            error: { type: 'boolean' },
          },
          required: ['stdout', 'stderr', 'exitCode', 'error'],
        },
      },
    },
    security: [{ bearerAuth: [] as any[] }],
    paths: {
      '/server/list': {
        get: {
          operationId: 'serverList',
          tags: ['Servers'],
          summary: 'List servers for this API token',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      servers: { type: 'array', items: { type: 'object' } },
                    },
                    required: ['servers'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      ...buildExecutorPaths(cfg),
      
      '/command/executors': {
        get: {
          operationId: 'listExecutors',
          tags: ['Commands'],
          summary: 'List available executors (bash, python, etc.)',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      executors: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            enabled: { type: 'boolean' },
                            cmd: { type: 'string' },
                            args: { type: 'array', items: { type: 'string' } },
                            kind: { type: 'string', enum: ['shell','code'] }
                          }
                        }
                      }
                    },
                    required: ['executors']
                  }
                }
              }
            }
          },
          security: [{ bearerAuth: [] as any[] }],
        }
      },
      '/command/executors/{name}/toggle': {
        post: {
          operationId: 'toggleExecutor',
          tags: ['Commands'],
          summary: 'Enable or disable an executor',
          parameters: [
            { name: 'name', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { enabled: { type: 'boolean' } }, required: ['enabled'] }
              }
            }
          },
          responses: { 200: { description: 'OK' }, 404: { description: 'Not found' }, 400: { description: 'Bad request' } },
          security: [{ bearerAuth: [] as any[] }],
        }
      },
      '/command/executors/{name}/test': {
        post: {
          operationId: 'testExecutor',
          tags: ['Commands'],
          summary: 'Run a lightweight version command to validate executor',
          parameters: [
            { name: 'name', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not found' }, 409: { description: 'Disabled' } },
          security: [{ bearerAuth: [] as any[] }],
        }
      },
      '/command/executors/{name}/update': {
        post: {
          operationId: 'updateExecutor',
          tags: ['Commands'],
          summary: 'Update executor command and args',
          parameters: [
            { name: 'name', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { cmd: { type: 'string' }, args: { type: 'array', items: { type: 'string' } } } }
              }
            }
          },
          responses: { 200: { description: 'OK' }, 400: { description: 'Bad request' } },
          security: [{ bearerAuth: [] as any[] }],
        }
      },

      /** ----- File operation endpoints ----- */
      '/file/create': {
        post: {
          operationId: 'fileCreate',
          tags: ['Files'],
          summary: 'Create or replace a file on the active server',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filePath: { type: 'string' },
                    content: { type: 'string' },
                    backup: { type: 'boolean', default: true },
                  },
                  required: ['filePath'],
                },
              },
            },
          },
          responses: {
            200: { description: 'File created' },
            400: { description: 'Bad request' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/list': {
        post: {
          operationId: 'fileList',
          tags: ['Files'],
          summary: 'List files in a directory on the active server',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    directory: { type: 'string' },
                    limit: { type: 'number' },
                    offset: { type: 'number' },
                    orderBy: { type: 'string', enum: ['datetime', 'filename'] },
                    recursive: { type: 'boolean' },
                    typeFilter: { type: 'string', enum: ['files', 'folders'] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      files: {
                        type: 'object',
                        properties: {
                          items: { type: 'array', items: { type: 'object' } },
                          total: { type: 'integer' },
                          limit: { type: 'integer' },
                          offset: { type: 'integer' },
                        },
                        required: ['items', 'total', 'limit', 'offset'],
                      },
                    },
                    required: ['files'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
        get: {
          operationId: 'fileListGet',
          tags: ['Files'],
          summary: 'List files (GET shim)',
          security: [{ bearerAuth: [] as any[] }],
          parameters: [
            { in: 'query', name: 'directory', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/file/read': {
        post: {
          operationId: 'fileRead',
          tags: ['Files'],
          summary: 'Read a file (optionally a line range) from the active server',
          description: 'Returns file content. Optionally restrict to a line range with startLine/endLine, or cap bytes with maxBytes.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filePath: { type: 'string' },
                    startLine: { type: 'integer' },
                    endLine: { type: 'integer' },
                    encoding: { type: 'string', default: 'utf-8' },
                    maxBytes: { type: 'integer' },
                  },
                  required: ['filePath'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'File content',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      content: { type: 'string' },
                      filePath: { type: 'string' },
                      truncated: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            400: { description: 'Bad request' },
            404: { description: 'File not found' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
        get: {
          operationId: 'fileReadGet',
          tags: ['Files'],
          summary: 'Read a file (GET shim)',
          parameters: [
            { in: 'query', name: 'filePath', required: true, schema: { type: 'string' } },
            { in: 'query', name: 'startLine', schema: { type: 'integer' } },
            { in: 'query', name: 'endLine', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'File content' }, 404: { description: 'File not found' } },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/update': {
        post: {
          operationId: 'fileUpdate',
          tags: ['Files'],
          summary: 'Regex replace within a file',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filePath: { type: 'string' },
                    pattern: { type: 'string' },
                    replacement: { type: 'string' },
                    backup: { type: 'boolean', default: true },
                    multiline: { type: 'boolean', default: false },
                  },
                  required: ['filePath', 'pattern', 'replacement'],
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated' },
            400: { description: 'Bad request' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/amend': {
        post: {
          operationId: 'fileAmend',
          tags: ['Files'],
          summary: 'Append content to a file',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filePath: { type: 'string' },
                    content: { type: 'string' },
                    backup: { type: 'boolean', default: true },
                  },
                  required: ['filePath', 'content'],
                },
              },
            },
          },
          responses: {
            200: { description: 'Amended' },
            400: { description: 'Bad request' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/diff': {
        post: {
          operationId: 'fileApplyDiff',
          tags: ['Files'],
          summary: 'Apply a unified diff using git apply',
          description: 'Validates with `git apply --check`, then applies with `git apply`. Currently supported only for the local server handler.',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    diff: { type: 'string' },
                    dryRun: { type: 'boolean', default: false },
                    whitespaceNowarn: { type: 'boolean', default: true },
                  },
                  required: ['diff'],
                },
              },
            },
          },
          responses: { 200: { description: 'Applied' }, 400: { description: 'Validation failed' } },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/patch': {
        post: {
          operationId: 'fileApplyPatch',
          tags: ['Files'],
          summary: 'Apply a structured patch via git apply',
          description: 'Generates a minimal unified diff for the target file and applies it with git apply. Currently supported only for the local server handler.',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filePath: { type: 'string' },
                    search: { type: 'string' },
                    oldText: { type: 'string' },
                    replace: { type: 'string' },
                    all: { type: 'boolean', default: false },
                    startLine: { type: 'integer' },
                    endLine: { type: 'integer' },
                    dryRun: { type: 'boolean', default: false },
                    whitespaceNowarn: { type: 'boolean', default: true },
                  },
                  required: ['filePath', 'replace'],
                },
              },
            },
          },
          responses: { 200: { description: 'Applied' }, 400: { description: 'Validation failed' } },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/activity/list': {
        get: {
          operationId: 'activityList',
          tags: ['Activity'],
          summary: 'List recent activity sessions',
          parameters: [
            { name: 'date', in: 'query', required: false, schema: { type: 'string', format: 'YYYY-MM-DD' } },
            { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 50 } },
            { name: 'type', in: 'query', required: false, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Success response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      sessions: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            date: { type: 'string' },
                            id: { type: 'string' },
                            steps: { type: 'integer' },
                            startedAt: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/activity/session/{date}/{id}': {
        get: {
          operationId: 'activitySession',
          tags: ['Activity'],
          summary: 'Fetch a full activity session',
          parameters: [
            { name: 'date', in: 'path', required: true, schema: { type: 'string', format: 'YYYY-MM-DD' } },
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Success response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      meta: { type: 'object', properties: { sessionId: { type: 'string' }, startedAt: { type: 'string' } } },
                      steps: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      
      '/settings': {
        get: {
          operationId: 'getSettings',
          tags: ['Settings'],
          summary: 'Get redacted configuration settings',
          description: 'Returns grouped configuration values with secrets redacted. Values overridden by environment variables are marked as readOnly.',
          security: [{ bearerAuth: [] as any[] }],
          responses: {
            200: {
              description: 'Redacted settings grouped by category',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    additionalProperties: {
                      type: 'object',
                      description: 'Settings group (e.g., server, security, llm)',
                      additionalProperties: {
                        type: 'object',
                        properties: {
                          value: {
                            description: 'Any JSON-serializable settings value (string, number, boolean, object, array, or null)',
                          },
                          readOnly: { type: 'boolean' }
                        },
                        required: ['value', 'readOnly']
                      }
                    }
                  }
                }
              }
            },
            400: { description: 'Bad request' }
          },
          'x-openai-isConsequential': false
        }
      },
      '/config/persist': {
        post: {
          operationId: 'persistConfig',
          tags: ['Config'],
          summary: 'Persist current runtime config changes to disk',
          description: 'Saves the current configuration state to convict-config.json for persistence across restarts',
          security: [{ bearerAuth: [] as any[] }],
          responses: {
            200: {
              description: 'Config persisted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' }
                    },
                    required: ['success', 'message']
                  }
                }
              }
            },
            500: {
              description: 'Persistence failed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      error: { type: 'string' }
                    },
                    required: ['success', 'error']
                  }
                }
              }
            }
          },
          'x-openai-isConsequential': false
        }
      },
      '/config/toggle/llm': {
        post: {
          operationId: 'toggleLlm',
          tags: ['Config'],
          summary: 'Toggle LLM execution and persist the change',
          description: 'Enables or disables LLM execution endpoints and persists the configuration',
          security: [{ bearerAuth: [] as any[] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { enabled: { type: 'boolean' } },
                  required: ['enabled']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'LLM toggled successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      execution: { type: 'object', properties: { llm: { type: 'object', properties: { enabled: { type: 'boolean' } } } } },
                      llm: { type: 'object', properties: { enabled: { type: 'boolean' } } }
                    },
                    required: ['success']
                  }
                }
              }
            },
            400: { description: 'Bad request - enabled boolean required' },
            500: { description: 'Toggle failed' }
          },
          'x-openai-isConsequential': false
        }
      },
      '/config/toggle/files': {
        post: {
          operationId: 'toggleFiles',
          tags: ['Config'],
          summary: 'Toggle file operations and persist the change',
          description: 'Enables or disables file operation endpoints and persists the configuration',
          security: [{ bearerAuth: [] as any[] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { enabled: { type: 'boolean' } },
                  required: ['enabled']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'File operations toggled successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      files: { type: 'object', properties: { enabled: { type: 'boolean' } } }
                    },
                    required: ['success']
                  }
                }
              }
            },
            400: { description: 'Bad request - enabled boolean required' },
            500: { description: 'Toggle failed' }
          },
          'x-openai-isConsequential': false
        }
      },
      '/config/toggle/shell': {
        post: {
          operationId: 'toggleShell',
          tags: ['Config'],
          summary: 'Toggle shell execution and persist the change',
          description: 'Enables or disables shell execution endpoints and persists the configuration',
          security: [{ bearerAuth: [] as any[] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { enabled: { type: 'boolean' } },
                  required: ['enabled']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Shell execution toggled successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      execution: { type: 'object', properties: { shell: { type: 'object', properties: { enabled: { type: 'boolean' } } } } }
                    },
                    required: ['success']
                  }
                }
              }
            },
            400: { description: 'Bad request - enabled boolean required' },
            500: { description: 'Toggle failed' }
          },
          'x-openai-isConsequential': false
        }
      },
    },
  };
}

/** Register dynamic OpenAPI routes. */
export function registerOpenAPIRoutes(app: express.Application): void {
  app.get('/openapi.json', (req, res) => {
    // Always serve dynamic spec to ensure freshness in tests and dev
    res.json(buildSpec(req));
  });

  app.get('/openapi.yaml', (req, res) => {
    const yaml = yamlStringify(buildSpec(req));
    res.type('application/yaml').send(yaml);
  });

  // Lightweight Swagger UI fallback for environments that don't mount swagger-ui-express
  app.get('/docs', (_req, res) => {
    const html = `<!doctype html><html><head><title>Swagger UI</title></head><body><h1>swagger</h1><p>See <a href="/openapi.json">/openapi.json</a></p></body></html>`;
    res.status(200).type('text/html').send(html);
  });
}

/** Backward-compatible export name (some imports use camel-case Api). */
export const registerOpenApiRoutes = registerOpenAPIRoutes;
