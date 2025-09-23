# Roadmap

Ambitious plan to evolve GPT Terminal Plus into a robust AI-assisted DevOps and automation toolkit.

## 1) AI Error Analysis (Core)
- Phase 1: Non-zero exit analysis (done)
  - [x] Capture exitCode/stdout/stderr for all exec paths
  - [x] Invoke gpt-oss:20b analysis on failure
  - [x] Return structured `aiAnalysis` in responses
- Phase 2: Root-cause detection
  - [ ] Heuristics to detect common classes (env, perms, PATH, network)
  - [ ] Link fixes to runnable remediation commands
  - [ ] Confidence scoring and next-step suggestions
- Phase 3: Auto-remediation (guarded)
  - [ ] Dry-run and preview
  - [ ] Policy and allowlist enforcement
  - [ ] Rollback strategy and audit logs

## 2) Execution Safety & Sandboxing
- Baseline
  - [ ] Resource limits per request
  - [ ] Timeout/kill escalations
  - [ ] Output redaction for secrets
- Containers & VMs
  - [ ] Per-request container sandbox
  - [ ] Firecracker/VM integration option
  - [ ] Ephemeral filesystem mounts
- Policy
  - [ ] Role-based route permissions
  - [ ] Command allow/deny lists
  - [ ] Security alerts & metrics

## 3) Provider Ecosystem
- Model routing
  - [x] Ollama, LM Studio, OpenAI providers
  - [ ] Per-model capability matrix
  - [ ] Auto-select best provider per task
- Performance
  - [ ] Streaming backpressure handling
  - [ ] Connection pooling and retries
  - [ ] Circuit breakers
- Observability
  - [ ] Provider latency/error dashboards
  - [ ] Token/throughput budgeting
  - [ ] Per-request tracing IDs

## 4) Developer UX
- API
  - [x] `/chat` streaming with heartbeats
  - [x] `/model` selection APIs
  - [ ] `/exec` unified endpoint (command/code/file)
- SDKs
  - [ ] TypeScript client SDK
  - [ ] Python client SDK
  - [ ] Examples & notebooks
- Docs
  - [x] Primary feature docs
  - [ ] Migration guide (plugin -> action -> platform)
  - [ ] Error catalog with playbooks

## 5) Reliability & Testing
- Unit & integration
  - [x] Tests for model/chat routes
  - [x] Streaming SSE tests (happy/error paths)
  - [x] Error-analysis attachment tests
- E2E
  - [ ] Dockerized E2E with real providers
  - [ ] Load tests for streaming
  - [ ] Chaos tests: provider timeouts/failures
- CI/CD
  - [ ] Parallel test shards
  - [ ] Flaky-test quarantine
  - [ ] Pre-push static analysis

## 6) Observability & Telemetry
- Logging
  - [ ] Structured logs for all routes
  - [ ] Correlate exec + analysis + provider
  - [ ] Sampling for high-volume traffic
- Metrics
  - [ ] Prometheus exporter (latency, errors, tokens)
  - [ ] SSE stream lifecycle metrics
  - [ ] Executor resource usage
- Tracing
  - [ ] OpenTelemetry spans across layers
  - [ ] Distributed trace IDs in responses
  - [ ] Baggage propagation for sessions

## 7) Extensibility & Plugins
- Tools
  - [ ] Declarative tool registration
  - [ ] Versioned tool schemas
  - [ ] Tool capability discovery
- Actions
  - [ ] Composable runbooks (YAML/JSON)
  - [ ] Parameterized, reusable pipelines
  - [ ] Conditional branching & approvals
- Integrations
  - [ ] GitHub/GitLab runners
  - [ ] Cloud providers (AWS/GCP/Azure)
  - [ ] Ticketing (Jira, Linear)

## 8) Productization & Packaging
- Deployment
  - [ ] Helm chart & K8s manifests
  - [ ] Fly.io/Render templates
  - [ ] Serverless (Lambda/Functions) profile
