# TODO

Project status lives in **[docs/ROADMAP.md](docs/ROADMAP.md)** — the single
source of truth with per-section progress. This file lists only the genuinely
active next actions.

## Active

- [x] Add/verify `checkAuthToken` consistently on all prod `/command/*` and `/chat/*` — audited 2026-06-19: all prod command/chat routes protected; hardened `GET /config/schema` (was unauth) and removed dead `config.ts`.
- [x] Make `/file/*` routes use the selected server handler + working-root confinement — createFile/readFile/listFiles delegate and now reject paths outside the working root (closed an arbitrary file-write hole; security regression test added).
- [x] MCP modernization — verified 2026-06-19: SDK ^1.29, Streamable HTTP transport (SSE removed), flat tool names, real tool results. (Minor follow-ups: `server_set` dummy systemInfo; `read_file` test-only branch — see ROADMAP.)
- [~] Mount-or-delete pass + stray file cleanup in routes/ — removed `index.ts.orig` and dead `config.ts`. Remaining: unmounted engine routers `files.ts`/`remote.ts` (mount-or-delete decision) and test-only command shims (see ROADMAP "Codebase hygiene").
- [x] Semver + README refresh for publish — 1.0.0-rc.2 tagged; CHANGELOG added; README covers Desktop + MCP; OpenAPI `info.version` now tracks package version.

See docs/VISION.md for overall honest assessment and docs/archived/ for legacy architecture notes.
