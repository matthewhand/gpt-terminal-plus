/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const { stringify: yamlStringify } = require('yaml');

function getPublicBaseUrl() {
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl && /^https?:\/\//i.test(envUrl)) return envUrl.replace(/\/+$/, '');
  const protocol = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
  const port = process.env.PORT ? Number(process.env.PORT) : 3100;
  const host = process.env.PUBLIC_HOST || 'localhost';
  return `${protocol}://${host}:${port}`;
}

function main() {
  const baseUrl = getPublicBaseUrl();

  const options = {
    definition: {
      openapi: '3.1.0',
      info: {
        title: 'gpt-terminal-plus API',
        version: '0.1.0',
        description: 'OpenAPI generated from JSDoc annotations.',
      },
      servers: [{ url: baseUrl, description: 'Public base URL' }],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'API_TOKEN' },
        },
      },
    },
    apis: [
      path.resolve(process.cwd(), 'src/**/*.ts'),
      path.resolve(process.cwd(), 'src/**/*.js'),
    ],
  };

  console.log('Generating OpenAPI from JSDoc...');
  const spec = swaggerJsdoc(options);

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const jsonPath = path.join(publicDir, 'openapi.json');
  const yamlPath = path.join(publicDir, 'openapi.yaml');

  fs.writeFileSync(jsonPath, JSON.stringify(spec, null, 2), 'utf8');
  fs.writeFileSync(yamlPath, yamlStringify(spec), 'utf8');

  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${yamlPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('Failed to generate OpenAPI:', err);
    process.exit(1);
  }
}

module.exports = { getPublicBaseUrl };
