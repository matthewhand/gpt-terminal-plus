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

> **Status review (2026-06-19):** The Q1/Q2 2026 timelines below are now in the
> past. Current reality: multi-server registration exists (local/SSH/SSM) but the
> centralized dashboard and 50-server scale targets are unmet (Q1 → *in
> progress*). The provider set (OpenAI/Ollama/LM Studio) ships, but intelligent
> model routing and additional providers are not yet built (Q2 → *partial*).
> These OKRs are retained as direction, not commitments; treat the quarters as
> relative ordering rather than fixed dates.

### Multi-Server Management
**Timeline:** Q1 2026 — *in progress (dashboard + scale targets unmet)*
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
**Timeline:** Q2 2026 — *partial (provider set ships; routing/new providers pending)*
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



---

## UX & Design Critique — 2026-06-19 (round 1)

The public UI has solid individual surfaces — index.html and shell.html are genuinely polished — but as a connected product it does not yet read as one coherent application. Three competing visual languages, a broken navigation graph with orphaned and unreachable pages, and a recurring pattern of unescaped innerHTML rendering and color-only state cues hold it back from a shippable FOSS release. **Average score: ~4.3 / 10.**

### Design System & Visual Consistency

- [ ] Extract a shared `base.css` with design tokens (color, surface, border, accent, radius, typography) and link it from every page; pick one primary accent (cyan vs green) (high, large)
- [ ] Unify the three divergent palettes — index/login/shell navy+cyan, dashboard/llm-console grey+green, settings slate+blue — onto the shared tokens (high, large)
- [ ] Standardize one navigation component and render it identically on every page, marking the active item (high, medium)
- [ ] Replace pervasive scattered inline styles (dashboard JS markup, llm-console panels, endpoint-status spacing) with CSS classes using tokens (medium, medium)
- [ ] Align card treatment (radius, shadow, elevation, hover) across dashboard/settings/endpoint-status to match index.html (medium, medium)
- [ ] Add `:focus-visible` outlines and `prefers-reduced-motion` handling to the shared component set (medium, small)

### Navigation & Workflows

- [ ] Fix the broken nav graph: settings/dashboard are unreachable from `/`; choose one canonical landing page and link all surfaces from it (high, medium)
- [ ] Resolve the LLM Console referenced three ways (`/llm/console`, `/llm-console.html`, omitted on index) to a single canonical route; ensure it does not bypass the auth/feature gate (high, medium)
- [ ] Add auth feedback: detect stored token, show Authenticated vs No-token banner, and redirect protected routes to `/login.html` instead of raw 401/`{"error":"Unauthorized"}` JSON (high, medium)
- [ ] Style the first-run setup pages (currently unstyled `<h1>Setup UI</h1>` placeholders) and give them back-links into the app (high, medium)
- [ ] Reconcile the disabled-LLM CTA/hint that point at two different destinations (Setup vs Settings); link directly to one actionable target (medium, small)
- [ ] Add an outbound nav to llm-console.html (currently a navigational island) and a manual-refresh + last-updated control for its auto-refresh (medium, small)
- [ ] Provide a MCP UI surface (headline feature with no UI today) (medium, medium)

### Accessibility

