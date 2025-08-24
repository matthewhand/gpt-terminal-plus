# GPT Terminal Plus

A modular terminal server with pluggable engines (shells, file ops, LLMs) and a WebUI for configuration.

---

## ✨ Features

- 🔧 Execution Engines: local shell, remote shell (SSH/SSM), file ops, LLM planning
- 🤖 LLM Engines: Codex, Interpreter, Ollama
- 🛡️ Automation: full-auto, ask-to-approve, YOLO toggle (dangerous)
- 🌐 WebUI: `/settings.html` with engine panels + Advanced JSON overrides
- 🧰 General settings: localhost toggle, file ops, SSH/SSM targets, allowed shells
- 📜 Live OpenAPI preview on the settings page
- ⚙️ Config: Convict-backed schema, `.env` overrides, future `/config/override`, `/config/schema`

---

## 🚀 Usage

### Start Server
```bash
npm start
```

### Configure via WebUI
Visit `http://localhost:PORT/settings.html`.

- Choose LLM Engine: Codex, Interpreter, or Ollama
- Fill engine panel fields; use Advanced Overrides for any key
- Submit to send JSON to `/config/override` (if implemented)
- Toggle General Settings and watch the OpenAPI preview update in real time

### Example LLM Configs

Codex
```json
{
  "LLM_ENGINE": "codex",
  "CODEX_MODEL": "gpt-5",
  "CODEX_FULL_AUTO": true,
  "CODEX_CONFIG": { "model_reasoning_effort": "high" }
}
```

Interpreter
```json
{
  "LLM_ENGINE": "interpreter",
  "INTERPRETER_MODEL": "gpt-4o",
  "INTERPRETER_AUTO_RUN": true,
  "INTERPRETER_TEMPERATURE": 0.7,
  "INTERPRETER_CONTEXT_WINDOW": 8192,
  "INTERPRETER_MAX_TOKENS": 2048,
  "INTERPRETER_SAFE_MODE": "auto"
}
```

Ollama
```json
{
  "LLM_ENGINE": "ollama",
  "OLLAMA_MODEL": "llama2",
  "OLLAMA_HOST": "http://localhost:11434",
  "OLLAMA_FORMAT": "text",
  "OLLAMA_NOWORDWRAP": false,
  "OLLAMA_VERBOSE": false
}
```

---

## Quick start
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

---

## 🔒 Authentication
- API uses bearer token (see `.env` or generated on start)
- WebUI management: set custom API key via `/settings.html`
  - Type custom key or click “Generate” (32 chars, alphanumeric)
  - Overrides temporary token, updates in-memory config immediately
  - Token is always redacted in settings responses as `[REDACTED]`
- `/healthz` is public; most routes require token

---

## 📚 Related Docs
- [AGENTS.md](./AGENTS.md) — engine details, session behavior, config examples
- [PACKAGE.md](./PACKAGE.md) — release notes and packaging

---

## 🧯 Circuit Breakers for Full Auto Mode

To prevent runaway cost or output floods in Full Auto / YOLO modes, runtime limits are enforced:

- Input: requests exceeding `MAX_INPUT_CHARS` are rejected (or truncated if allowed).
- Output: combined stdout+stderr is clipped at `MAX_OUTPUT_CHARS` with termination.
- Sessions: `/shell/session/*` enforces `MAX_SESSION_DURATION` and `MAX_SESSION_IDLE`.
- Budget: when `MAX_LLM_COST_USD` is set, new LLM requests are rejected once exceeded.

All terminations return partial output with flags: `truncated: true`, `terminated: true`.