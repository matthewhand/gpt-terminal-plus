import express, { Request, Response } from 'express';

/** Determine the public base URL for the OpenAPI `servers` stanza. */
export function getPublicBaseUrl(): string {
  // Highest precedence: explicit PUBLIC_BASE_URL
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl && /^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/+$/, '');

  // Next: HTTPS_ENABLED + PORT + PUBLIC_HOST
  const protocol = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
  const port = process.env.PORT ? Number(process.env.PORT) : 3100;
  const host = process.env.PUBLIC_HOST || 'localhost';
  return `${protocol}://${host}:${port}`;
}

/** Helpers for YAML */
function isPlainObject(v: any): v is Record<string, any> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}
function yamlScalar(v: any): string {
  switch (typeof v) {
    case 'string': return JSON.stringify(v); // safe quoting
    case 'number': return Number.isFinite(v) ? String(v) : JSON.stringify(v);
    case 'boolean': return v ? 'true' : 'false';
    default: return v === null ? 'null' : JSON.stringify(v);
  }
}

/**
 * Convert JSON -> YAML with consistent block style for arrays.
 * - Objects: keys on their own line when value is object/array
 * - Arrays: always block sequence
 * This is intentionally minimal but produces valid, clean YAML for our spec.
 */
function jsonToYaml(value: any, indent = 0): string {
  const pad = '  '.repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          return `${pad}-\n${jsonToYaml(item, indent + 1)}`;
        }
        return `${pad}- ${yamlScalar(item)}`;
      })
      .join('\n');
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    return entries
      .map(([k, v]) => {
        if (isPlainObject(v) || Array.isArray(v)) {
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
        }
        return `${pad}${k}: ${yamlScalar(v)}`;
      })
      .join('\n');
  }

  return pad + yamlScalar(value);
}

/** Build the OpenAPI JSON spec based on runtime toggles. */
export function buildOpenAPISpec() {
  const baseUrl = getPublicBaseUrl();

  // feature toggles (can be expanded later)
  const enableExecute = true;
  const enableExecuteCode = true;
  const enableExecuteFile = true;
  const enableExecuteLlm = true;
  const enableServerList = true;

  const paths: Record<string, any> = {};

  if (enableServerList) {
    paths['/server/list'] = {
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
        security: [{ bearerAuth: [] }],
      },
    };
  }

  if (enableExecute) {
    paths['/command/execute'] = {
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
        security: [{ bearerAuth: [] }],
      },
    };
  }

  if (enableExecuteCode) {
    paths['/command/execute-code'] = {
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
        security: [{ bearerAuth: [] }],
      },
    };
  }

  if (enableExecuteFile) {
    paths['/command/execute-file'] = {
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
        security: [{ bearerAuth: [] }],
      },
    };
  }

  if (enableExecuteLlm) {
    paths['/command/execute-llm'] = {
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
        security: [{ bearerAuth: [] }],
      },
    };
  }

  return {
    openapi: '3.0.3',
    info: {
      title: 'gpt-terminal-plus API',
      version: '0.1.0',
      description:
        'Runtime OpenAPI surface for listing servers and executing commands/code/LLM.',
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
    security: [{ bearerAuth: [] }],
    paths,
  };
}

/** Register dynamic OpenAPI endpoints (/openapi.json and /openapi.yaml). */
export function registerOpenAPIRoutes(app: express.Application): void {
  app.get('/openapi.json', (_req: Request, res: Response) => {
    const spec = buildOpenAPISpec();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(spec);
  });

  const sendYaml = (_req: Request, res: Response) => {
    const spec = buildOpenAPISpec();
    const yaml = jsonToYaml(spec, 0) + '\n';
    res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
    res.status(200).send(yaml);
  };

  // Both aliases for convenience
  app.get('/openapi.yaml', sendYaml);
  app.get('/openai.yaml', sendYaml);
}

export const registerOpenApiRoutes = registerOpenAPIRoutes;