- [ ] Add semantic landmarks (`<header>`/`<main>`/`<nav>`/`<aside>`) and a skip link across dashboard, settings, llm-console, endpoint-status (high, medium)
- [ ] Make session items in llm-console real buttons (keyboard-reachable) instead of `onclick` divs relying on global `event` (high, medium)
- [ ] Associate every settings label with its input via `for`/`id` (especially the checkbox) (high, small)
- [ ] Add `aria-live`/`role=status` to async regions (login message, settings #output, shell toast, llm-console response) and keep them in the DOM (high, small)
- [ ] Replace color-only state signals (disabled cards, status pills/badges) with text or icon cues and `aria-disabled` (medium, medium)
- [ ] Raise muted-text contrast to ≥4.5:1 (e.g. `#aaa` on `#2d2d2d`, helper/note text) and verify gradient-button text contrast (medium, small)
- [ ] Add visually-hidden `<label>` for command/prompt inputs; give the terminal `role=log` + `tabindex` (medium, small)

### Per-Page Issues

- [ ] shell.html & llm-console.html: escape all innerHTML-injected output (command echo, stdout/stderr, session ids, LLM response) — XSS sink in a terminal product; use textContent/escape helper (high, medium)
- [ ] llm-console.html: remove the `JSON.stringify(step, ['timestamp','type'], 2)` allowlist replacer that hides command/output/error — the core feature shows almost nothing (high, medium)
- [ ] endpoint-status.html: stop shipping hardcoded "BROKEN/AVOID COMPLETELY" status (stale-by-design, broadcasts internal defects); make it live-probed or remove from shipped UI (high, large)
- [ ] Delete public/test.html — unreferenced dev scaffold lacking charset/viewport/lang/styling (high, small)
- [ ] login.html: change token field to `type=password` with show/hide toggle; reconsider persisting the bearer token in localStorage (high, small)
- [ ] settings.html: fix CORS multi-origin data loss (only first element kept and overwritten on save) (high, medium)
- [ ] dashboard.html: implement or remove the dead `display:none` System Status section (high, medium)
- [ ] settings.html: wrap fields in a `<form>` (Enter-to-save), constrain Port (`number` min/max) and Provider (`select`), and disable Save while in flight (medium, medium)
- [ ] dashboard.html: render always-available cards even when `/settings` fails; add a non-blocking warning + Retry instead of wiping the grid (medium, medium)
- [ ] settings.html: stop masking load failures with hardcoded demo defaults; show a visible "could not load" banner (medium, small)
- [ ] shell.html: add a shell selector (zsh/sh/powershell) instead of hardcoding bash; auto-focus + scroll the terminal on open; add command history and Stop confirmation (medium, medium)
- [ ] llm-console.html: fix invalid `justify-content: between` → `space-between`; disable Ask LLM button during in-flight requests and only clear input on success (medium, small)
- [ ] llm-console.html: add a responsive breakpoint — the fixed 300px sidebar + `100vh/overflow:hidden` is unusable below ~600px (high, medium)
- [ ] login.html: detect an existing token and offer Continue/Sign-out; add a "Continue now" link rather than a fixed 2s redirect; guard `response.json()` error parsing (low, small)

### Information Architecture

- [ ] Collapse the two competing home pages (index "console directory" vs dashboard feature grid) into one canonical entry with a clear hierarchy (high, medium)
- [ ] Establish a single app shell (shared header/nav + theme + auth flow) so all surfaces hang off one structure (high, large)
- [ ] Soften developer-internal/jargon copy (liveness probe, regexes, "wasting time", raw JSON endpoints labeled "consoles") for a general FOSS audience (low, small)
- [ ] Standardize the product naming ("LLM Console" vs "LLM Execution Console") and enrich empty states with how-to guidance (low, small)
- [ ] Open raw-data/spec links (`/openapi.json`, `/health`) in a new tab so the directory hub stays available (low, small)

### Top 5 quick wins

1. Delete public/test.html — unreferenced dev scaffold (high value, trivial).
2. Add `aria-live`/`role=status` to async message regions across login/settings/shell/llm-console (high value, small).
3. Fix `justify-content: between` → `space-between` in llm-console.html (visible bug, one line).
4. Change the login token input to `type=password` with a show/hide toggle (security-UX, small).
5. Add `:focus-visible` outlines to interactive elements via a shared rule (broad a11y win, small).


---

## UX & Design Critique — 2026-06-19 (round 2)

Round 2 confirms that the round-1 design-system work (base.css tokens, the injected `nav.js` app-shell, XSS hardening, login `type=password`, settings CORS/port/provider controls, the softened endpoint-status banner) landed and is intact across all pages. The headline problem now is integration debt: rolling out a shared shell on top of pages that kept their own legacy navigation and palettes produced duplicate, clashing navbars on four pages and a broken full-height layout on `llm-console.html`. Average score is **5.7/10** (per-page + cross-cutting reviews), a clear improvement over round 1's **4.3/10**, but the remaining work is convergence and cleanup rather than net-new structure.

### Regressions introduced by round-1 fixes
- [ ] Duplicate/stacked navigation on dashboard, settings, login, shell — injected app-nav renders above each page's surviving legacy nav/back-link, with two conflicting "active" indicators (high, small)
- [ ] `login.html` submit handler `document.querySelector('button')` now targets the new Show/Hide toggle (first button in DOM), so loading/disabled state hits the wrong element and allows double-submit (high, small)
- [ ] `llm-console.html` full-height `body{height:100vh;flex}` collides with nav.js wrapper transfer → nav-height + 100vh document, outer scrollbar, console bottom pushed off-screen (high, medium)
- [ ] `endpoint-status.html` softening applied only to the bottom legend ("Not available") while cards still render red "BROKEN" badges and raw "Returns 404 - Router mounting issue" notes — contradictory half-edit (high, small)

### Navigation Consistency
- [ ] Remove legacy `.header` nav from dashboard.html (Dashboard/Settings/API Docs + hand-coded `.active`) and dead `.header*` CSS (high, small)
- [ ] Remove legacy `.nav` block from settings.html (← Dashboard/Shell/LLM Console) and `.nav a` CSS (high, small)
- [ ] Delete redundant "← Back to overview" `.back-link` on login.html and shell.html plus their CSS (medium, small)
- [ ] Reconcile LLM-console routing: dashboard card → `/llm/console` vs nav.js → `/llm-console.html`; pick one canonical path (medium, small)
- [ ] Reconcile in-page "Setup → LLM" (`/setup`) link on llm-console.html with nav's `/settings.html` destination (medium, small)
- [ ] Demote duplicate per-page `<h1>GPT Terminal Plus</h1>` brand on dashboard/llm-console to page-specific titles (low, small)
- [ ] Make `.app-nav` sticky (`position:sticky;top:0;z-index`) so navigation survives long-page scroll (low, small)
- [ ] Gate Login/Logout nav item on auth state; collapse redundant Overview-vs-brand both pointing to `/`; consider excluding `test.html` from injected nav (low, medium)

### Responsiveness
- [ ] Add a breakpoint to llm-console.html (stack to column, full-width sidebar with capped height) — currently the only page with zero responsive rules (high, small)
- [ ] Fix nav.js full-height transfer for flex/grid pages: use `min-height`/`calc(100vh - var(--nav-h))`/`100dvh` instead of copying computed `100vh` (high, medium)
- [ ] Lower card-grid min tracks (`minmax(min(100%,300px),1fr)` or 260px + 1fr at ≤480px) on .sections/dashboard/shell/endpoint grids to stop overflow below ~340px (medium, small)
- [ ] Add overflow/hamburger strategy for the 8-item app-nav so it stays one row on narrow viewports instead of wrapping to 2-3 rows (medium, medium)
- [ ] Use responsive terminal height (`min(400px,50vh)`) and let `.terminal-input`/`.session-actions` wrap under ~480px in shell.html (low, small)
- [ ] Add small-screen padding/tap-target media queries to login, settings, dashboard, endpoint-status (low, small)

### Visual Cohesion
- [ ] Migrate dashboard.html off the legacy grey+green palette (#1a1a1a/#4CAF50/#2196F3) to base.css tokens (high, medium)
- [ ] Migrate llm-console.html off its three-accent grey/green/two-blue palette to the single cyan `--accent` token set (medium, medium)
- [ ] Migrate settings.html off the slate #0f172a/#60a5fa palette to tokens so it stops clashing with the cyan nav (high, medium)
- [ ] Migrate endpoint-status.html off its fourth off-palette variant (and the standalone slate banner colors) to tokens (medium, medium)
- [ ] Replace hard-coded hex in index.html inline styles with `var(--token)` values; delete dead `.monitoring-visual` CSS; style the unstyled inline `code` with `--mono` (medium, medium)
- [ ] Delete shell.html's duplicated inline `:root` token block (overridden by base.css, silently diverging) (medium, medium)
- [ ] Replace login.html hard-coded palette + duplicate `:focus-visible` with shared tokens (medium, medium)
- [ ] Color settings.html `#output` via `--success`/`--error` per outcome instead of neutral text for both (low, small)

### Accessibility
- [ ] Make llm-console session rows real `<button>`s (or `role=button`+`tabindex`+keydown) and pass the element instead of relying on global `event` — currently keyboard-unreachable (high, medium)
- [ ] Add non-color status cues to shell.html running/stopped pills and to endpoint-status badges/legend (no color-only meaning, WCAG 1.4.1) (high, small/medium)
- [ ] Add a visually-hidden "Skip to content" link in nav.js targeting the content wrapper (`id=main`/`role=main`) (medium, small)
- [ ] Add associated `<label>`/`aria-label` for shell.html command input and llm-console `#llm-prompt` (placeholder-only today) (medium, small)
- [ ] Add `role=status`/`aria-live` to dashboard.html `#features-grid` loading/error region (medium, small)
- [ ] Audit borderline AA contrast: shell muted/secondary/disabled button text, llm-console `#aaa` on grey surfaces; move to `--text-muted`/`--text-dim` (medium, small/medium)
- [ ] Associate settings.html CORS hint via `aria-describedby`; add hints for provider/enabled (medium, small)
- [ ] Replace shell.html inline `onclick` handlers with delegated listeners + `data-*` attributes for CSP-readiness (medium, medium)
- [ ] Fix login.html error handling: use `classList.add/remove` instead of clobbering `className`, and move focus to the error/input (low, small)
- [ ] Fix llm-console heading order (sidebar `h2` precedes page `h1` in DOM) (low, small)
- [ ] Add `<main>` landmark to dashboard, endpoint-status (and per-page after legacy headers removed) (low, small)

### Per-Page
- [ ] dashboard.html: wrap two fetches / re-enable Save button in `finally`; escape `error.message` (innerHTML sink) via `textContent`; either gate Shell/Docs cards on settings or drop the half-used `/settings` fetch (medium, small/medium)
- [ ] settings.html: wrap fields in `<form>` + `type=submit` (Enter support), add `<fieldset>/<legend>`, validate port/CORS with inline feedback, fix the block-label checkbox layout, title-case provider options (medium, small/medium)
- [ ] login.html: stop persisting bearer token to localStorage (prefer httpOnly cookie / sessionStorage); send token in one channel only; add `autofocus`; rename "Login & Token Manager" → "Login"; reduce 2000ms redirect delay (medium, small/medium)
- [ ] shell.html: make error messages persistent (manual dismiss) and diff/patch the 30s poll instead of full `innerHTML` reset; `scrollIntoView`+focus the terminal on Open; add fallback pill style for unknown statuses (medium, small/medium)
- [ ] llm-console.html: only clear prompt on success + disable button while in flight; re-apply `.active` after auto-refresh re-render; render curated step view with raw JSON behind a disclosure (medium, small/medium)
- [ ] endpoint-status.html: remove dev-facing "don't waste time on broken features" recommendation; add "Last reviewed: <date>/build" stamp; link cards to `/docs` anchors; trim repetitive "Fully functional and tested" notes (medium, small/medium)
- [ ] index.html: style the too-faint Auth-required badge with `var(--warning)`; open raw json/yaml/health links in a new tab and gate auth links via login; pin tag/meta order for consistent card rhythm (medium, small/medium)

### Top 5 next actions
1. **Delete the four legacy navs/back-links** (dashboard, settings, login, shell) so the injected app-nav is the single source of truth — removes the duplicate-nav regression and the conflicting active-state signals (high, small).
2. **Fix the `login.html` button-targeting regression** — give the submit button an id and target it explicitly so loading/disabled state and double-submit protection work again (high, small).
3. **Fix `llm-console.html` full-height layout + add its first breakpoint** — stop hardcoding `100vh`, use `min-height:100dvh`/wrapper `flex:1`, and stack the 300px sidebar below ~768px (high, small/medium).
4. **Reconcile endpoint-status cards with the softened legend** — relabel "BROKEN" badges and rewrite internal failure notes as user-facing copy; drop the dev-process recommendation (high, small).
5. **Migrate dashboard, settings, llm-console, and endpoint-status palettes to base.css tokens** so the cyan/navy nav stops clashing with three-to-four off-brand bodies and the app reads as one product (high, medium).

## UX & Design Critique — 2026-06-19 (round 3)

Round 3 re-scores after the convergence sprint. The round-2 headline problem (integration debt: clashing palettes, duplicate navs, broken full-height layout) is **resolved**, and several net-new items landed. Average score is **~7.8/10**, up from round 2's **5.7/10**. What remains is genuine refinement — form semantics, poll efficiency, token-storage hygiene — not structural repair.

### Resolved since round 2
- [x] All seven pages migrated to `base.css` design tokens — single cyan/navy palette; the WCAG audit (`tests/a11y/contrast.test.ts`) confirms every fg/bg pairing clears AA (lowest 6.04:1) and guards against regressions.
- [x] Mobile navigation: `nav.js` injects a hamburger toggle (`aria-expanded`/`aria-controls`) collapsing the 8-item nav into a column ≤600px (`tests/e2e/nav-mobile.spec.ts`).
- [x] Non-color status cues: shell pills (● running / ■ stopped) and endpoint-status badges (✔/✕/◑) — WCAG 1.4.1.
- [x] First-run onboarding banner on the dashboard (guides token-less users to `/login`; dismiss persisted; `tests/e2e/onboarding.spec.ts`).
- [x] `llm-console.html` full-height layout + ≤640px breakpoint; login button-targeting regression; skip-to-content link; command/prompt labels; `#features-grid` `role=status`; endpoint-status legend reconciliation (shell session endpoints now correctly labelled WORKING, since the feature is implemented).
- [x] Shell sessions are functionally real (exec/stop/list), so the Shell page is no longer a dead end.

### Still open (refinement backlog)
- [ ] `login.html`: stop persisting the bearer token to `localStorage` (prefer `sessionStorage`/httpOnly cookie); send token in one channel only (high, small/medium).
- [ ] `shell.html`: replace inline `onclick` with delegated listeners + `data-*` (CSP-readiness); diff/patch the 30s poll instead of full `innerHTML` reset; persistent (manually-dismissed) error messages (medium, medium).
- [ ] `llm-console.html`: only clear the prompt on success + disable button in-flight; re-apply `.active` after the auto-refresh re-render; fix heading order (sidebar `h2` precedes page `h1`); curated step view with raw JSON behind a disclosure (medium, small/medium).
- [ ] `settings.html`: wrap fields in a `<form>` with `type=submit` (Enter support) + `<fieldset>/<legend>`; inline port/CORS validation; `aria-describedby` for hints (medium, small/medium).
- [ ] `index.html`: style the faint Auth-required badge with `var(--warning)`; open raw json/yaml/health links in a new tab (low/medium, small).
- [ ] `endpoint-status.html`: add a "Last reviewed: <date>/build" stamp; link cards to `/docs` anchors (low, small).
- [ ] Confirm the last legacy nav/back-link remnants are gone now that the app-shell nav is canonical (low, small).

### Score trend
4.3 (r1) → 5.7 (r2) → 7.8 (r3). The product now reads as one application, is mobile-usable, meets AA contrast, and has no known dead-end pages. Round 4 should focus on the form-semantics + token-storage items above and re-test on real devices.
