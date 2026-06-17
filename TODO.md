# TODO

Project status lives in **[docs/ROADMAP.md](docs/ROADMAP.md)** — the single
source of truth with per-section progress. This file lists only the genuinely
active next actions.

## Active

- [ ] Add `checkAuthToken` to prod `/command/*` and `/chat/*` routes (security gap — see Roadmap → Security/auth)
- [ ] Make `/file/*` routes use the selected server handler instead of a hard-coded `LocalServerHandler`
- [ ] MCP modernization: upgrade SDK, SSE → Streamable HTTP, rename slash tool names, return real tool results (see Roadmap → MCP integration)
- [ ] Mount-or-delete pass: orphaned route files in `src/routes/file/` and `src/routes/command/`, stray `.bak`/`.tsn` files
- [ ] Set a real semver in `package.json` (currently `"latest"`) and refresh README before publishing
