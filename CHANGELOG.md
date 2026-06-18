# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc.3] - 2026-06-19

### Security
- **Closed an arbitrary file-write/read hole.** The live file handlers stripped a
  leading `/` then re-prepended it, so absolute paths reached the local action
  unconfined (also reachable via the MCP `create_file` tool). All file ops now
  confine to the working root via `resolveSafePath`; added a strict regression test.
- Require auth on `GET /config/schema` (was leaking the config schema).
- Fixed XSS sinks in `shell.html` and `llm-console.html` (command output, LLM
  responses, session fields) — render via `textContent` / `escapeHtml`.

### Added
- **Shared web design system:** `public/assets/base.css` (design tokens + a11y
  utilities) and `public/assets/nav.js` (one consistent app-shell nav injected
  into every page, layout-safe for flex/grid pages), plus a skip-to-content link.
- Two rounds of multi-agent UX critique captured in `docs/ROADMAP.md`.

### Changed
- Milestones completed/verified: auth coverage, MCP modernization (Streamable
  HTTP), file-handler delegation; route cleanup (removed dead `config.ts`,
  `index.ts.orig`); OpenAPI `info.version` now tracks the package version.
- UX fixes: login token field is `password` with show/hide; settings CORS
  multi-origin round-trips without data loss, Port=number, Provider=select;
  removed dead/misleading UI (dashboard System Status, endpoint-status copy);
  `aria-live` on async regions; duplicate per-page navs removed.

### Docs
- README gains an MCP section; IMPLEMENTATION/VISION/ROADMAP de-staled.

## [1.0.0-rc.2] - 2026-06-19

### Added
- **Electron desktop app.** A native desktop shell (`electron/`) that boots the
  Express server in-process on a private loopback port and renders the existing
  `public/` web UI in a `BrowserWindow` — no separate frontend. Safe by default
  (`contextIsolation`, no `nodeIntegration`, off-origin links open in the system
  browser). Scripts: `desktop`, `desktop:dev`, `desktop:smoke` (headless self-test).
- **Desktop packaging** via `electron-builder` (`electron-builder.yml`):
  `dist:linux` produces a verified single-file `.AppImage`; `dist:dir` produces a
  runnable unpacked build. The server entry (`dist/index.js`) is left untouched;
  the desktop entry is set via `extraMetadata.main`.
- Guard tests for the desktop embed contract, loopback binding, safe preload, and
  packaging wiring (`tests/desktop/`).
- `docs/VISION.md` and a curated `docs/archived/` for historical material.

### Fixed
- `/file/read` now returns **400** (not 500) for invalid line-range input
  (`startLine <= 0`, non-integer, or `endLine < startLine`), with a clear message.

### Changed
- File-op route modules refactored toward handler delegation; broad test dedup
  and tightening across ~45 suites.
- Repository hygiene: removed stale build/test artifacts, archived dated reports,
  pruned dead branches and stashes.

### Notes
- Test baseline: **1628 passing across 127 suites**; TypeScript typecheck clean.
- Known item: file ops have two parallel implementations — the live handlers in
  `src/routes/file/index.ts` (with security logging + input sanitization) and the
  delegation-based standalone modules (`src/routes/file/{createFile,readFile,listFiles}.ts`),
  currently only exercised by unit tests. Consolidation is deferred pending a
  decision, as it carries security implications.

## [1.0.0-rc.1] - 2026-06-18

### Added
- listFiles types/defaults, path-safety hardening, selected-handler reuse (#17).
- MCP Streamable HTTP transport + tool modernization; LLM setup panel and
  persistence; CI matrix + type-check gate.
- Playwright e2e densification, bootstrap hygiene, and extensive test-quality
  work (#18).

[1.0.0-rc.2]: https://github.com/matthewhand/gpt-terminal-plus/releases/tag/v1.0.0-rc.2
[1.0.0-rc.1]: https://github.com/matthewhand/gpt-terminal-plus/releases/tag/v1.0.0-rc.1