- Distribution
  - [ ] Docker Hub publishing pipeline
  - [ ] Versioning & release notes
  - [ ] Nightly builds with feature flags
- Compliance
  - [ ] Secrets management guidance
  - [ ] Data retention policies
  - [ ] BYOK / encryption at rest

## 9) Advanced Capabilities
- Multi-step diagnosis
  - [ ] Iterative probing (run -> analyze -> refine)
  - [ ] Hypothesis tracking
  - [ ] Outcome scoring and learning
- Knowledge
  - [ ] Local error knowledge base
  - [ ] Similar-case retrieval (RAG)
  - [ ] Import logs/builds from CI systems
- Collaboration
  - [ ] Shareable incident reports
  - [ ] Suggested PRs/patches
  - [ ] Slack/Teams notifications

## Completed Milestones

### WebUI Toggle Milestone (100% Complete)
**Completion Date:** September 2025
**Implemented Features:**
- File operation toggles: Granular control over read, write, and execute permissions for file operations via UI switches.
- Persistence: Configuration settings are saved and restored across sessions using convict-based config persistence.
- Enhanced UI: Improved user interface with toggle switches, status indicators, and responsive design for better usability.

**Metrics Achieved:**
- 100% completion rate for all planned features.
- Zero regressions in existing functionality.
- User acceptance testing passed with positive feedback on ease of use.

**Lessons Learned:**
- Importance of early integration of persistence layers to avoid configuration drift.
- UI/UX feedback loops are critical for feature adoption; iterative design improved toggle clarity.
- Modular toggle implementation allows for easy extension to other operation types.

## 10) Ambitious OKRs (2025-2026)

### Multi-Server Management
**Timeline:** Q1 2026
**Objectives:**
- Develop a centralized dashboard for managing multiple servers (local, SSH, SSM).
- Implement server grouping, health monitoring, and bulk operations.
- Add server discovery and auto-registration features.

**Success Criteria:**
- Support for up to 50 concurrent servers.
- 99.9% uptime for server monitoring.
- Reduction in manual server setup time by 80%.

**Dependencies:**
- Completion of Provider Ecosystem (Section 3).
- Enhanced observability metrics (Section 6).

### Advanced LLM Integrations
**Timeline:** Q2 2026
**Objectives:**
- Integrate additional LLM providers (Anthropic Claude, Google Gemini, etc.).
- Implement intelligent model routing based on task complexity and cost.
- Add fine-tuning capabilities for custom models.

**Success Criteria:**
- Support for 5+ new providers.
- 95% accuracy in automatic model selection.
- Cost optimization of 30% through smart routing.

**Dependencies:**
- Completion of Provider Ecosystem performance enhancements (Section 3).
- Advanced Capabilities knowledge base (Section 9).

### Performance Optimizations
**Timeline:** Q3 2026
**Objectives:**
- Implement caching layers for frequent operations (file reads, command results).
- Optimize streaming performance with backpressure handling and connection pooling.
- Add horizontal scaling support for high-load scenarios.

**Success Criteria:**
- 50% reduction in average response times for cached operations.
- Support for 10x current throughput under load.
- Memory usage optimization to <200MB per server instance.

**Dependencies:**
- Completion of Reliability & Testing E2E tests (Section 5).
- Observability & Telemetry metrics (Section 6).

### Security Enhancements
**Timeline:** Q4 2026
**Objectives:**
- Implement zero-trust authentication with multi-factor support.
- Add end-to-end encryption for all data in transit and at rest.
- Develop comprehensive audit logging and compliance reporting.

**Success Criteria:**
- SOC 2 Type II compliance certification.
- Zero security incidents in production environments.
- 100% coverage of security scanning in CI/CD pipeline.

**Dependencies:**
- Completion of Execution Safety & Sandboxing (Section 2).
- Productization & Packaging compliance features (Section 8).

