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
        summary: 'Execute a command using configured shell (generic)',
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
      version: '0.1.0',
      description: 'Runtime OpenAPI surface for listing servers and executing commands/code/LLM.',
    },
    servers: [{ url: baseUrl, description: 'Runtime base URL' }],
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
      '/command/execute-llm': {
        post: {
          operationId: 'executeLlm',
          summary: 'Run an LLM plan or direct instruction',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    instructions: { type: 'string' },
                    dryRun: { type: 'boolean' },
                    stream: { type: 'boolean' },
                  },
                  required: ['instructions'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'LLM execution complete',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      plan: { type: 'object' },
                      results: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },

      /** ----- File operation endpoints ----- */
      '/file/create': {
        post: {
          operationId: 'fileCreate',
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
          summary: 'List files (GET shim)',
          security: [{ bearerAuth: [] as any[] }],
          parameters: [
            { in: 'query', name: 'directory', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/file/update': {
        post: {
          operationId: 'fileUpdate',
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
                            anyOf: [
                              { type: 'string' },
                              { type: 'number' },
                              { type: 'boolean' },
                              { type: 'object' },
                              { type: 'array' },
                              { type: 'null' }
                            ]
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
