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

