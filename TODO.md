# Project TODOs

## Immediate Priorities (Current Sprint)

### Phase A: Test Stabilization
- [ ] **Fix remaining 7 test failures** - Resolve config/mocking issues
- [ ] **Verify shell execution fix** - Test troublesome characters (backticks, quotes, etc.)
- [ ] **Complete SSH test coverage** - Add missing SSH handler tests
- [ ] **Ensure all tests pass** before proceeding

### Phase B: Shell Execution Validation & PR Management
- [ ] **Commit all test fixes** and shell execution improvements
- [ ] **Analyze each PR systematically** using PR_ANALYSIS.md framework:
  - [ ] Check compatibility with shell execution fixes
  - [ ] Assess value vs effort for each branch
  - [ ] Document merge decisions with reasoning
  - [ ] Update PR_ANALYSIS.md with findings
- [ ] **Execute PR decisions** - merge/cherry-pick/close based on analysis
- [ ] **Build and start server successfully**
- [ ] **Test shell execution via curl** with problematic characters:
  - Backticks: `echo \`date\``
  - Single quotes: `echo 'hello world'`
  - Double quotes: `echo "nested \"quotes\""`
  - Heredocs: `cat << 'EOF'\ncontent\nEOF`
- [ ] **Verify ChatGPT integration** works with fixed shell execution
- [ ] **Document working patterns** in SHELL_USAGE.md

### Phase C: WebUI Settings Enhancement
- [ ] **Extend /settings endpoint** to include SSH/SSM server configurations
- [ ] **Add server registration forms** to settings UI
- [ ] **Implement dynamic server management** (add/remove SSH targets)
- [ ] **Test E2E workflow** with worker1/worker2

## Architecture Improvements (Future Sprints)

### GlobalStateHelper Refactoring
- [ ] Replace mutable global state with immutable state management
- [ ] Add type safety for all state values
- [ ] Remove legacy accessor methods, use single state interface
- [ ] Add state validation and change notifications
- [ ] Implement proper dependency injection instead of global access

### AbstractServerHandler Standardization
- [ ] Complete SSH/SSM file operation implementations (createFile, getFileContent, listFiles)
- [ ] Standardize return types across all handler methods
- [ ] Add consistent error handling patterns for all implementations
- [ ] Add validation for server configurations in constructors
- [ ] Implement proper connection lifecycle management for SSH/SSM

### Shell Execution System (COMPLETED ✅)
- [x] **Fixed double shell wrapping** - Eliminated bash -c + shell -c nesting
- [x] **Added literal mode** - Support command + args array for safe execution
- [x] **Created usage guide** - SHELL_USAGE.md with ChatGPT patterns
- [x] **Updated AGENTS.md** - Clear guidance on shell execution

### SSH Implementation Critical Issues (Deferred)
- [ ] **Connection Management**: Consolidate SSH connection patterns - currently using 3 different techniques
  - [ ] Fix SSHConnectionManager vs per-operation connections inconsistency
  - [ ] Implement connection pooling and reuse strategy
  - [ ] Remove premature `sshClient.end()` calls in action functions
- [ ] **Error Handling Standardization**: Unify error patterns across SSH techniques
  - [ ] Standardize timeout handling across all SSH operations
  - [ ] Create consistent error response format
  - [ ] Add proper connection cleanup on errors
- [ ] **Content Safety**: Fix heredoc pattern vulnerabilities
  - [ ] Handle content containing EOF markers safely
  - [ ] Improve escaping for shell injection prevention
  - [ ] Add binary content validation and handling
- [ ] **Diff/Patch SSH Support**: Implement remote patch operations
  - [ ] Use SFTP + SSH exec pattern for patch file transfer and git operations
  - [ ] Add remote temp file management with cleanup
  - [ ] Implement git command execution over SSH for diff/patch operations

### ServerManager Enhancement
- [ ] Refactor to pure instance-based design (remove static methods)
- [ ] Add robust configuration validation with detailed error messages
- [ ] Implement configuration caching and hot-reload capabilities
- [ ] Add server health checking and connection pooling
- [ ] Create proper factory registry for extensible server types

### LLM Provider System Cleanup
- [ ] Simplify configuration logic with unified provider registry
- [ ] Standardize error handling across all providers
- [ ] Remove scattered per-server LLM override complexity
- [ ] Add provider capability detection and fallback mechanisms
- [ ] Implement connection pooling and rate limiting

### Safety System Enhancement
- [ ] Add context-aware safety evaluation beyond regex patterns
- [ ] Implement command analysis with AST parsing for shell commands
- [ ] Add user-specific safety profiles and learning capabilities
- [ ] Create safety audit logging and reporting
- [ ] Add integration with external security scanning tools

### Error Analysis System Improvements
- [ ] Decouple from chat system with pluggable analysis backends
- [ ] Add caching for analysis results to improve performance
- [ ] Implement historical error context and pattern recognition
- [ ] Add structured error categorization and severity scoring
- [ ] Create error analysis metrics and monitoring

