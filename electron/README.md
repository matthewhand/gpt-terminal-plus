# Desktop shell (Electron)

A thin Electron wrapper that turns GPT Terminal Plus into a native desktop app.
It does **not** reimplement any UI: it boots the existing Express server
(`dist/`) in-process on a random loopback port, then renders the existing
`public/` web UI inside a `BrowserWindow`. The desktop app and the web app are
the same pages, byte for byte.

## Why Electron (not Tauri)

| | Electron | Tauri |
|---|---|---|
| Runtime | Node — matches the existing Express/TS stack | Rust + system WebView |
| Setup here | `npm i -D electron`, zero new languages | needs Rust toolchain + webkit2gtk |
| Embedding the server | `require('../dist/index.js')` in-process | server must run as a sidecar binary |

Electron lets the same Node process own both the server and the window, so the
prototype is a single `require` away. Tauri remains a viable future path if
binary size matters more than setup simplicity — the `public/` UI would be
reused unchanged either way.

## Run it

```bash
npm run desktop        # build + launch the window
npm run desktop:dev    # launch against an existing dist/ build
npm run desktop:smoke  # headless self-test (xvfb): boots, loads UI, exits 0/1
```

## How it works

- `main.js`
  - boots `dist/index.js` via its exported `bootstrap()` and `app`
  - registers servers from config (localhost is always available)
  - listens on `127.0.0.1:0` (OS-assigned free port, loopback only — never exposed)
  - loads `http://127.0.0.1:<port>/` in a `BrowserWindow`
  - opens off-origin links in the system browser
- `preload.js` exposes a minimal, read-only `window.desktop` bridge
  (`isDesktop`, `platform`, `version`) with `contextIsolation: true` and
  `nodeIntegration: false` — no Node APIs leak to the page.

## Headless / container notes

The shell sets `--no-sandbox`, `--disable-dev-shm-usage` and `--disable-gpu` so
it survives constrained `/dev/shm` environments (CI, containers). On a real
display none of these are required for correctness. `ELECTRON_SMOKE=1` runs a
non-interactive load-and-verify; set `ELECTRON_SMOKE_SHOT=/path.png` to also
capture a screenshot (needs a GPU-capable display).

## Status

Working prototype. Not yet packaged for distribution — `electron-builder` /
`electron-forge` (or `@yao-pkg/pkg` for a headless server binary) would be the
next step to produce installable artifacts.
