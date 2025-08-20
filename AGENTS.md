# Project Agents.md Guide for SysAdmin Assistant

This Agents.md file provides comprehensive guidance for AI agents (like OpenAI Codex or ChatGPT-based assistants) working with this codebase.

## Project Structure for Agent Navigation

- /src: Core application source code
  - /handlers: Server handlers for local, SSH, and SSM command execution
  - /routes: Express route definitions (including command, code, llm, and file operations)
  - /config: Configuration management with convict
  - /settings: Settings schema for runtime configuration and WebUI exposure
  - /managers: Server and connection managers
  - /middlewares: Express middlewares
  - /services and /utils: Supporting logic and utilities
- /config: JSON configs for environments (development, production, test)
- /tests: Jest test files that must be maintained and extended

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

Agents must support file operations endpoints (`/file/create`, `/file/read`, `/file/patch`).
- Use `/file/list` for folder contents
- Use `/file/read` for constrained single-file reads
- Use `/file/create`, `/file/patch`, `/file/diff`, `/file/backup` for file updates
- Ensure all file ops are reflected in OpenAPI docs and covered by tests
- Respect convict/WebUI toggles for enabling/disabling files API