### Pagination System Extension
- [ ] Extend beyond file operations to all list endpoints
- [ ] Add sorting and filtering capabilities
- [ ] Implement cursor-based pagination for large datasets
- [ ] Add configurable page size limits and validation
- [ ] Create consistent pagination metadata across all responses

## Session-based Execution for Long-running Processes
- For shell/code/llm executions, run for '<x>' seconds (default: 5).
- If process is still running after timeout:
- Return a `sessionId`.
- LLM can later query with `sessionId` to retrieve incremental output.
- Support arguments:
  - `offset`: where to resume reading output.
  - `size`: how much output to return.
- This enables incremental streaming/polling for processes that don’t finish quickly.


## SSH Testing Infrastructure Setup
- [ ] **Environment Configuration**: Set up dual environment support
  - [x] Add `.env.docker` to `.gitignore` for container-specific config
  - [x] Add `docker-compose.override.yml` to `.gitignore` for local overrides
  - [x] Configure worker1/worker2 SSH targets with hostname resolution vs IP addresses
- [ ] **SSH Server Configuration**: Add worker1/worker2 to project config
  - [ ] Update config/servers.json with SSH host entries (env var substitution)
  - [x] Add environment variable overrides for SSH connection details
  - [ ] Set up private key management for SSH authentication
- [ ] **Docker Network Configuration**: Enable SSH connectivity from containers
  - [ ] Configure container networking to reach worker1/worker2
  - [ ] Add IP address resolution for containerized environment
  - [ ] Test SSH connectivity from both local and containerized environments

## End-to-End (E2E) Testing Implementation
- [ ] **Dynamic Server Registration**: Implement runtime server management
  - [ ] Add `POST /server/register` endpoint for dynamic server addition
  - [ ] Add `DELETE /server/{hostname}` endpoint for server removal
  - [ ] Implement persistent server configuration storage
  - [ ] Add server health validation before registration
- [ ] **E2E Test Suite**: Test complete SSH workflows
  - [ ] Test server registration via API endpoints
  - [ ] Test SSH command execution on real worker nodes
  - [ ] Test LLM-generated command execution over SSH
  - [ ] Test file operations (create/read/update) over SSH
  - [ ] Test diff/patch operations over SSH (when implemented)
- [ ] **Test Infrastructure**: Set up E2E testing environment
  - [ ] Create test worker node setup scripts
  - [ ] Add SSH key generation and management for testing
  - [ ] Implement test cleanup and teardown procedures
  - [ ] Add CI/CD integration for E2E tests with real infrastructure

## File Operations TODO

- [ ] Add file operations endpoints (list, read, update)
- [ ] Use basic tool parallels:
  - `list_files` -> list folder contents
  - `read_file` -> read file contents (constrained to one file at time, with line ranges)
  - `apply_diff`, write_to_file, insert_content, search_and_replace -> update file contents safely and surgically
- [ ] Ensure one file at a time, efficient reading
- [ ] Reflect these in OpenAPI docs
- [ ] Config toggles in convict + WebUI for enable/disable
- [ ] Tests must be added to /tests
- [ ] **Architecture**: Standardize file operations across all server handlers (local/SSH/SSM)
- [ ] **Architecture**: Add proper error handling and validation for file paths
- [ ] **Architecture**: Implement consistent pagination for file listings

## Hosting & Remote Dev Safety

