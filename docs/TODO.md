# TODO

- [x] Implement `gpt-oss:20b` model support (scaffold)
  - [x] Define runtime configuration and model registry entry
  - [x] Add selection via config/env and API
  - [ ] Validate tokenizer compatibility (provider-specific)
  - [x] Add unit/integration tests
  - [x] Update README and usage examples

- [x] Housekeeping
  - [x] Review test stability around SSE endpoints
  - [x] Ensure pretest cleans build artifacts consistently

## New Focus: Natural-Language LLM Execution

- [ ] Minimal viable NL → shell executor
  - [x] `/command/execute-llm` route with dry-run
  - [x] Plan JSON generation via provider chat
  - [x] Sequential execution with early stop on failure
  - [x] Attach aiAnalysis on failed steps
  - [ ] Safety guardrails (allowlist/denylist)
- [ ] Per-server LLM configs
  - [x] Add optional `llm` section to server config types
  - [ ] Honor `llm.baseUrl` and `llm.provider` across all LLM calls
  - [ ] Fallback logic and health checks per server
- [ ] UX & tooling
  - [ ] Plan validation and schema errors surfaced clearly
  - [ ] Return remediation suggestions and rerun hints
  - [ ] Add MCP tool `command/execute-llm`
