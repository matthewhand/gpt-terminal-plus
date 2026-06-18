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

## Package it

```bash
npm run dist:dir       # unpacked app -> release/linux-unpacked/ (fast, runnable)
npm run dist:linux     # single-file installer -> release/*.AppImage
```

Packaging is driven by [`electron-builder.yml`](../electron-builder.yml). It
overrides the app entry to `electron/main.js` via `extraMetadata.main` so the
server entry (`dist/index.js`, used by `npm start` and `@yao-pkg/pkg`) is
untouched. `asar: false` keeps resources as plain files for predictable path
resolution; `npmRebuild: false` skips the optional `cpu-features` native dep
(ssh2 falls back to Node crypto), so no C++ toolchain is required.

Both targets are verified: the unpacked binary and the `.AppImage` each boot the
embedded server and serve the UI headlessly (`GET / -> 200`, exit 0). Run the
AppImage without FUSE via `--appimage-extract-and-run`.

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

Working prototype, **packaged**: `npm run dist:linux` produces a verified,
runnable `.AppImage`. Remaining for a polished release: app icon/branding assets,
macOS/Windows targets (`dmg`/`nsis`), code signing, and persisting writable
runtime config outside the app bundle (the desktop boot path uses `bootstrap()`
which only reads config, so this is not required to run).