- [ ] Separate dev runtime from the ChatGPT connection; avoid running on the same localhost session as the client.
- [ ] Fly.io deployment
  - [ ] Confirm/refresh fly configs (fly_configs/*) for this app (port, HTTP, health, volumes if needed).
  - [ ] Set secrets: `API_TOKEN`, `PUBLIC_BASE_URL`, `CORS_ORIGIN`, optional `GITHUB_TOKEN` (read-only, fine‑grained).
  - [ ] Validate `convict` flags work in hosted env (e.g., `FILES_ENABLED`, `SHELL_ENABLED`, `CODE_ENABLED`).
  - [ ] Smoke test `/openapi.json`, `/server/list`, `/command/execute-shell`.
- [ ] Vercel deployment
  - [ ] Confirm serverless entry works (`USE_SERVERLESS=true` path via serverless-http export) and add `vercel.json` if missing.
  - [ ] Set env vars/secrets similar to Fly (`API_TOKEN`, `PUBLIC_BASE_URL`, `CORS_ORIGIN`, optional `GITHUB_TOKEN`).
  - [ ] Confirm cold‑start and memory fit for typical commands; adjust timeouts.
- [ ] GitHub integration for pulling projects
  - [ ] Choose auth: fine‑grained PAT (read‑only) or GitHub App; store as secret (`GITHUB_TOKEN`).
  - [ ] Restrict access to an allowlist of repos/orgs via config (`github.allowedRepos`).
  - [ ] Add endpoints (scoped) for clone/pull/update workspace; require auth+confirm for destructive ops.
  - [ ] Implement workspaces dir with size and age limits (e.g., `/data/workspaces/<id>`); add cleanup policy.
  - [ ] Audit logs for repo actions and strict error redaction.
  - [ ] Document operational playbook and risks in docs/ (network egress, secret rotation, abuse prevention).

## Hosted Status Commands (Fly & Vercel)

Environment
- Export once per session (adjust domains if custom):
  - `export FLY_DOMAIN=gpt-terminal-plus.fly.dev`
  - `export VERCEL_DOMAIN=gpt-terminal-plus.vercel.app`
  - `export API_TOKEN='YOUR_API_TOKEN'`

Fly.io — curl checks
- Health JSON: `curl -sS https://$FLY_DOMAIN/health`
- Health status code: `curl -sS -o /dev/null -w '%{http_code}\n' https://$FLY_DOMAIN/health`
- OpenAPI info: `curl -sS https://$FLY_DOMAIN/openapi.json | jq .info`
- Protected server list: `curl -sS -H "Authorization: Bearer $API_TOKEN" https://$FLY_DOMAIN/server/list`
- Shell sanity (echo): `curl -sS -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" -d '{"command":"echo fly-ok"}' https://$FLY_DOMAIN/command/execute-shell`

Vercel — curl checks
- Health JSON: `curl -sS https://$VERCEL_DOMAIN/health`
- Health status code: `curl -sS -o /dev/null -w '%{http_code}\n' https://$VERCEL_DOMAIN/health`
- OpenAPI info: `curl -sS https://$VERCEL_DOMAIN/openapi.json | jq .info`
- Protected server list: `curl -sS -H "Authorization: Bearer $API_TOKEN" https://$VERCEL_DOMAIN/server/list`
- Shell sanity (echo): `curl -sS -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json" -d '{"command":"echo vercel-ok"}' https://$VERCEL_DOMAIN/command/execute-shell`

Provider CLIs
- Fly status/hostname/logs:
  - `flyctl status -a gpt-terminal-plus`
  - `flyctl status -a gpt-terminal-plus --json | jq -r .Hostname`
  - `flyctl logs -a gpt-terminal-plus --since 1h`
- Vercel project/deployments/domains:
  - `vercel projects ls | grep gpt-terminal-plus`
  - `vercel ls gpt-terminal-plus`
  - `vercel domains ls`
  - `vercel inspect <deployment-url>`

Reusable smoke script
- Both bases (health+openapi only): `npm run smoke:hosting -- --base https://$FLY_DOMAIN --base https://$VERCEL_DOMAIN --skip-protected`
- Fly (with protected): `npm run smoke:hosting -- --base https://$FLY_DOMAIN --token "$API_TOKEN"`
- Vercel (with protected): `npm run smoke:hosting -- --base https://$VERCEL_DOMAIN --token "$API_TOKEN"`

## Shell Execution Safety

- [ ] Add config enforcement for allowed shells (e.g., `bash`, `powershell`) used by `/command/execute-shell` when `shell` is specified
- [ ] **Architecture**: Integrate with enhanced safety system for context-aware command analysis
- [ ] **Architecture**: Add shell-specific safety profiles and validation rules
- [ ] **Architecture**: Implement audit logging for all shell executions across server types
## Execute Diff/Patch Endpoints

- [ ] Implement safe diff/patch apply endpoints that wrap `git apply` instead of raw shell/heredocs.
- [ ] `/execute/diff` accepts unified diff text; write to a temp file (e.g., `/tmp/update.patch`).
- [ ] Validate with `git apply --index` then apply with `git apply` on success; capture rejects on failure.
- [ ] Return JSON `{ success, filesPatched: string[], rejects: string[] }` and include any `.rej` snippets when applicable.
- [ ] `/execute/patch` accepts structured JSON (e.g., `{ file, start?, search?, replace }`), constructs a minimal diff, then reuses the same `git apply` flow.
- [ ] Enforce workspace boundaries and clean working tree preconditions; support dry‑run mode and auth gating.
- [ ] Mark endpoints as consequential in OpenAPI (`x-openai-isConsequential: true`) and add config toggles (e.g., `PATCH_ENABLED`).
- [ ] Add unit and E2E tests covering success, partial rejects, path traversal attempts, and idempotency.
- [ ] Document usage and rollback guidance; log audit entries for applied patches
- [ ] **SSH Support**: Extend diff/patch endpoints to work with SSH servers
  - [ ] Implement SFTP file transfer for patch content to remote systems
  - [ ] Add remote git command execution for patch validation and application
  - [ ] Handle remote temp file cleanup and error recovery
- [ ] **SSH Support**: Extend diff/patch endpoints to work with SSH servers
  - [ ] Implement SFTP file transfer for patch content to remote systems
  - [ ] Add remote git command execution for patch validation and application
  - [ ] Handle remote temp file cleanup and error recovery
