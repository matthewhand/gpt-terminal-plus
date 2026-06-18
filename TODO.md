# TODO

Project status lives in **[docs/ROADMAP.md](docs/ROADMAP.md)** — the single
source of truth with per-section progress. This file lists only the genuinely
active next actions.

## Active

- [ ] Add/verify `checkAuthToken` consistently on all prod `/command/*` and `/chat/*` (some mounting paths may still have gaps)
- [x] (in progress) Make `/file/*` routes use the selected server handler instead of hard-coded local fs (createFile + readFile updated to always delegate; other file routes and safety to follow in small steps)
- [ ] MCP modernization: upgrade SDK, SSE → Streamable HTTP, rename slash tool names, return real tool results
- [ ] Mount-or-delete pass + stray file cleanup in routes/
- [ ] Semver + README refresh for publish

See docs/VISION.md for overall honest assessment and docs/archived/ for legacy architecture notes.
