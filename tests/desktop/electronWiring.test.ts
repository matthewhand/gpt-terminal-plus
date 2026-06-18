import fs from 'fs';
import path from 'path';
import * as server from '../../src/index';

/**
 * The Electron desktop shell (electron/main.js) is a thin wrapper that boots the
 * compiled Express app in-process and renders the public/ UI. It depends on a
 * small contract with the server bundle and on package.json wiring. These tests
 * guard that contract so the desktop build cannot silently break from a refactor.
 *
 * Note: electron/main.js itself cannot be `require`d here — the `electron`
 * module only resolves inside the Electron runtime — so we assert structure and
 * the exported server contract instead of executing the main process.
 */
const repoRoot = path.resolve(__dirname, '..', '..');
const read = (p: string) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

describe('Electron desktop shell wiring', () => {
  it('exposes the { app, bootstrap } contract the shell embeds', () => {
    expect(typeof server.bootstrap).toBe('function');
    // default export is the express app; app is also a named-ish export path
    expect(server.default).toBeDefined();
    expect(typeof (server.default as any).use).toBe('function'); // an express app
  });

  it('ships the main and preload process files', () => {
    expect(fs.existsSync(path.join(repoRoot, 'electron', 'main.js'))).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, 'electron', 'preload.js'))).toBe(true);
  });

  it('main process loads the built bundle and the public UI on loopback', () => {
    const main = read('electron/main.js');
    // Boots the compiled server, not raw TS.
    expect(main).toContain("'dist', 'index.js'");
    expect(main).toMatch(/serverModule\.bootstrap\(\)/);
    // Binds to loopback only (never exposes the embedded server).
    expect(main).toContain("'127.0.0.1'");
    expect(main).toMatch(/loadURL/);
    // Headless/container hardening switches present.
    expect(main).toContain('disable-dev-shm-usage');
    expect(main).toContain('no-sandbox');
  });

  it('preload exposes a safe, read-only desktop bridge (no node integration)', () => {
    const preload = read('electron/preload.js');
    expect(preload).toContain('contextBridge');
    expect(preload).toContain('isDesktop');
    const main = read('electron/main.js');
    expect(main).toContain('contextIsolation: true');
    expect(main).toContain('nodeIntegration: false');
  });

  it('package.json wires desktop, dev, smoke and packaging scripts', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.scripts.desktop).toMatch(/electron electron\/main\.js/);
    expect(pkg.scripts['desktop:dev']).toBeDefined();
    expect(pkg.scripts['desktop:smoke']).toContain('ELECTRON_SMOKE=1');
    expect(pkg.scripts['dist:linux']).toContain('electron-builder');
    expect(pkg.scripts['dist:dir']).toContain('electron-builder');
    expect(pkg.devDependencies.electron).toBeDefined();
    expect(pkg.devDependencies['electron-builder']).toBeDefined();
    // The server entry must stay dist/index.js; the desktop entry is overridden
    // by electron-builder config, not by changing package.json main.
    expect(pkg.main).toBe('dist/index.js');
  });

  it('electron-builder config targets the shell without disturbing the server entry', () => {
    const cfg = read('electron-builder.yml');
    expect(cfg).toContain('main: electron/main.js'); // extraMetadata override
    expect(cfg).toMatch(/dist\/\*\*\/\*/);           // ships the compiled server
    expect(cfg).toMatch(/electron\/\*\*\/\*/);       // ships the shell
    expect(cfg).toContain('npmRebuild: false');      // optional native dep skipped
    expect(cfg).toMatch(/AppImage/);                 // produces an installer
  });
});
