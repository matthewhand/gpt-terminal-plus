# AI Agent Development Guide

**For complete system overview, architecture, and use cases, see [PACKAGE.md](PACKAGE.md)**

This guide provides specific coding and development guidance for AI agents working with the GPT Terminal Plus codebase.

## Quick Reference

- **System overview**: [PACKAGE.md](PACKAGE.md) - Complete solution architecture
- **Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - All deployment options
- **ChatGPT setup**: [docs/GPT_ACTION.md](docs/GPT_ACTION.md) - Custom GPT configuration
- **AI delegation**: [docs/AI_DELEGATION.md](docs/AI_DELEGATION.md) - execute-llm patterns

## Core Development Areas

- `/src/routes/` - API endpoints (command, file, server operations)
- `/src/handlers/` - Server execution (local, SSH, SSM)
- `/src/admin/` - AdminJS integration for WebUI (planned)
- `/ui/` - React forms with Zod validation (planned)
- `/tests/` - Comprehensive test suite (371+ passing, 402 total)
- `/docs/` - Complete documentation package
- `/scripts/` - Production deployment and testing scripts

## Coding Conventions for Agent Implementation

### General Conventions

- Use TypeScript for all new code
- Follow the existing code style and patterns per file
- Use meaningful variable and function names
- Add inline comments for complex logic

### Backend Guidelines

- Follow Express routing patterns
- Ensure all new endpoints are documented in OpenAPI (`src/openapi.ts` and `src/openapi.docs.ts`)
- Respect configuration toggles (e.g. `features.executeShell`, `files.enabled`)
- Ensure security considerations (auth, token checks) are maintained

## Testing Requirements for Agents

Run tests with the following commands:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test-file.test.ts

