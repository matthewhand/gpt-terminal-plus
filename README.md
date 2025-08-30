# GPT Terminal Plus

Static-first OpenAPI artifacts with deterministic generation, an Express server with Convict-based configuration and secure redacted settings endpoint, plus a minimal web UI.

**🤖 LLM Optional**: The app works perfectly without AI. LLM features are cleanly gated and optional.

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

Quick start
- Install and build:
  - `npm ci`
  - `npm run build` (deterministically regenerates OpenAPI artifacts via postbuild hook)
- Run:
  - `npm start`
- Visit:
  - Swagger UI at [/docs](/docs) (uses static /openapi.json)
  - Settings UI at [public/settings.html](public/settings.html)
- Auth header for protected endpoints:
  - `Authorization: Bearer YOUR_API_TOKEN`

## LLM Configuration (Optional)

The app works without AI, but you can enable LLM features:

1. **Enable LLM**: Set `LLM_ENABLED=true` in environment or via [/llm-setup.html](/llm-setup.html)
2. **Choose Provider**: 
   - **OpenAI**: Set `LLM_PROVIDER=openai` and `OPENAI_API_KEY`
   - **Ollama**: Set `LLM_PROVIDER=ollama` and `OLLAMA_URL=http://localhost:11434`
   - **LM Studio**: Set `LLM_PROVIDER=lmstudio` and `LM_STUDIO_URL=http://localhost:1234/v1`
3. **Test**: Visit [/chat-ui.html](/chat-ui.html) or use `/model` endpoint

**WebUI Setup**: Use [/llm-setup.html](/llm-setup.html) for visual configuration with test button.

Add to ChatGPT (Custom GPT Actions)
- Follow the guide: [docs/CHATGPT_configuration.md](docs/CHATGPT_configuration.md)
- Use the OpenAPI spec:
  - [public/openapi.yaml](public/openapi.yaml)
  - [public/openapi.json](public/openapi.json)
- Ensure the endpoint matches your deployment domain and set `API_TOKEN` consistently.

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
- **⚠️ Deprecation**: `executeFile` is deprecated. Use `/command/execute` with shell commands instead.

Executors (platform-aware starter config)
- The server auto-detects common shells and interpreters on startup (except in tests) and seeds executor settings accordingly.
- Use the capabilities and toggle endpoints under `/command/executors` to inspect and update executors at runtime.
- See docs/EXECUTORS.md for full details on exposure modes (generic vs. specific endpoints), environment overrides, and update APIs.
