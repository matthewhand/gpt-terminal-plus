import express, { Request } from 'express';
import { stringify as yamlStringify } from 'yaml';
import fs from 'fs';
import path from 'path';

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

/** Attempt to read a static OpenAPI artifact from public/, else return null. */
function readPublicFileIfExists(filename: 'openapi.json' | 'openapi.yaml'): string | null {
  try {
    const filePath = path.resolve(process.cwd(), 'public', filename);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  } catch {
    return null;
  }
}

/** Build the OpenAPI object; derive servers[] from the actual request unless PUBLIC_BASE_URL is set. */
function buildSpec(req?: Request) {
  const baseUrl = getPublicBaseUrl(req);

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
      '/command/execute-file': {
        post: {
          operationId: 'executeFile',
          summary: 'Execute a file present on the server/target (deprecated)',
          deprecated: true,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filename: { type: 'string' },
                    directory: { type: 'string' },
                    timeoutMs: { type: 'integer' },
                  },
                  required: ['filename'],
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
      '/activity/list': {
        get: {
          operationId: 'activityList',
          summary: 'List recent activity sessions',
          parameters: [
            {
              in: 'query',
              name: 'date',
              required: false,
              schema: { type: 'string', format: 'date' },
              description: 'Date in YYYY-MM-DD format (defaults to recent days)',
            },
            {
              in: 'query',
              name: 'limit',
              required: false,
              schema: { type: 'integer', default: 50 },
              description: 'Limit number of sessions returned',
            },
            {
              in: 'query',
              name: 'type',
              required: false,
              schema: { type: 'string' },
              description: 'Filter by execution type',
            },
          ],
          responses: {
            200: {
              description: 'Sessions retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          sessions: { type: 'array', items: { type: 'object' } },
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
            {
              in: 'path',
              name: 'date',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Date in YYYY-MM-DD format',
            },
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'Session ID',
            },
          ],
          responses: {
            200: {
              description: 'Session retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          meta: { type: 'object' },
                          steps: { type: 'array', items: { type: 'object' } },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Session not found' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/start': {
        post: {
          operationId: 'shellSessionStart',
          summary: 'Start a new persistent shell session',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    shell: { type: 'string', description: 'The shell to use (e.g., "bash", "powershell")' },
                    env: { type: 'object', description: 'Environment variables for the session' },
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
                      startedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            501: { description: 'Not implemented' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/{id}/exec': {
        post: {
          operationId: 'shellSessionExec',
          summary: 'Execute command inside existing session',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The ID of the session',
            },
          ],
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
              description: 'Command executed successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ExecutionResult' },
                },
              },
            },
            501: { description: 'Not implemented' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/{id}/stop': {
        post: {
          operationId: 'shellSessionStop',
          summary: 'Stop a persistent shell session',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The ID of the session',
            },
          ],
          responses: {
            200: {
              description: 'Session stopped successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { success: { type: 'boolean' } },
                  },
                },
              },
            },
            501: { description: 'Not implemented' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/list': {
        get: {
          operationId: 'shellSessionList',
          summary: 'List active shell sessions',
          responses: {
            200: {
              description: 'List of active sessions',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      sessions: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
            501: { description: 'Not implemented' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
      },
      '/shell/session/{id}/logs': {
        get: {
          operationId: 'shellSessionLogs',
          summary: 'Fetch logs from a shell session',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'The ID of the session',
            },
            {
              in: 'query',
              name: 'since',
              required: false,
              schema: { type: 'string' },
              description: 'Cursor/timestamp to fetch logs from',
            },
          ],
          responses: {
            200: {
              description: 'Session logs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      logs: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
            501: { description: 'Not implemented' },
          },
          security: [{ bearerAuth: [] as any[] }],
        },
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
