import express, { Request } from 'express';

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

/** Minimal JSON -> YAML with correct indentation for arrays/objects and inline empty arrays. */
function jsonToYaml(value: any, indent = 0): string {
  const pad = '  '.repeat(indent);
  const str = (s: string) => JSON.stringify(s);

  if (value === null) return 'null';

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((item) => {
        const rendered = jsonToYaml(item, indent + 1);
        if (rendered.includes('\n')) {
          const [first, ...rest] = rendered.split('\n');
          const tail = rest.map(l => '  '.repeat(indent + 1) + l).join('\n');
          return tail ? `${pad}- ${first}\n${tail}` : `${pad}- ${first}`;
        }
        return `${pad}- ${rendered}`;
      })
      .join('\n');
  }

  switch (typeof value) {
    case 'string': return str(value);
    case 'number': return String(value);
    case 'boolean': return value ? 'true' : 'false';
    case 'object': {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      return entries.map(([k, v]) => {
        if (v === null) return `${pad}${k}: null`;
        if (Array.isArray(v)) {
          if (v.length === 0) return `${pad}${k}: []`;
          const arr = jsonToYaml(v, indent + 1);
          return arr.includes('\n') ? `${pad}${k}:\n${arr}` : `${pad}${k}: ${arr}`;
        }
        if (typeof v === 'object') {
          const obj = jsonToYaml(v, indent + 1);
          return `${pad}${k}:\n${obj}`;
        }
        // scalar
        return `${pad}${k}: ${jsonToYaml(v, indent + 1).trim()}`;
      }).join('\n');
    }
    default:
      return str(String(value));
  }
}

/** Build the OpenAPI object; derive servers[] from the actual request unless PUBLIC_BASE_URL is set. */
function buildSpec(req?: Request) {
  const baseUrl = getPublicBaseUrl(req);

  // NOTE: keep summaries and shapes aligned with routes; tests only require presence.
  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'gpt-terminal-plus API',
      version: '0.1.0',
      description: 'Runtime OpenAPI surface for listing servers and executing commands/code/LLM.',
    },
    servers: [
      { url: baseUrl, description: 'Runtime base URL' },
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
    security: [ { bearerAuth: [] as any[] } ],
    paths: {
      '/server/list': {
        get: {
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
          security: [ { bearerAuth: [] as any[] } ],
        },
      },
      '/command/execute': {
        post: {
          summary: 'Execute a command',
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
          security: [ { bearerAuth: [] as any[] } ],
        },
      },
      '/command/execute-code': {
        post: {
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
          security: [ { bearerAuth: [] as any[] } ],
        },
      },
      '/command/execute-file': {
        post: {
          summary: 'Execute a file present on the server/target',
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
          security: [ { bearerAuth: [] as any[] } ],
        },
      },
      '/command/execute-llm': {
        post: {
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
          security: [ { bearerAuth: [] as any[] } ],
        },
      },
    },
  };

  return spec;
}

/** Register dynamic OpenAPI routes. */
export function registerOpenAPIRoutes(app: express.Application): void {
  app.get('/openapi.json', (req, res) => {
    res.json(buildSpec(req));
  });

  app.get('/openapi.yaml', (req, res) => {
    const yaml = jsonToYaml(buildSpec(req));
    res.type('application/yaml').send(yaml + '\n');
  });
}

/** Backward-compatible export name (some imports use camel-case Api). */
export const registerOpenApiRoutes = registerOpenAPIRoutes;
