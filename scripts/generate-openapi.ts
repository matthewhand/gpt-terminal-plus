import fs from 'fs';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import YAML from 'yaml';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadBaseDefinition(): any {
  const publicDir = path.join(__dirname, '..', 'public');
  const baseFile = path.join(publicDir, 'openapi.yaml');
  let definition: any;

  if (fs.existsSync(baseFile)) {
    const raw = fs.readFileSync(baseFile, 'utf8');
    definition = YAML.parse(raw) ?? {};
  } else {
    definition = {
      openapi: '3.1.0',
      info: {
        title: 'System Info and Command Runner Plugin',
        description:
          'A plugin that allows users to run command line programs after obtaining the system information to accomplish its goal.',
        version: 'v1.1',
      },
      servers: [
        {
          url: 'https://terminal.teamstinky.duckdns.org/',
        },
      ],
    };
  }

  const urlFromEnv = process.env.PUBLIC_SERVER_URL;
  if (urlFromEnv) {
    definition.servers = [{ url: urlFromEnv }];
  } else if (!definition.servers || definition.servers.length === 0) {
    definition.servers = [{ url: 'https://terminal.teamstinky.duckdns.org/' }];
  }

  return definition;
}

(function main() {
  const definition = loadBaseDefinition();

  const options: swaggerJSDoc.Options = {
    // Use existing YAML as the base definition; swagger-jsdoc will merge JSDoc paths/components into it.
    definition,
    apis: ['src/routes/**/*.ts'],
  };

  const spec = swaggerJSDoc(options);

  const outDir = path.join(__dirname, '..', 'public');
  ensureDir(outDir);

  const outFile = path.join(outDir, 'openapi.yaml');
  const yaml = YAML.stringify(spec);
  fs.writeFileSync(outFile, yaml, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`OpenAPI spec generated at: ${outFile}`);
})();