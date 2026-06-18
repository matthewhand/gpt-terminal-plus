# Vision

GPT Terminal Plus is a **secure, multi-protocol execution platform** with optional AI augmentation, built primarily to power Custom GPT "Actions" (and similar LLM tool-use interfaces) but fully usable as a standalone DevOps/automation tool with a web UI.

## Core Vision

- **Unified execution surface**: Run shell commands, scripts, code snippets, and file operations across **local**, **SSH**, and **AWS SSM** targets through a single, consistent API and UI.
- **AI as a powerful optional layer**: LLM features (chat, command planning, error analysis, intelligent routing) are cleanly gated. The system works perfectly with zero AI configured.
- **Security and safety first**: Bearer token auth, path sanitization, command allow/deny policies, rate limiting, resource guards, and redacted configuration. Never trust the caller.
- **Static-first, deterministic APIs**: OpenAPI specs are generated at build time and served statically for reliability in LLM tool calling scenarios.
- **Developer and operator friendly**: Rich web UI (shell, settings, LLM console), excellent observability hooks, and clear extension points.
- **Evolvable architecture**: Handlers abstract the target, routes stay thin, configuration is validated (Convict), and side effects are explicitly managed.

The long-term goal is a **robust AI-assisted DevOps and automation toolkit** that lets humans (and agents) safely do real work on real machines with minimal friction and maximum auditability.

## Honest Assessment: What Is Built Today

**Solidly implemented and exercised:**

- Server abstraction (Local, SSH, SSM handlers) with selection via global state / ServerManager.
- Command execution surface (execute, execute-shell, execute-code, execute-bash, execute-python, execute-llm + dynamic executor routes).
- File operations (create, read, update, list, fuzzy patch, diff, etc.) with path safety.
- LLM integration: multiple providers (OpenAI, Ollama, LM Studio), streaming chat, basic error advisor/analysis.
- Web UI: dashboard, settings (redacted), shell sessions, LLM console, login, endpoint status, etc. (static HTML + client-side fetch).
- Authentication, rate limiting, safety policies (confirm/deny regex), circuit breakers / limits in some paths.
- Configuration: Convict schema, env overrides, redacted `/settings` endpoint, runtime overrides.
- Deterministic OpenAPI + Swagger at `/docs`.
- Comprehensive test suite (unit + integration + Playwright e2e for UI pages) with recent quality improvements (bootstrap wrapper for side effects, shared test app helpers, global state resets, denser e2e interactions).
- Basic MCP tool exposure (in progress).
- Auto-detection of executors (shells, python, node, etc.).

**What remains / is partial (see also ROADMAP.md and TODO.md):**

- Consistent production auth on all `/command/*` and some chat paths in certain mounting scenarios (security gap noted in TODO).
- Full delegation in file routes: some local paths still do direct fs instead of always going through the selected `ServerHandler`.
- MCP modernization (SDK upgrade, Streamable HTTP preferred over SSE, proper tool result shapes, slash name handling).
- Advanced AI capabilities (deeper error root-cause, auto-remediation with guards, RAG over past runs, multi-step diagnosis).
- Stronger sandboxing (containers/VMs per request, resource limits, ephemeral fs).
- Multi-server management dashboard and bulk ops (current selection is single-server focused).
- Complete streaming backpressure, observability (structured logs, metrics, tracing), and reliability features.
- SDKs, more deployment profiles (full serverless, Helm, etc.), and production hardening (SOC2-level concerns).
- Some orphaned route files and cleanup (mount-or-delete pass).
- Versioning, release process, and broader provider support.

The core "execute things safely on a chosen machine, optionally with LLM help" is production-usable today. The ambitious AI + multi-target DevOps platform parts are partially realized and actively evolving.

## Architectural History (Legacy / Archived)

Earlier versions of this project went through several significant refactors:

- **Engines era**: Logic lived under `src/engines/` with different separation (fileEngine, llmEngine, etc.). Note: some engine modules (`src/engines/{fileEngine,llmEngine,remoteEngine}.ts`) still remain in the tree behind unmounted routers (`src/routes/{files,remote}.ts`) — a pending mount-or-delete decision, not yet fully removed.
- **Heavy top-level side effects**: Much of the Express setup, ngrok, config, middleware registration happened at module load time. Tests relied heavily on `jest.resetModules()`, cache deletion tricks, and mocks.
- **Direct Local assumptions**: Many routes (especially file) hard-coded `LocalServerHandler` or direct `fs` operations instead of routing through the abstract handler for the selected server.
- **Test bloat and generated artifacts**: Large numbers of compiled `.d.ts`/`.js.map` files and offline/legacy test copies were present in the tree. Many low-density "smoke" or "require not throw" tests existed.
- **Different UI and transport approaches**: Past experiments included more WebSocket-centric shells and different session persistence models (`.sessions.json`).
- **MCP and chat evolution**: Early MCP used older SDK patterns; chat streaming and tool use have been iterated.

These historical approaches are documented in the [docs/archived/](./archived/) directory (session notes, old test reports, patch files, previous IMPLEMENTATION notes, etc.). The current architecture favors:

- Explicit `bootstrap()` for former top-level effects.
- Thin routes + rich handlers + actions.
- Selected server abstraction everywhere possible.
- High-quality tests + Playwright static-UI e2e (no live server dependency for UI smoke).
- Static OpenAPI + Convict config.

See `docs/DESIGN_*.md`, `docs/DEVELOPMENT.md`, and source comments for more on current principles.

## How to Help / Next

- Run `npm test`, `npm run lint`, `npm run build`.
- See [TODO.md](../TODO.md) and [docs/ROADMAP.md](./ROADMAP.md) for active items.
- All changes should be small, focused, relative imports, with tests/lint passing (per AGENTS.md).

This document should be the "front and centre" reference for what we are building and where we actually are.
