# GOALS & MILESTONES

1. Fix Server Registration Architecture
2. Improve WebUI (Admin + Activity)
3. Build & Deploy Native Binaries
4. Test Stability
5. Harden Execution Layer
6. LLM & Plugin Features
7. File Operation UX
8. Security, Monitoring, & Access

# Project TODOs - UPDATED STATUS

## COMPLETED ✅

### Core System Implementation
- [x] **Shell execution** - /command/execute-shell working with literal/raw modes
- [x] **Code execution** - /command/execute-code (Python, Node.js) - bash moved to executeShell
- [x] **File operations** - /file/create, /file/read, /file/list, /file/patch, /file/diff
- [x] **Server registration** - POST /server/register, DELETE /server/{hostname}
- [x] **Session management** - /shell/session/* API with persistent shell processes
- [x] **LLM delegation** - /command/execute-llm with dry-run and streaming
- [x] **Execution boundaries** - Clear separation between shells and interpreters
- [x] **Timeout protection** - 2-minute default timeout for all execute endpoints
- [x] **Simple admin interface** - HTML-based settings management at /admin
- [x] **Authentication** - Bearer token security on all protected endpoints
- [x] **OpenAPI documentation** - Auto-generated specs with deterministic builds
- [x] **Test coverage** - 371/402 tests passing (92% success rate)
- [x] **SSH integration** - worker1/worker2 connectivity verified
- [x] **Clean git history** - 9 professional commits
- [x] **Complete documentation** - PACKAGE.md, deployment guides, GPT Action setup
- [x] **Diff/Patch system** - Git-based diff application with validation
- [x] **Comprehensive test suites** - Unit, integration, and SSH tests
- [x] **Production scripts** - Smoke testing, endpoint validation, deployment

### Advanced Features
- [x] **Multi-server architecture** - Local, SSH, SSM execution
- [x] **AI delegation patterns** - Route tasks to specialized LLMs
- [x] **Security framework** - CORS, input validation, audit logging
- [x] **Configuration management** - Convict-based with environment overrides
- [x] **Error handling** - Comprehensive error analysis and recovery
- [x] **Plugin manifest** - ChatGPT Custom GPT integration ready

## IMMEDIATE PRIORITIES

### Shell Session Management (IN PROGRESS)
- [x] **Session Lifecycle API** - POST /shell/session/start, exec, stop, list ✅
- [ ] **Session Authentication** - Fix disabled auth middleware
- [ ] **Session Output Buffering** - Improve 1-second timeout implementation
- [ ] **Session Logging & Persistence** - Store outputs in data/activity/
- [ ] **Session WebUI Console** - Interactive shell interface
- [ ] **Session Tests** - Unit and integration test coverage
- [ ] **Session Documentation** - SHELL_SESSIONS.md guide

### Test Stabilization
- [ ] **Fix 14 failing tests** - Integration test edge cases and mocking issues
- [ ] **SSH test configuration** - Add privateKeyPath to test configs
- [ ] **File diff/patch tests** - Fix server handler mocking

### Production Readiness  
- [ ] **Endpoint validation** - Run comprehensive endpoint test script
- [ ] **Shell character testing** - Complex escaping (backticks, quotes, heredocs)
- [ ] **Hosting deployment** - Validate Fly.io/Vercel deployment
- [ ] **Smoke testing** - Run hosted-smoke.sh against deployed instances

## ARCHITECTURE IMPROVEMENTS (Future)

### SSH Implementation Enhancement
- [ ] **Connection Management** - Consolidate 3 different SSH connection patterns
- [ ] **Error Handling** - Standardize timeout and error responses
- [ ] **File Operations** - Complete SSH/SSM file operation implementations
- [ ] **Connection Pooling** - Implement reuse strategy

### LLM Provider System
- [ ] **Provider Registry** - Unified configuration system
- [ ] **Error Handling** - Standardize across all providers
- [ ] **Connection Pooling** - Rate limiting and connection management
- [ ] **Capability Detection** - Provider feature detection and fallbacks

### Safety & Security
- [ ] **Context-aware Safety** - Beyond regex pattern matching
- [ ] **Command Analysis** - AST parsing for shell commands
- [ ] **Audit Logging** - Comprehensive operation logging
- [ ] **User Profiles** - Per-user safety configurations

### Performance & Scalability
- [ ] **Session Storage** - Persistent session management (currently in-memory)
- [ ] **Pagination** - Extend to all list endpoints
- [ ] **Caching** - Error analysis and configuration caching
- [ ] **Monitoring** - Health checks and metrics

## HOSTING & DEPLOYMENT

### Cloud Deployment
- [ ] **Fly.io** - Validate deployment with secrets and smoke tests
- [ ] **Vercel** - Serverless configuration and cold-start optimization
- [ ] **Environment Variables** - Proper secret management

### Integration Testing
- [ ] **E2E Test Suite** - Complete SSH workflows with real infrastructure
- [ ] **CI/CD Integration** - Automated testing and deployment
- [ ] **Worker Node Setup** - Test infrastructure scripts

## ADVANCED FEATURES (Future)

### GitHub Integration
- [ ] **Repository Access** - Fine-grained PAT or GitHub App
- [ ] **Workspace Management** - Clone/pull/update with size limits
- [ ] **Security Controls** - Allowlist and audit logging

### WebUI Enhancement
- [ ] **Settings UI** - SSH/SSM server configuration forms
- [ ] **Server Management** - Dynamic add/remove interface
- [ ] **Configuration Toggles** - Feature enable/disable controls

## WEBUI DEVELOPMENT (NEW PRIORITY)

### Goal: Ship Minimal Production WebUI
- **Admin console** for settings (servers, MCP/LLM toggles) using AdminJS
- **Interactive API docs** via Swagger UI (and optional Redoc static page)
- **Forms reuse existing Zod schemas** for type safety
- **Single page + auth** - keep scope minimal

### Implementation Plan
1. **AdminJS Integration**
   - Install: `adminjs @adminjs/express express-formidable`
   - Create `/src/admin/index.ts` with settings resource
   - Mount at `/admin` with basic auth
   - Wire into existing Express server

2. **Zod-based Forms**
   - Install: `react react-dom vite @chakra-ui/react`
   - Install: `react-hook-form @hookform/resolvers zod`
   - Create `/ui` Vite React app with Settings page
   - Use `zodResolver(SettingsSchema)` for validation
   - Fetch/submit via existing `/settings` API

3. **Enhanced API Docs**
   - Install: `swagger-ui-express swagger-ui-dist`
   - Bundle Swagger UI at `/docs` route
   - Optional: Generate static Redoc HTML
   - Use existing `openapi.json` spec

4. **Navigation & Auth**
   - Routes: `/admin`, `/docs`, `/redoc`
   - Protect `/admin` with email+password or Bearer token
   - Maintain existing CORS restrictions

### Ship Criteria (1 Week Target)
- [ ] `/admin` loads and edits persisted Settings
- [ ] Zod-validated Settings form synced with backend
- [ ] `/docs` serves interactive Swagger UI
- [ ] Optional: `/redoc` serves static documentation
- [ ] Smoke test: setting changes affect execution

### 🆕 WebUI Activity Pane

### Activity Recording (Filesystem Logging)
- [ ] Store execution inputs/outputs in `data/activity/yyyy-mm-dd/session_xxx/`
- [ ] One file per step: `01-executeShell.json`, etc.
- [ ] Include meta.json for session metadata
- [ ] Add utility: `logSessionStep(type, payload, sessionId?)`
- [ ] Auto-create folders based on date/session
- [ ] Add rotation logic: delete or archive old days
- [ ] Optional script: `scripts/query-activity.sh` for search
- [ ] Optional API: `GET /activity/list` to paginate and filter sessions
- [ ] **Activity Tab** – new section in WebUI alongside Settings
- [ ] **Display recent executions**:
  - Which API was called (`executeShell`, `executeCode`, `executeLlm`, file ops, etc.)
  - Timestamp of call
  - Inputs (truncated if large)
  - Outputs / results (with error/success status)
- [ ] **UI Styling** – colored boxes/chips for status:
  - ✅ Green = success
  - ⚠️ Yellow = warning / partial failure
  - ❌ Red = error
- [ ] **Implementation**:
  - Backend: extend audit logging → new `/activity/list` API (with pagination)
  - Frontend: React tab with Chakra UI components (e.g. `Box`, `Tag`, `Accordion`)
  - Live updates via polling or WebSockets
- [ ] **Filters**:
  - Filter by endpoint type (`/command/…`, `/file/…`, `/server/…`)
  - Filter by success/error
- [ ] **MVP Criteria**:
  - Activity tab loads with last 50 operations
  - Each entry shows function name, timestamp, input, output, status color
  - User can refresh to see updates

## SHELL SESSION MANAGEMENT (DETAILED ROADMAP)

### ✅ Ticket 1: Session Lifecycle API (COMPLETED)
- [x] POST /shell/session/start - Create persistent shell session
- [x] POST /shell/session/:id/exec - Execute command in session  
- [x] POST /shell/session/:id/stop - Terminate session
- [x] GET /shell/session/list - List active sessions
- [x] SessionManager with process management
- [x] Basic activity logging to data/activity/

### 🔹 Ticket 2: Session Logging & Persistence (NEXT)
- [ ] Enhanced logging in `data/activity/yyyy-mm-dd/session_shell_xxx/`
- [ ] JSON command+output format with timestamps
- [ ] Log rotation to prevent unbounded growth
- [ ] GET /shell/session/:id/logs?since=cursor API
- [ ] Session state persistence across server restarts

### 🔹 Ticket 3: WebUI Session Console
- [ ] Sessions tab in admin interface
- [ ] Interactive console with command input
- [ ] Live output streaming (SSE or WebSocket)
- [ ] Session management UI (start/stop/list)
- [ ] Multiple console tabs support

### 🔹 Ticket 4: Tests & Validation
- [ ] Unit tests for SessionManager
- [ ] Integration tests for session lifecycle
- [ ] WebUI Cypress tests for console interaction
- [ ] Stress testing (100 commands in session)
- [ ] Session cleanup and timeout testing

### 🔹 Ticket 5: Documentation & Polish
- [ ] Update AGENTS.md with session examples
- [ ] Create SHELL_SESSIONS.md comprehensive guide
- [ ] WebUI screenshots and usage docs
- [ ] API documentation in OpenAPI spec

### 🚨 Critical Issues to Address
- [ ] **Authentication middleware** - Currently disabled, needs implementation
- [ ] **Session output buffering** - Replace 1-second timeout with proper streaming
- [ ] **Process cleanup** - Handle server restart gracefully
- [ ] **Error handling** - Better session error management and recovery

## CURRENT FOCUS

**Priority 1**: Complete Shell Session Management (Tickets 2-5)
**Priority 2**: Implement WebUI (AdminJS + React forms)
**Priority 3**: Complete diff/patch testing (local + SSH)
**Priority 4**: Fix remaining test failures and deploy

**Status**: Session foundation implemented. Need logging, WebUI, and comprehensive testing.