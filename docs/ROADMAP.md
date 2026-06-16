# Roadmap

Single source of truth for project status. Supersedes the scattered checklists
that used to live in `TODO.md` (now a thin pointer here).

Legend: `[x]` done and tested · `[ ]` not done · *(partial)* noted inline.
Progress counts reflect the state of `src/` on branch `fix/listfiles-types-defaults`.
This branch completed: listFiles types/defaults + settings schema tests (explicitly attributed); pathSafety + selected server handler reuse for /file/* (list/create/read/fuzzy + 501/400 dispatch); MCP Streamable HTTP (mcpServer.ts + transport removal of SSE); valid MCP tool names + real handler results + file ops exposure + server_set + mcpStreamableHttp.test.ts integration; LLM setup panel (/setup + /setup/llm with toggle/dropdown/fields/save/test-conn + setup.llm.test.ts); CI workflow + tests; command/chat bearer auth + security headers.

---

## Core execution (shell / code / llm)

- [x] Command execution (3/3 prod endpoints mounted)
  - [x] `POST /command/execute-shell` — runs via selected server handler, shell allowlist via `SHELL_ALLOWED` (defaults bash/sh/powershell), shell-escape hardening
  - [x] `POST /command/execute-code` — language → interpreter mapping in `src/routes/command/executeCode.ts`
  - [x] `POST /command/execute-llm` — plan/execute flow with safety confirmation (409 + plan when confirmation required)
- [ ] Unify test vs prod command routing (debt)
  - `src/routes/index.ts` mounts a mock `commandRoutes.ts` harness when `NODE_ENV==='test'` and hand-built routes otherwise — two sources of truth for the same endpoints
- [ ] Unmounted command route files (written but unreachable in prod)
  - [ ] `changeDirectory.ts` — only invoked via MCP wrapper
  - [ ] `executeFile.ts` — slated for deprecation (delegate to shell) — decide and delete or mount
  - [x] `executeSession.ts` — removed in dead-code cleanup (was unreferenced; session design lives in `docs/SESSION_MODE.md`)
  - [ ] `executeShell.ts` (the standalone route file; prod uses `executeCommand` under the `/command/execute-shell` path)
- [ ] Shell sessions (0/5 endpoints implemented — router IS mounted at `/shell/session`, auth-gated, all return 501 to match the OpenAPI spec)
  - [ ] `POST /shell/session/start`
  - [ ] `POST /shell/session/:id/exec`
  - [ ] `POST /shell/session/:id/stop`
  - [ ] `GET /shell/session/list`
  - [ ] `GET /shell/session/:id/logs`
  - [x] Mount `src/routes/shell/session.ts` in `setupApiRouter` (dead wrapper `src/routes/shell/index.ts` removed; stubs return 501 until implemented)
  - [ ] Persistent PTY/process backing store (nothing exists yet; `src/session/` is scaffolding)
- [x] AI error analysis on failure — `analyzeError` attaches `aiAnalysis` to failed exec responses
  - [ ] Make `errorAdvisor` a silent no-op when LLM is disabled (currently always attempts analysis)

## Remote targets (ssh / ssm)

- [x] Handler abstraction — `AbstractServerHandler` with local/ssh/ssm implementations
- [x] Local handler (`src/handlers/local/`) — execute command/code/file, create/read/amend/update file, listFiles with pagination defaults, fuzzy patch, system info
- [x] SSH handler (`src/handlers/ssh/`) — full action set: connect/disconnect, executeCommand/File, create/read/update/amend file, fileExists, getFileContent, transferFile, listFiles, system info
  - [ ] End-to-end verification against a real SSH host (unit-tested only)
- [ ] SSM handler *(partial)* (`src/handlers/ssm/`)
  - [x] executeCommand, create/update/amend file, listFiles, system info, temp-script + retry helpers
  - [x] `SsmServerImplementation.ts.bak` — dead backup file removed (repo hygiene pass on branch `fix/listfiles-types-defaults`)
  - [ ] End-to-end verification against real AWS SSM
- [x] Server selection — `/server/list|set|register|remove`, `setSelectedServerMiddleware`, `initializeServerHandler`
- [ ] Route-layer reuse of selected server *(partial — key gap)*
  - [ ] `GET /file/list` constructs a hard-coded `LocalServerHandler` instead of the selected server's handler (`src/routes/fileRoutes.ts`)
  - [ ] Audit remaining `/file/*` routes so SSH/SSM targets get file ops, not just local

## File ops (incl. fuzzy patch)

- [x] Mounted endpoints (4/4 working)
  - [x] `POST /file/create`
  - [x] `POST /file/read` (optional line range)
  - [x] `GET /file/list` — defaults `directory` to `.`, pagination (`limit`/`offset`), `orderBy` filename|datetime
  - [x] `POST /file/fuzzy-patch` — `applyFilePatch` via diff-match-patch, with `preview` dry-run, rejects when no hunks apply
- [x] listFiles types/defaults finished + settings schema tests (branch `fix/listfiles-types-defaults`)
  (ListParams + toInt/defaults in src/routes/file/listFiles.ts; schema/store tests via setup.llm.test.ts + related)
- [ ] Unmounted file route files (written but not wired into `fileRoutes.ts`)
  - [ ] `amendFile.ts`
  - [ ] `updateFile.ts` (or formally deprecate in favor of fuzzy patch)
  - [ ] `applyDiff.ts` / `applyPatch.ts` / `diff.ts` / `patch.ts` — overlapping patch implementations; consolidate on fuzzy patch, delete the rest
  - [ ] `setPostCommand.ts`
  - [x] `listFiles.ts` (now imported + mounted in fileRoutes.ts; logic uses getServerHandler + pathSafety)
- [x] Path safety — normalize with `path.resolve`, reject traversal outside a configured root
  (src/utils/pathSafety.ts: getWorkingRoot/FILE_OPS_ROOT, resolveSafePath, escapesRelativeRoot; enforced in file/* routes for local/remote; full tests in pathSafety.test.ts + selectedHandler.test.ts)
- [x] Handle symlink/stat errors gracefully in directory listings
  (src/handlers/local/actions/listFiles.ts: lstat/stat catches; continues with isDirectory:false)
- [x] Repo hygiene: delete stray backups (`src/routes/index.ts.bak.*`, `settingsRoutes.tsn`, `file/createFile.ts.bak`, `SsmServerImplementation.ts.bak`) — cleaned on branch `fix/listfiles-types-defaults`

## LLM providers

- [x] Provider clients (3/3): ollama, lmstudio, openai — chat + streaming variants in `src/llm/providers/`
- [x] `llm` block in settings schema (`src/settings/schema.ts`: enabled/provider/model fields, provider enum incl. litellm)
- [x] Env resolver `getResolvedLlmConfig()` — `LLM_ENABLED`, `LLM_PROVIDER`, `LLM_DEFAULT_MODEL`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OLLAMA_URL`, `LM_STUDIO_URL`
- [x] OpenAI provider honors custom `baseURL` (LiteLLM / vLLM / LM Studio compatible)
- [x] `/chat/completions` (+ SSE streaming), `/chat/models`, `/chat/providers`
- [x] `/model` select/list routes
- [ ] Gate chat/model routes when LLM disabled (friendly 409 instead of provider connection errors)
- [ ] Friendly "instance not configured" message for `/command/execute-llm` when no provider reachable
- [ ] Wire settings-store `llm` block into runtime provider selection (config currently env-only at runtime)
- [ ] Later: provider strategy (fallback / round-robin), capability matrix, latency metrics

## WebUI

- [x] Static pages served from `public/` (5 pages: index, dashboard, settings, llm-console, icon/openapi assets)
- [x] LLM console (`llm-console.html` + `/llm/console`, `/llm/query` routes, reads `/activity/list`)
- [x] Activity browsing API (`/activity/list`, session detail) — mounted and token-protected
- [x] Setup UI routes (`/setup`, `/setup/policy`, `/setup/local`, `/setup/ssh`)
- [x] Settings API (`/settings` redacted view, token-protected) + settings page
- [x] User guide with Playwright screenshot pipeline (`npm run docs:screenshots`, `docs/USER_GUIDE.md`)
- [x] Setup → LLM panel: enable toggle, provider dropdown (none/ollama/lmstudio/openai), per-provider fields + Save/Test connection (/chat/models) with feedback + redaction. Persisted via SettingsStore (setupRoutes.ts + /setup/llm); /settings reflects for auto-hide; UI links from llm-console.html/dashboard.html. Full tests in setup.llm.test.ts.
- [ ] Settings panel MVP: server/target CRUD with `allowedTokens`, provider health checks ("ping provider", "list models")
- [ ] Stretch: runtime config editing (env-overridden fields shown read-only)

## MCP integration

Status: implemented Feb 2025, now outdated and non-functional in practice. Tracked as the modernization workstream.
**Update (branch `fix/listfiles-types-defaults` work):** Streamable HTTP transport, spec-valid tool names (no `/`), real results (no fake res), server_set impl, file ops tools (create_file/read_file/list_files/fuzzy_patch_file), and integration test with current MCP SDK client now complete.

- [x] Opt-in bootstrap (`USE_MCP=true` in `src/index.ts`) registering tools from `src/modules/mcpTools.ts`
- [x] Upgrade `@modelcontextprotocol/sdk` from `^1.4.1` and migrate **SSE transport → Streamable HTTP** (src/modules/mcpServer.ts: StreamableHTTPServerTransport, POST/GET/DELETE /mcp, mcp-session-id sessions; index.ts wiring; no more /mcp/messages).
- [x] Fix invalid tool names — names like `command/execute` contain `/`, violating the spec pattern `^[a-zA-Z0-9_-]{1,64}$` (mcpTools.ts: execute_command etc.; mcpStreamableHttp.test.ts asserts names + /^[a-zA-Z0-9_-]{1,64}$/).
- [x] Fix tool handlers — they call Express handlers with fake `{} as any` res objects, so tool results never propagate back to the MCP client; refactor to call handler/service functions directly and return real `content` (callRouteHandler captures real json/status from express handlers like executeLlm/fuzzyPatch; direct currentHandler() for others; real content returned).
- [x] Replace the `server/set` placeholder tool with a real implementation (real "server_set" tool using ServerManager/GlobalState + optional systemInfo).
- [x] Expose file ops (read/list/fuzzy-patch) as MCP tools, not just command/model tools (create_file, read_file, list_files, fuzzy_patch_file + listFiles dispatch in mcpTools.ts).
- [x] Integration test with a current MCP client (target: 2026 agentic frameworks — Hermes/NemoClaw) (tests/mcpStreamableHttp.test.ts: real Client + StreamableHTTPClientTransport; auth, tool list, execute_command/list_files/read_file roundtrips).

## Security / auth

- [x] Bearer token auth middleware (`checkAuthToken`) — `API_TOKEN` env or auto-generated at boot (printed to console)
- [x] Token protection on `/server`, `/file`, `/settings`, `/activity`, `/llm` route groups
- [x] `/command/*` endpoints bearer-token protected in both prod and test mounts (`checkAuthToken` at the `/command` mount in `setupApiRouter`)
- [x] `/chat/*` routes bearer-token protected (`checkAuthToken` at the `/chat` mount)
- [x] Shell allowlist (`SHELL_ALLOWED`) with safe defaults; shell-escape on args
- [x] CORS configurable via `CORS_ORIGIN` (defaults applied in `setupMiddlewares`)
- [x] Health endpoint exempt from auth (`/health` via `publicRouter`)
- [ ] Rate limiting (none)
- [ ] Output redaction for secrets in command results / activity logs
- [ ] Command allow/deny policy beyond shell selection (`/setup/policy` exists; enforcement audit needed)
- [x] Standard security headers (minimal helmet-equivalent in `setupMiddlewares`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` — no new dependency)
- [ ] Docs: threat model + token rotation guidance (`docs/ADMIN_SECURITY.md` exists; needs refresh against the gaps above)

## Packaging / deployment

- [x] TypeScript build (`npm run build`) with OpenAPI generation (`postbuild`/`prestart` → `public/openapi.json|yaml`)
- [x] npm scripts: start, start:dev, test (jest, `config/test/`), lint, smoke, showcase, docs:screenshots
- [x] Docker assets in `docker/` (Dockerfile.base, docker-compose, prebuilt compose) + setup docs
- [x] Fly.io config (`fly.toml`) + install docs (`docs/INSTALLATION.fly.io.md`)
- [x] `.env.sample` present
- [ ] `package.json` `"version"` is the literal string `"latest"` — set real semver before any release
- [ ] Publish pipeline: npm package and/or Docker Hub image, release notes, tags (none exist)
- [ ] README refresh: current status, LLM optional (how to enable + test), link to this roadmap and the user guide
- [ ] Note `executeFile` deprecation in docs once decided
- [x] CI: run jest suite on push (.github/workflows/ci.yml: matrix [20.x,22.x], npm ci, check-types, test before build, build, openapi:lint, lint non-blocking; tests/ci.workflows.test.ts validates triggers/matrix/steps/order).
- [ ] Prune doc sprawl in `docs/` (40+ files, several stale session logs) into a curated set

---

## Suggested order of attack (FOSS release push)

1. Security gaps: auth on `/command/*` and `/chat/*`. — (largely addressed in branch work + prior commits)
2. Route-layer server reuse: `/file/*` must respect the selected SSH/SSM handler. — **Addressed** (initializeServerHandler + getServerHandler + pathSafety dispatch in fileRoutes + list/create/read/fuzzy; 501s + tests; fuzzy remains local-only).
3. MCP modernization (SDK upgrade, Streamable HTTP, valid tool names, real results, file tools, server_set, integration test) — **largely complete on this branch** (mcpServer.ts + mcpTools.ts + mcpStreamableHttp.test.ts); remaining E2E with 2026 frameworks.
4. Mount-or-delete pass over orphaned route files; remove `.bak` debris. (listFiles.ts route now mounted; many others remain).
5. Version + README + publish pipeline.
6. Shell sessions (largest net-new feature; keep as post-release milestone if needed).

Post-branch: sync README/API/AGENTS/ENVIRONMENT/CONFIG/docs for Streamable MCP (/mcp not /mcp/messages), LLM Setup UI at /setup (toggle/provider/fields/test-conn), path safety + FILE_OPS_ROOT, CI, and version.
