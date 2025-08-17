# TODO

## High Priority
- [ ] **`execute_llm` type: OpenAI-compatible endpoint**
  - Accept config via server/target (all optional): `apiKey`, `model`, `endpoint`.
  - If not provided, **warn** and suggest completing via **WebUI** or **env vars** (advanced).
  - Implement non-stream and SSE stream; add tests with a mocked OpenAI-compatible server.
- [ ] **Open-Interpreter defaults**
  - Default `INTERPRETER_OFFLINE=false` (enable “computer”), `INTERPRETER_VERBOSE=true`.
  - Env overrides respected; prove via tests.
- [ ] **Auth-scoped Server/Target list**
  - Server config supports `allowedTokens: string[]`.
  - `/server/list` returns only servers available to the caller’s token.
  - Admin utilities to rotate tokens safely (no logging of secrets).
- [ ] **OpenAPI & Plugin endpoints**
  - Serve `GET /openapi.json`, `GET /openapi.yaml`, `GET /.well-known/ai-plugin.json`, `GET /docs`.
  - On `npm start`, print those URLs.
  - CI step to **lint/validate** the spec (e.g., `redocly lint`).

## Execution Runtimes
- [ ] **Python “uv run” engine** (template-constrained)
  - Templates: `name`, `packages`, `python`, `constraints {timeout,memory,network}`, optional `prelude`.
  - `/command/execute-code` supports `engine:"uv"` + `template:"<name>"`.
  - Best-effort network sandbox (Linux: `firejail --net=none`).
  - Tests: skip if `uv` absent; otherwise prove `numpy/pandas` hello world.
- [ ] **Shell runner hardening**
  - Timeouts & output caps configurable per target.
  - Redact secrets in logs by default.

## Settings WebUI
- [ ] MVP panel to configure:
  - LLM providers (Open-Interpreter, Ollama, OpenAI-compatible).
  - Python templates (uv) CRUD with validation.
  - Server/target list with `allowedTokens`.
  - Health checks (“ping provider”, “list models”).
- [ ] **Docs:** env var reference for advanced users (**no secrets in examples**; use `${...}` placeholders).
- [ ] “Add to ChatGPT” instructions (point to `/openapi.json` or `/openapi.yaml`).

## LLM Provider Plumbing
- [ ] Implement `execute_llm(openaiCompat)` (non-stream & stream).
- [ ] Model suggestion endpoints for Ollama/LmStudio if available.
- [ ] Retry/backoff on transient provider errors with clear messages.

## Dockerized Runtimes (future)
- [ ] **Ollama in Docker**
  - Image: `ollama/ollama:latest`
  - Map model cache & expose `11434`
  - Settings UI toggle “docker mode”
  - Auto-set `OLLAMA_HOST=http://127.0.0.1:11434` for local-docker target
- [ ] **Open Interpreter in Docker**
  - Minimal image running interpreter server (exposes `:8000`)
  - Target via `INTERPRETER_SERVER_HOST`/`INTERPRETER_SERVER_PORT`
  - Settings UI toggle “docker mode”

## Nice-to-haves
- [ ] Model suggestions per provider (Ollama `/api/tags`)
- [ ] Log viewer for provider streams
- [ ] Retry/backoff on transient errors
- [ ] makePlan toggle for execute-llm (OFF by default)
- [ ] /execute can run multiple modes concurrently; server-side toggles can override client config
- [ ] Add LLM error analysis/feedback for execute_shell & execute_code (name/perm diagnostics)
- [ ] Research parity: Open-Interpreter & Ollama support for tools/personas/templates

## `execute` command v2 (flex args + defaults)
**Goal:** universal `execute` supporting KV or positional args, persistent defaults, and `listModes`.
- Defaults via `set_default`: `modes`, `shell`, `pythonEngine`, `remote`
- Modes: `shell` (bash on POSIX, powershell on Windows), `python` (default engine python3)
- Remote: `{ protocol: "local" | "ssh" | "ssm", host?, user? }`
- Back-compat: legacy `{ "command": "echo ok" }` keeps returning `aiAnalysis` on non-zero exit

## Execution Environments (Python via uv-run)
- [ ] Add **python template environments** (constraints + allowed modules) executed via `uv run`.
- [ ] Templates selectable per server(/target) and per request; default locked-down stdlib.
- [ ] Cache/resolve templates locally with checksum pinning; deny network/file writes unless toggled.
- [ ] Configurable via WebUI and envvars (documented); audit log of imports/IO.

## LLM: Open Interpreter defaults
- [x] Default `offline=false` and `verbose=true` (overridable by config/env).
- [ ] Surface in WebUI and `/chat/providers` metadata.

## LLM: OpenAI-compatible endpoint provider
- [ ] Add `execute_llm` provider: OpenAI-compatible { apiKey?, model?, endpoint? }.
- [ ] If none provided, warn and direct users to WebUI or env vars (no secrets in logs).
- [ ] WebUI to enter/edit credentials; server-side validation ping.

## WebUI + Docs
- [ ] Settings UI for providers, python templates, server/target ACLs by API token.
- [ ] Document env vars for advanced users (avoid secret leakage; examples use placeholders).
- [ ] Serve OpenAPI at `/openapi.json` and `/openai.yaml`; print URIs on startup.
