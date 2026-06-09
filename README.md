# gpt-terminal-plus

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](tsconfig.json)

A self-hosted **terminal and agent API server**. It exposes shell command execution, code execution, file operations, and optional LLM-assisted execution over a Bearer-token-protected REST API — against your local machine, or remote hosts via **SSH** and **AWS SSM**.

Use it two ways:

- **As a ChatGPT Custom GPT action** — paste the generated OpenAPI spec into a Custom GPT and give ChatGPT a real terminal.
- **As an HTTP API / MCP server for agentic frameworks** — any OpenAPI-aware agent framework can drive it; an experimental MCP endpoint is included (see [Roadmap](#roadmap)).

> **New here? Start with the [User Guide with screenshots](docs/USER_GUIDE.md)** — a full walkthrough from first start to auditing what your agent did.

## What works today

| Area | Status | Notes |
| --- | --- | --- |
| Shell command execution | Works | `POST /command/execute-shell` and friends, with deny/confirm regex policies |
| Code execution | Works | `POST /command/execute-code` (interpreter per language), gated by `ENABLE_CODE_EXECUTION` |
| File operations | Works | list/read/create/update, diff/patch (including fuzzy patch) under `/file` |
| Remote targets | Works | Local, SSH (`ssh2`), and AWS SSM handlers; register/select servers under `/server` |
| ChatGPT Custom GPT action | Works | Static OpenAPI artifacts + `/.well-known/ai-plugin.json` manifest |
| LLM-assisted execution | Works (optional) | `execute-llm` plans/runs commands; AI error analysis on failures; providers: Ollama, LM Studio, OpenAI-compatible |
| Chat streaming | Works | `/chat` SSE streaming with heartbeats, `/model` selection |
| Web UI | Works | Landing page, dashboard, redacted settings viewer, LLM console, activity audit (in `public/`) |
| Activity audit log | Works | Every execution logged as a session under `data/activity/`, browsable via `/activity/list` |
| Auth | Works | Single Bearer `API_TOKEN` (auto-generated at startup if unset) |
| MCP server | Experimental | `USE_MCP=true` mounts an MCP endpoint, but it targets an older SDK/transport — being modernized (see Roadmap) |
| Interactive shell sessions | Not implemented | `/shell/session` routes are stubs returning 501 |

## Quickstart

### npm

```bash
git clone https://github.com/matthewhand/gpt-terminal-plus.git
cd gpt-terminal-plus
npm ci
npm run build          # also regenerates OpenAPI artifacts
API_TOKEN=$(openssl rand -base64 32) npm start
```

Then open `http://localhost:5005/`:

- Swagger UI at `/docs` (serves the static `public/openapi.json`)
- Dashboard and settings UI from the landing page
- All non-public endpoints require `Authorization: Bearer $API_TOKEN`

Smoke test:

```bash
curl -X POST http://localhost:5005/command/execute-shell \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"command": "uname -a"}'
```

### Docker

```bash
docker build -t gpt-terminal-plus -f docker/Dockerfile.base .
docker run -p 5005:5005 -e API_TOKEN=your-secret gpt-terminal-plus
# or, with a .env file in docker/:
docker compose -f docker/docker-compose.yml up
```

See [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md) and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (Fly.io, Vercel, ngrok tunnelling) for more.

## Use with ChatGPT (Custom GPT action)

1. Deploy somewhere ChatGPT can reach (public HTTPS URL; set `PUBLIC_BASE_URL` so `servers[0].url` in the spec is correct).
2. Create a Custom GPT and add an Action using [public/openapi.yaml](public/openapi.yaml) or [public/openapi.json](public/openapi.json).
3. Set Bearer auth with your `API_TOKEN`.

Full guide: [docs/CHATGPT_configuration.md](docs/CHATGPT_configuration.md) and [docs/GPT_ACTION.md](docs/GPT_ACTION.md).

## Configuration

Configuration is validated with [convict](https://github.com/mozilla/node-convict); environment variables override file config, and secrets are redacted in the `/settings` endpoint and UI.

- Copy [.env.sample](.env.sample) to `.env` and fill in values.
- Key variables: `API_TOKEN`, `PORT`, `CORS_ORIGIN`, `ENABLE_CODE_EXECUTION`, `DENY_COMMAND_REGEX`, `CONFIRM_COMMAND_REGEX`, `USE_MCP`, plus LLM provider settings (`AI_PROVIDER`, `OLLAMA_BASE_URL`, `OPENAI_API_KEY`, ...).
- Full schema and mapping: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) and [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Security notes

This server executes shell commands by design. Treat it accordingly:

- **Always set a strong `API_TOKEN`** (`openssl rand -base64 48`). If unset, one is generated and printed at startup.
- All execution routes require `Authorization: Bearer <API_TOKEN>`.
- Use `DENY_COMMAND_REGEX` / `CONFIRM_COMMAND_REGEX` to block or gate dangerous commands.
- Run it as an unprivileged user, in a container, or against disposable hosts. There is **no per-request sandboxing yet** (see Roadmap).
- Put it behind HTTPS (`HTTPS_ENABLED` + cert paths, or a reverse proxy) before exposing it to the internet.

## Development

```bash
npm test            # jest (uses config/test/)
npm run lint        # eslint over src/
npm run build       # tsc + regenerate OpenAPI artifacts
npm run docs:screenshots   # regenerate User Guide screenshots via Playwright
```

OpenAPI artifacts are generated deterministically from JSDoc by [scripts/generate-openapi.cjs](scripts/generate-openapi.cjs) and committed in `public/`. Lint them with `npm run openapi:lint`.

Contributions welcome — see [docs/CONTRIBUTION.md](docs/CONTRIBUTION.md).

## Documentation

- [User Guide (with screenshots)](docs/USER_GUIDE.md)
- [API reference](docs/API.md) · [File API](docs/FILE_API.md) · [Execution guide](docs/EXECUTION_GUIDE.md)
- [Environment variables](docs/ENVIRONMENT.md) · [Configuration](docs/CONFIGURATION.md)
- [Installation](docs/INSTALLATION.md) (npm, Docker, Fly.io) · [Deployment](docs/DEPLOYMENT.md)
- [LLM console](docs/LLM_CONSOLE.md) · [AI delegation](docs/AI_DELEGATION.md)
- [FAQ](docs/FAQ.md)

## License

[MIT](LICENSE) © Matthew Hand

## Roadmap

Summary of unfinished work; the full version lives in [docs/ROADMAP.md](docs/ROADMAP.md).

- [ ] **MCP server modernization** (currently experimental behind `USE_MCP=true`)
  - [ ] Upgrade `@modelcontextprotocol/sdk` and replace the deprecated SSE transport (Streamable HTTP)
  - [ ] Rename tools to spec-valid names (no `/` characters)
  - [ ] Return real handler results instead of synthetic response objects
  - [ ] Implement `server/set` tool properly
- [ ] **Interactive shell sessions**
  - [ ] Replace the 501 stubs in `/shell/session` with real PTY-backed sessions
  - [ ] Session lifecycle (start/exec/logs/stop) and audit integration
- [ ] **Execution safety and sandboxing**
  - [ ] Per-request resource limits, timeout/kill escalation
  - [ ] Optional container sandbox per request
  - [ ] Output redaction for secrets
- [ ] **AI error analysis, phases 2–3**
  - [ ] Root-cause heuristics (env, permissions, PATH, network) with confidence scoring
  - [ ] Guarded auto-remediation with dry-run, allowlists, and rollback
- [ ] **Provider ecosystem**
  - [ ] Per-model capability matrix and automatic provider selection
  - [ ] Streaming backpressure, retries, circuit breakers
- [ ] **Developer experience**
  - [ ] Unified `/exec` endpoint (command/code/file)
  - [ ] TypeScript and Python client SDKs
- [ ] **Reliability and observability**
  - [ ] Dockerized E2E tests with real providers
  - [ ] Structured logs and per-request tracing IDs
