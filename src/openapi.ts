import express, { Request } from 'express';
import { stringify as yamlStringify } from 'yaml';
import fs from 'fs';
import path from 'path';
import { convictConfig } from './config/convictConfig';

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

/** Attempt to read a static OpenAPI artifact from public/, else return null.
 * Prefer pkg-friendly path relative to build output; fall back to process.cwd().
 */
function readPublicFileIfExists(filename: 'openapi.json' | 'openapi.yaml'): string | null {
  const candidates = [
    // When bundled with pkg, assets are available relative to __dirname
    path.resolve(__dirname, '..', 'public', filename),
    // Fallback for plain node execution from repo root
    path.resolve(process.cwd(), 'public', filename),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

/** Build the OpenAPI object; derive servers[] from the actual request unless PUBLIC_BASE_URL is set. */
function buildSpec(req?: Request) {
  const baseUrl = getPublicBaseUrl(req);
  const cfg = convictConfig();
  const filesConsequential = cfg.get('files.consequential');

  return {
    openapi: '3.1.0',
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
      '/command/execute': {
        post: {
          operationId: 'executeCommand',
          summary: 'Execute using first available mode',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { command: { type: 'string' } },
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
      },
      '/command/execute-code': {
        post: {
          operationId: 'executeCode',
          summary: 'Execute a code snippet',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    language: { type: 'string' },
                    code: { type: 'string' },
                    timeoutMs: { type: 'integer' },
                  },
                  required: ['language', 'code'],
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
      },
      '/command/execute-shell': {
        post: {
          operationId: 'executeShell',
          summary: 'Execute a command (literal by default)',
          description: 'Default runs the binary with args via spawn (no shell expansion). If `shell` is provided (e.g., bash, powershell), the command runs under that shell.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    command: { type: 'string' },
                    args: { type: 'array', items: { type: 'string' } },
                    shell: { type: 'string', description: 'Optional shell to run under (bash, powershell, etc). If omitted, defaults to safe literal mode with no shell expansion.' }
                  },
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
                    engine: { type: 'string', description: 'LLM engine (e.g., llm:interpreter, auto)' },
                    model: { type: 'string', description: 'Model for selected engine (e.g., gpt-4o)' },
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
          summary: 'Create or replace a file',
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
                    backup: { type: 'boolean' },
                  },
                  required: ['filePath'],
                },
              },
            },
          },
          responses: {
            200: { description: 'File created successfully' },
            400: { description: 'Failed to create file or invalid input' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/list': {
        post: {
          operationId: 'fileListPost',
          summary: 'List files in a directory',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    directory: { type: 'string' },
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
                      files: { type: 'array', items: { type: 'object' } },
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
          summary: 'List files in a directory (query)',
          parameters: [
            { name: 'directory', in: 'query', required: false, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      files: { type: 'array', items: { type: 'object' } },
                    },
                    required: ['files'],
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/update': {
        post: {
          operationId: 'fileUpdate',
          summary: 'Update file content using a pattern replacement',
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
                    backup: { type: 'boolean' },
                    multiline: { type: 'boolean' },
                  },
                  required: ['filePath', 'pattern', 'replacement'],
                },
              },
            },
          },
          responses: {
            200: { description: 'File updated successfully' },
            400: { description: 'Invalid input' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/amend': {
        post: {
          operationId: 'fileAmend',
          summary: 'Append content to an existing file',
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
                    backup: { type: 'boolean' },
                  },
                  required: ['filePath', 'content'],
                },
              },
            },
          },
          responses: {
            200: { description: 'File amended successfully' },
            400: { description: 'Invalid input' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/set-post-command': {
        post: {
          operationId: 'fileSetPostCommand',
          summary: 'Set a post-execution command on the active server handler',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    command: { type: 'string' },
                  },
                  required: ['command'],
                },
              },
            },
          },
          responses: {
            200: { description: 'Post command set successfully' },
            400: { description: 'Invalid input' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/file/diff': {
        post: {
          operationId: 'fileApplyDiff',
          summary: 'Apply a unified diff using git apply',
          description: 'Validates with `git apply --check`, then applies with `git apply`. Local handler only.',
          'x-openai-isConsequential': filesConsequential,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    diff: { type: 'string' },
                    dryRun: { type: 'boolean' },
                    whitespaceNowarn: { type: 'boolean' },
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
          description: 'Generates a minimal unified diff for the target file and applies it with git apply. Local handler only.',
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
                    all: { type: 'boolean' },
                    startLine: { type: 'integer' },
                    endLine: { type: 'integer' },
                    dryRun: { type: 'boolean' },
                    whitespaceNowarn: { type: 'boolean' },
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
      '/shell/session/start': {
        post: {
          operationId: 'startShellSession',
          summary: 'Start a new persistent shell session',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    shell: { type: 'string' },
                    env: { type: 'object' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Session started successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      startedAt: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/{id}/exec': {
        post: {
          operationId: 'executeShellSessionCommand',
          summary: 'Execute command inside existing session',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    command: { type: 'string' },
                  },
                  required: ['command'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Command executed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      stdout: { type: 'string' },
                      stderr: { type: 'string' },
                      exitCode: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/{id}/stop': {
        post: {
          operationId: 'stopShellSession',
          summary: 'Stop a persistent shell session',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Session stopped successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/list': {
        get: {
          operationId: 'listShellSessions',
          summary: 'List active shell sessions',
          responses: {
            200: {
              description: 'List of active sessions',
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
                            id: { type: 'string' },
                            shell: { type: 'string' },
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
      '/shell/session/{id}/logs': {
        get: {
          operationId: 'getShellSessionLogs',
          summary: 'Fetch logs from a shell session',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'since', in: 'query', required: false, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Session logs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      logs: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            timestamp: { type: 'string' },
                            command: { type: 'string' },
                            stdout: { type: 'string' },
                            stderr: { type: 'string' },
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
                    properties: {
                      server: {
                        type: 'object',
                        properties: {
                          port: {
                            type: 'object',
                            properties: {
                              value: { type: 'number' },
                              readOnly: { type: 'boolean' }
                            }
                          }
                        }
                      },
                      security: {
                        type: 'object',
                        properties: {
                          apiToken: {
                            type: 'object',
                            properties: {
                              value: { type: 'string' },
                              readOnly: { type: 'boolean' }
                            }
                          }
                        }
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
    const staticJson = readPublicFileIfExists('openapi.json');
    if (staticJson) {
      try {
        return res.json(JSON.parse(staticJson));
      } catch {
        // fall through to dynamic builder if static file is invalid
      }
    }
    res.json(buildSpec(req));
  });

  app.get('/openapi.yaml', (req, res) => {
    const staticYaml = readPublicFileIfExists('openapi.yaml');
    if (staticYaml) {
      return res.type('application/yaml').send(staticYaml);
    }
    const yaml = yamlStringify(buildSpec(req));
    res.type('application/yaml').send(yaml);
  });
}

/** Backward-compatible export name (some imports use camel-case Api). */
export const registerOpenApiRoutes = registerOpenAPIRoutes;
