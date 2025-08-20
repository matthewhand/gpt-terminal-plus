# GPT Terminal Plus

Static-first OpenAPI artifacts with deterministic generation, an Express server with Convict-based configuration and secure redacted settings endpoint, plus a minimal web UI.

- OpenAPI (static artifacts):
  - [public/openapi.json](public/openapi.json)
  - [public/openapi.yaml](public/openapi.yaml)
  - Swagger UI: GET [/docs](/docs)
- Settings UI (redacted):
  - [public/settings.html](public/settings.html)
  - Protected by HTTP Bearer auth using `API_TOKEN`
- Environment and configuration:
  - [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
- Plugin Manifest:
  - GET [/.well-known/ai-plugin.json](/.well-known/ai-plugin.json)

## Quick Start

### 1. Install and Build
```bash
npm ci
npm run build
npm start
```

### 2. Access Interfaces
- **Admin Panel**: http://localhost:5004/admin (credentials in console)
- **API Docs**: http://localhost:5004/docs (Swagger UI)
- **Health Check**: http://localhost:5004/health

### 3. Production Deployment
```bash
./scripts/deploy.sh fly     # Deploy to Fly.io
./scripts/deploy.sh vercel  # Deploy to Vercel
./scripts/deploy.sh docker  # Build Docker image
```

### 4. ChatGPT Integration
- Use OpenAPI spec: [/openapi.json](/openapi.json) or [/openapi.yaml](/openapi.yaml)
- Follow setup guide: [docs/GPT_ACTION.md](docs/GPT_ACTION.md)
- Auth header: `Authorization: Bearer YOUR_API_TOKEN`

## Features

✅ **AdminJS Interface** - Complete settings and server management  
✅ **Multi-Server Support** - Local, SSH, AWS SSM execution  
✅ **File Operations** - Create, read, patch, diff with git integration  
✅ **AI Delegation** - Route tasks to specialized LLMs  
✅ **Secure Authentication** - Auto-generated admin credentials  
✅ **Production Ready** - 361+ tests, comprehensive security  
✅ **ChatGPT Integration** - Ready-to-use Custom GPT Actions  

Deterministic OpenAPI generation
- Generated from JSDoc via [scripts/generate-openapi.cjs](scripts/generate-openapi.cjs)
- Artifacts are committed in [public/openapi.json](public/openapi.json) and [public/openapi.yaml](public/openapi.yaml)
- Swagger UI at [/docs](/docs) is configured to load the static JSON to avoid runtime non-determinism

Configuration
- Validated with Convict; env vars override defaults; secrets are redacted in the settings endpoint
- Full schema, environment mapping, and examples: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)

Development
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`
- Showcase script: [scripts/capture_showcase.sh](scripts/capture_showcase.sh)

CI (recommended)
- OpenAPI lint: `npx @redocly/cli@latest lint public/openapi.yaml`
- Add a CI job to run:
  - `npm ci`
  - `npm run lint`
  - `npm test`
  - `npm run openapi:lint` (see below)

Package scripts of interest
- Generate OpenAPI artifacts: `npm run openapi:generate` (runs on postbuild and prestart)

Notes
- When deploying behind a proxy, set `PUBLIC_BASE_URL` to ensure OpenAPI `servers[0].url` is correct
- Do not log secrets; examples use placeholders like `${OPENAI_API_KEY}`
- [x] executeShell (bash) works

## Windows Binary

You can run GPT Terminal Plus without Node.js by using prebuilt Windows binaries.

- x64: `jit-win-x64.exe`
- arm64: `jit-win-arm64.exe`

Build locally:

```bash
npm run build
npm run pkg:win
```

Artifacts will be placed in `release/`.

## Additional Documentation

More details are available in the [docs/](./docs) folder.
