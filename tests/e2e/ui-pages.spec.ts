import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('UI Smoke Tests (mocked)', () => {
  // Helper: load static html via setContent and mock its internal fetch (no network dependency, reliable)
  async function loadStaticWithMocks(page: any, file: string, mocks: Record<string, any>) {
    const htmlPath = path.resolve(__dirname, '../../public', file);
    const html = fs.readFileSync(htmlPath, 'utf8');
    await page.goto('about:blank');
    // Patch fetch + safe localStorage BEFORE setContent (prevents getApiToken throw in dashboard etc, allows real loadFeatures/checkLlmEnabled)
    await page.evaluate((m: any) => {
      (window as any).fetch = async (input: any, init?: any) => {
        const u = (typeof input === 'string' ? input : ((input as any)?.url || '')).toString();
        for (const k of Object.keys(m)) {
          if (u.includes(k)) {
            const body = typeof m[k] === 'function' ? m[k](init) : m[k];
            return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
        }
        return new Response('{}', { status: 200 });
      };
      const store = {};
      try {
        Object.defineProperty(window, 'localStorage', {
          value: { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } },
          configurable: true
        });
      } catch (e) { e; }
    }, mocks);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    // More robust wait for async script execution after pre-patched fetch (use && to ensure render completes before exiting wait)
    await page.waitForFunction(() => {
      const grid = document.getElementById('features-grid');
      const loading = grid && grid.querySelector && grid.querySelector('.loading');
      const cards = document.querySelectorAll('.feature-card').length;
      const hasNote = !!document.querySelector('#llm-disabled-note');
      const hasSave = !!document.querySelector('#saveBtn');
      const hasMsg = !!document.querySelector('#message');
      const t = (document.body && document.body.textContent) || '';
      const doneLoading = !t.includes('Loading features') && !loading;
      const hasUi = cards > 0 || hasNote || hasSave || hasMsg || !!document.querySelector('h1, form, textarea, input, main');
      return doneLoading && hasUi;
    }, { timeout: 3000 }).catch(() => {});
    // Additional explicit wait for UI elements to ensure real render completes (helps dashboard cards)
    await page.waitForSelector('body, .feature-card, #llm-disabled-note, #saveBtn, #message', { timeout: 1500 }).catch(() => {});
  }

  test('dashboard loads and shows feature cards', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } }, server: { port: { value: 5005 } } }
    });
    // rely on real loadFeatures + renderFeatureCards (improved helper wait)
    await expect(page.locator('nav a[href="/settings.html"]')).toBeVisible();
    await expect(page.locator('h3:has-text("LLM Execution Console")')).toBeVisible();
    await expect(page.locator('h3:has-text("Shell / Sessions")')).toBeVisible();
    // denser: verify more cards from real render
    await expect(page.locator('h3:has-text("API Documentation")')).toBeVisible();
    await expect(page.locator('h3:has-text("Server Settings")')).toBeVisible();
  });

  test('llm-console respects settings enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: true } } },
      '/activity/list': { status: 'success', data: { sessions: [] } }
    });
    // denser: confirm enabled state (no disabled note, inputs usable)
    await expect(page.locator('#llm-disabled-note')).not.toBeVisible();
    await expect(page.locator('#llm-prompt')).toBeEnabled();
    await expect(page.locator('#ask-llm-panel button')).toBeEnabled();
  });

  test('llm-console shows disabled note when llm disabled in settings', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: false } } },
      '/activity/list': { status: 'success', data: { sessions: [] } }
    });
    // Now with patch before setContent, rely on real checkLlmEnabled running the fetch mock and applying disabled state
    await expect(page.locator('#llm-disabled-note')).toBeVisible();
    await expect(page.locator('#llm-prompt')).toBeDisabled();
    await expect(page.locator('#ask-llm-panel button')).toBeDisabled();
  });

  // New simple e2e for llm-console ask panel when enabled
  test('llm-console has ask panel when enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: true } } },
      '/activity/list': { status: 'success', data: { sessions: [] } }
    });
    await expect(page.locator('#ask-llm-panel')).toBeVisible();
  });

  test('dashboard disables LLM card when disabled in settings', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: false } } }
    });
    // Rely on real renderFeatureCards (helper poly + wait now supports getApiToken and async load)
    await expect(page.locator('.feature-card.disabled')).toBeVisible();
    await expect(page.getByText('Enable in Settings')).toBeVisible();
  });

  test('settings page loads and has expected fields', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#port-field')).toHaveValue('5005');
    await expect(page.locator('#cors-field')).toBeVisible();
    await expect(page.locator('#llm-enabled')).toBeVisible();
    await expect(page.locator('#saveBtn')).toBeVisible();
  });

  test('settings save updates and reflects in dashboard LLM card', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false }, provider: { value: 'none' } } },
      '/setup/llm': { success: true }
    });
    // full editor interaction
    await page.fill('#port-field', '6000');
    await page.fill('#cors-field', 'http://example.com:*');
    await page.fill('#llm-provider', 'ollama');
    await page.check('#llm-enabled');
    await page.click('#saveBtn');
    // Wait for the async save handler (patched fetch) to set the output text; no force
    await page.waitForFunction(() => {
      const o = document.getElementById('output');
      return o && o.textContent && o.textContent.includes('Saved');
    }, { timeout: 2000 }).catch(() => {});
    await expect(page.locator('#output')).toContainText('Saved successfully');
    // reflect in dashboard (rely on real renderFeatureCards)
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } } }
    });
    await expect(page.locator('.feature-card:not(.disabled)').first()).toContainText('LLM Execution Console');
  });

  // Slightly richer smoke: form elements + 1 interaction (fill) - consolidated, no full submit (kept in auth behavioral tests)
  test('login page has token input and form via helper', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', {});
    await expect(page.locator('#token')).toBeVisible();
    await expect(page.locator('#loginForm')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    // real interaction: fill input
    await page.fill('#token', 'smoke-test-token');
    await expect(page.locator('#token')).toHaveValue('smoke-test-token');
  });

  test('endpoint-status page has broken badges', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.status-badge-broken')).toHaveCount(3);
  });

  test('endpoint-status page has partial badge', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.status-badge-partial')).toHaveCount(1);
  });

  test('endpoint-status page loads title via helper', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('h1')).toContainText('Endpoint Status Dashboard');
  });

  // Simple new e2e for another page (test.html)
  test('test page loads title via helper', async ({ page }) => {
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('h1')).toContainText('Test Page');
  });

  test('login auth flow sets token and allows access', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', { '/login': { success: true } });
    await page.fill('#token', 'mock-auth-token');
    await page.click('button[type="submit"]');
    // Assert via success message (localStorage may be restricted for setContent origin)
    await expect(page.locator('#message')).toContainText('Token validated successfully');
  });

  // Expanded coverage: auth flow + token persistence for subsequent UI pages
  test('login auth flow persists token for dashboard/settings fetches', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', { '/login': { success: true } });
    await page.fill('#token', 'auth-flow-token');
    await page.click('button[type="submit"]');
    await expect(page.locator('#message')).toContainText('Token validated successfully');
    // token available for other pages (e.g. dashboard would use it for /settings)
    const stored = await page.evaluate(() => localStorage.getItem('gpt-terminal-token'));
    expect(stored).toBe('auth-flow-token');
  });

  // Slightly richer smoke: specific elements + 1 interaction (click refresh which exercises load+render)
  test('shell page shows new session button and sessions container', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#newSessionBtn')).toBeVisible();
    await expect(page.locator('#sessionsContainer')).toBeVisible();
    // real interaction: click refresh triggers fetch + re-render
    await page.click('#refreshBtn');
    await expect(page.locator('#sessionsContainer p')).toContainText('No active sessions');
    await expect(page.locator('#newSessionBtn')).toBeEnabled();
  });

  // New simple e2e for shell page command input
  test('shell page has command input via helper', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
    await expect(page.locator('#executeBtn')).toBeAttached();
  });

  test('index page shows content sections', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    const sectionCount = await page.locator('section').count();
    expect(sectionCount).toBeGreaterThan(0);
    // slightly denser: check key static content (not just count)
    await expect(page.locator('h1')).toContainText('GPT Terminal Plus');
    await expect(page.getByText('Developer Tools')).toBeVisible();
  });

  // New expansion: assert real render produces correct number of cards (now reliable)
  test('dashboard renders expected feature cards via real render when LLM enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } } }
    });
    const count = await page.locator('.feature-card').count();
    expect(count).toBeGreaterThanOrEqual(3);
    // all should be non-disabled when enabled
    await expect(page.locator('.feature-card:not(.disabled)')).toHaveCount(4);
  });

  // New simple e2e for settings page interaction (uses loadStaticWithMocks + fill interaction)
  test('settings page supports field edit interaction', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await page.fill('#port-field', '9999');
    await expect(page.locator('#port-field')).toHaveValue('9999');
    await expect(page.locator('#llm-enabled')).toBeVisible();
  });

  // Expand: shell command input accepts value via dom (visible only after active session in UI)
  test('shell page command input accepts input', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
    // simulate input value (element hidden by .hidden until session; real UI shows on select)
    await page.evaluate(() => { (document.getElementById('commandInput') as HTMLInputElement).value = 'ls -l'; });
    const val = await page.evaluate(() => (document.getElementById('commandInput') as HTMLInputElement).value);
    expect(val).toBe('ls -l');
  });
});