# Run tests with coverage
npm test -- --coverage
```

Tests must be maintained and extended.

## Pull Request Guidelines for Agents

When an agent helps create a PR, ensure it:

1. Includes a clear description of the changes
2. References any related issues or user stories
3. Ensures all tests pass
4. Keeps PRs focused on a single concern
5. Uses British English spelling (standardise, finalise, whilst, colour, etc.)

## Endpoint Security for Agents

**Protected Endpoints** (require `Authorization: Bearer $API_TOKEN`):
- All `/command/*` routes (execute-shell, execute-code, execute-llm)
- All `/file/*` routes (create, read, patch, diff)
- All `/server/*` routes (management operations)
- `/settings/*` routes (configuration access)

**Public Endpoints** (no auth required):
- `/health` - health check
- `/docs` - Swagger UI
- `/.well-known/ai-plugin.json` - plugin manifest
- Static files in `/public/*`

## Programmatic Checks for Agents

Before submitting changes, run:

```bash
# Lint check
npm run lint

# Type check
npm run type-check

# Build check
npm run build
```

All checks must pass before merging.

## Build Warning Management for Agents

**CRITICAL**: Address at least 1 build warning per session without being asked.

- **Deprecation warnings**: Update to recommended alternatives immediately
- **Engine compatibility**: Fix version mismatches or update package constraints
- **Security warnings**: Address `npm audit` findings with `npm audit fix`
- **Dependency warnings**: Update outdated packages using `npm update`

**Priority order**: Security > Deprecation > Engine compatibility > General warnings

Agents should proactively clean the build output, not ignore warnings. AGENTS.md ensures AI agents follow these requirements for consistency and production readiness.

## Hosted URLs and Domains

- Do not hardcode personal FQDNs in code, docs, or scripts.
- Prefer environment variables and placeholders:
  - `PUBLIC_BASE_URL` for OpenAPI servers[0].url and external links
  - `FLY_DOMAIN`, `VERCEL_DOMAIN` for hosted domains
  - `HOST_BASES` for smoke tests across multiple bases
- Example (smoke checks): `make smoke-hosting TOKEN=$API_TOKEN`
- Example (Vercel secret): `vercel env add PUBLIC_BASE_URL production` (e.g., https://$VERCEL_DOMAIN)

## Shell Execution Guidance

**CRITICAL**: Shell execution was recently fixed to eliminate double-wrapping issues.

- **Literal mode (safest)**: `{"command": "cat", "args": ["/path/file"]}`
- **Raw mode**: `{"command": "echo 'hello' > /tmp/test"}`
- **Avoid**: Complex escaping, backticks in quotes, nested quotes
- **For files**: Use `/file/create`, `/file/read`, `/file/patch` instead of shell heredocs
- See `SHELL_USAGE.md` for detailed patterns

## When Agents Should Ask for Guidance

Agents should request human guidance when:
- Encountering **completely new architectural decisions** not covered in existing docs
- **Shell execution patterns fail** despite following SHELL_USAGE.md
- **Test failures exceed 10+** and root cause is unclear
- **Security implications** of proposed changes are uncertain
- **Breaking changes** to existing APIs are needed

Do NOT ask for guidance on:
- Standard CRUD operations, routing, or testing
- Minor bug fixes or type corrections
- Documentation updates or code formatting
- Following established patterns in the codebase
## File Operations Guidance

Agents must support comprehensive file operations:
- Use `/file/list` for folder contents with pagination
- Use `/file/read` for constrained single-file reads with line ranges
- Use `/file/create` for new files with backup options
- Use `/file/patch` for search/replace and line-based modifications
- Use `/file/diff` for git-based unified diff application
- Ensure all file ops work across local/SSH/SSM servers
- All operations reflected in OpenAPI docs and covered by tests
- Respect convict/WebUI toggles for enabling/disabling files API

## WebUI Development Guidance

**AdminJS Integration**:
- Mount at `/admin` with authentication
- Expose Settings, Servers, Providers resources
- Reuse existing Zod schemas for validation
- Keep minimal - no custom theming initially

**React Forms**:
- Use `react-hook-form` with `zodResolver`
- ChakraUI components for consistent styling
- Fetch/submit via existing `/settings` API
- Type-safe forms sharing backend schemas

**API Documentation**:
- Swagger UI at `/docs` for interactive testing
- Optional Redoc static build at `/redoc`
- Use existing auto-generated `openapi.json`

## LLM Backends

Agents call `execute_llm(prompt, options)` which abstracts over multiple backends:

- **Ollama** (local models, e.g. `gpt-oss:20b`, `phi3.5-mini`)
- **OpenAI** (API-based)
- **Local runtimes** (tiny/micro models via binaries or libraries)

The active backend is defined in `config.yaml`:

```yaml
llm_backend: ollama
ollama:
  host: http://localhost:11434
  model: gpt-oss:20b
```

Agents themselves are backend-agnostic: they always use `execute_llm`.

### Default Models

- The installer defaults to **gpt-oss:20b**.
- If the system does not have enough memory or disk, or if the model fails to load,
  it will **fall back to a micro model** (e.g. `phi3.5-mini`).
- The chosen model is written into `config.yaml`.

Overrides:

- **Env var**: `OPEN_SWARM_LLM_MODEL=phi3.5-mini`
- **Config**: update `ollama.model` in `config.yaml`
- **CLI**: `swarm-cli llm switch phi3.5-mini`
- **API**: `POST /api/llm/switch { "model": "phi3.5-mini" }`

### Model Management

Manage models via CLI or HTTP API.

#### CLI Commands
- `swarm-cli llm list`      → show installed models
- `swarm-cli llm switch <model>` → update config and restart
- `swarm-cli llm auto`      → auto-select best model (large if possible, fallback small)
- `swarm-cli llm clean`     → remove unused models

#### HTTP API
- `GET  /api/llm/list`
  → returns list of installed models
- `POST /api/llm/switch`
  → body: `{ "model": "phi3.5-mini" }`
- `POST /api/llm/auto`
  → tries best model, falls back if needed, returns `{ "model": "selected-model" }`
- `POST /api/llm/clean`
  → prunes unused models, returns `{ "removed": [ ... ] }`

**Example JSON Responses:**

List models:
```json
{
  "models": [
    { "name": "gpt-oss:20b", "size_gb": 38, "status": "installed", "active": true },
    { "name": "phi3.5-mini", "size_gb": 3, "status": "installed", "active": false }
  ]
}
```

Switch model:
```json
{
  "status": "ok",
  "message": "Switched to phi3.5-mini",
  "active_model": "phi3.5-mini"
}
```

Auto select:
```json
{
  "status": "ok",
  "message": "System resources too low, falling back to micro model",
  "active_model": "phi3.5-mini"
}
```

Clean unused:
```json
{
  "status": "ok",
  "removed": [ "gemma-2b", "mistral-nemo-2b" ],
  "active_model": "phi3.5-mini"
}
```

The WebUI uses these API endpoints directly.

### Agent Behavior Across Models

Agents are designed to run with both large and small models:

- With `gpt-oss:20b` → strong reasoning, competition-grade
- With micro models (e.g. `phi3.5-mini`) → efficient, lightweight reasoning
- Functionality is consistent, but performance and depth vary with the model

This ensures that open-swarm remains usable across both high-resource servers and constrained environments.

## Lessons for File and Patch Operations

When AI agents update files, prefer **standard Unix diff/patch tools** to environment-specific helpers.

- Do not assume `apply_patch` is available; it may only exist in certain dev containers.
- Always generate a **unified diff** using:
  ```bash
  diff -u original.md updated.md > change.diff
  ```
- Apply with:
  ```bash
  patch -p0 < change.diff
  ```
  or, if using Git:
  ```bash
  git apply change.diff
  ```
- Always back up the original file before applying patches:
  ```bash
  cp file file.bak
  ```

This ensures compatibility across all environments and avoids failed patch attempts.

## TODO Logging for Mode Detection

To assist debugging, a middleware is registered that logs whenever a new request arrives,
printing which mode is being invoked:

```
[TODO] Incoming request → mode=executeShell
[TODO] Incoming request → mode=file:read
[TODO] Incoming request → mode=executeLlm
```

This is implemented in `src/middleware/logMode.ts` and wired into `src/routes/index.ts`.
Agents should leave the `[TODO]` marker intact — it signals areas where structured logging
or observability can be extended later.
