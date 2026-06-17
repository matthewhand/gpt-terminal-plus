# Development Guide for gpt-terminal-plus

## Project Architecture
- **Node.js + TypeScript**: The app uses strict TypeScript compiled to CommonJS. Paths are aliased (e.g., `@src`, `@handlers`) as defined in `tsconfig.json`.
- **Express Server**: `src/index.ts` bootstraps an Express app, applies middlewares, mounts route groups, and conditionally enables extras like MCP over SSE or serverless HTTP.
- **Feature Modules**:
  - **Handlers** (`src/handlers/`): Abstract and concrete server handlers (local, SSH, SSM) encapsulate command, code, and file operations.
  - **Routes** (`src/routes/`): REST endpoints are grouped by domain (`command`, `file`, `chat`, `server`, `model`, `setup`). Production routes call specific functions; tests use mocked routers when `NODE_ENV=test`.
  - **Middlewares** (`src/middlewares/`): Authentication and request context helpers (e.g., `checkAuthToken`, `initializeServerHandler`).
  - **Settings & Config** (`src/settings/`, `src/config/`): Configuration is validated via `zod` schemas and persisted on startup.
  - **Utilities** (`src/utils/`): Shared helpers for pagination, env validation, safety checks, and server handler resolution.
  - **Modules** (`src/modules/`): Optional integrations like `ngrok` and MCP tooling.
- **Testing**: Jest tests mirror the `src/` structure under `tests/`, covering handlers, routes, utilities, and feature flows.

## Coding Conventions
- **File Naming**: Name each file after its primary export; keep modules small and focused.
- **Imports**: Use path aliases instead of relative paths; rely on ES modules with `import`/`export` syntax.
- **Logging**: Use the `debug` library with the namespace pattern `app:ModuleName`.
- **Environment Flags**: Features are toggled via env vars (e.g., `ENABLE_COMMAND_MANAGEMENT`, `LLM_ENABLED`, `HTTPS_ENABLED`). Default settings are generated on first run.
- **Validation**: Prefer `zod` for schema validation and type inference.

## Adding New Features
1. **Define Interfaces and Types** in `src/types/` if needed.
2. **Implement Logic** inside a focused module (handler, service, or util).
3. **Expose Routes** under `src/routes/` and wire them in `src/routes/index.ts`.
4. **Write Tests** mirroring the `src/` path in `tests/`.
5. **Update Documentation** in `docs/` or inline comments.
6. **Ensure OpenAPI** specs remain current (generated via `npm run build`).

## Quality and Tooling
- Run `npm run lint` and `make test` before committing.
- `npm run build` emits TypeScript to `dist/` and regenerates OpenAPI files.
- Keep commit history clean; one logical change per commit.
- Maintain documentation clarity and architectural simplicity.

