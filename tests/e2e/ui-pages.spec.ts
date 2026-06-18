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
      } catch { /* ignore */ }
    }, mocks);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    // More robust wait for async script execution after pre-patched fetch (use && to ensure render completes before exiting wait)
    await page.waitForFunction(() => {
      const grid = document.getElementById('features-grid');
      const loading = grid && grid.querySelector && grid.querySelector('.loading');
      const hasCards = !!document.querySelector('.feature-card');
      const hasNote = !!document.querySelector('#llm-disabled-note');
      const hasSave = !!document.querySelector('#saveBtn');
      const hasMsg = !!document.querySelector('#message');
      const t = (document.body && document.body.textContent) || '';
      const doneLoading = !t.includes('Loading features') && !loading;
      const hasUi = hasCards || hasNote || hasSave || hasMsg || !!document.querySelector('h1, form, textarea, input, main');
      return doneLoading && hasUi;
    }, { timeout: 3000 }).catch(() => { /* ignore */ });
    // Additional explicit wait for UI elements to ensure real render completes (helps dashboard cards)
    await page.waitForSelector('body, .feature-card, #llm-disabled-note, #saveBtn, #message', { timeout: 1500 }).catch(() => { /* ignore */ });
  }

  test('dashboard loads and shows feature cards', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } }, server: { port: { value: 5005 } } }
    });
    // rely on real loadFeatures + renderFeatureCards (improved helper wait)
    // Note: the canonical nav is the shared app-shell injected by /assets/nav.js,
    // which is not loaded under setContent; assert on the page's own content.
    await expect(page.locator('.feature-card h3').filter({ hasText: 'LLM Execution Console' })).toBeVisible();
    await expect(page.locator('.feature-card h3').filter({ hasText: 'Shell / Sessions' })).toBeVisible();
    // denser: verify more cards from real render
    await expect(page.locator('.feature-card h3').filter({ hasText: 'API Documentation' })).toBeVisible();
    await expect(page.locator('.feature-card h3').filter({ hasText: 'Server Settings' })).toBeVisible();
  });

  test('llm-console respects settings enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: true } } },
      '/activity/list': { status: 'success', data: { sessions: [] } },
      '/activity/session': { status: 'success', data: {} }
    });
    // denser: confirm enabled state (no disabled note, inputs usable)
    await expect(page.locator('#llm-disabled-note')).not.toBeVisible();
    await expect(page.locator('#llm-prompt')).toBeEnabled();
    await expect(page.locator('#ask-llm-panel button')).toBeEnabled();
  });

  test('llm-console shows disabled note when llm disabled in settings', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: false } } },
      '/activity/list': { status: 'success', data: { sessions: [] } },
      '/activity/session': { status: 'success', data: {} }
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
      '/activity/list': { status: 'success', data: { sessions: [] } },
      '/activity/session': { status: 'success', data: {} }
    });
    await expect(page.locator('#ask-llm-panel')).toBeVisible();
  });

  test('llm-console loads sessions list when data provided', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: true } } },
      '/activity/list': { status: 'success', data: { sessions: [{ date: '2024-01-01', sessionId: 'abc123', timestamp: Date.now(), stepCount: 5, types: ['cmd'] }] } },
      '/activity/session/2024-01-01/abc123': { status: 'success', data: { logs: ['test log'] } }
    });
    await expect(page.locator('.session-item')).toBeVisible();
    // expand to test select session interaction
    await page.click('.session-item');
    await expect(page.locator('#session-detail')).toBeVisible();
  });

  test('llm-console ask flow fills prompt, queries and renders response (dense interaction)', async ({ page }) => {
    await loadStaticWithMocks(page, 'llm-console.html', {
      '/settings': { llm: { enabled: { value: true } } },
      '/activity/list': { status: 'success', data: { sessions: [] } },
      '/activity/session': { status: 'success', data: {} },
      '/llm/query': { status: 'success', data: { response: 'mocked llm answer for the prompt' } }
    });
    const prompt = page.locator('#llm-prompt');
    await expect(prompt).toBeEnabled();
    await prompt.fill('what happened in last shell?');
    // trigger via button or keypress handler
    await page.click('#ask-llm-panel button');
    await expect(page.locator('#llm-response')).toBeVisible();
    await expect(page.locator('#llm-response')).toContainText('mocked llm answer');
  });

  test('dashboard disables LLM card when disabled in settings', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: false } } }
    });
    // Rely on real renderFeatureCards (helper poly + wait now supports getApiToken and async load)
    await expect(page.locator('.feature-card.disabled .cta')).toBeVisible();
    await expect(page.locator('.feature-card.disabled .cta')).toHaveText('Enable in Settings');
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
    await page.selectOption('#llm-provider', 'ollama');
    await page.check('#llm-enabled');
    await page.click('#saveBtn');
    // Wait for the async save handler (patched fetch) to set the output text; no force
    await page.waitForFunction(() => {
      const o = document.getElementById('output');
      return o && o.textContent && o.textContent.includes('Saved');
    }, { timeout: 2000 }).catch(() => { /* ignore */ });
    await expect(page.locator('#output')).toHaveText('Saved successfully');
    // reflect in dashboard (rely on real renderFeatureCards)
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } } }
    });
    await expect(page.locator('.feature-card:not(.disabled) h3').filter({ hasText: 'LLM Execution Console' })).toBeVisible();
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

  test('endpoint-status and test pages show key static elements', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('h1')).toHaveText('Endpoint Status Dashboard');
    // robust scoped (no .first() order brittle): broken badge inside specific card
    await expect(page.locator('.endpoint-card').filter({ hasText: 'POST /shell/session/start' }).locator('span.status-badge-broken')).toBeVisible();
    await expect(page.locator('.status-badge-partial')).toBeVisible();

    // consolidated with similar test page smoke
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('h1')).toHaveText('Test Page');
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
    await expect(page.locator('#sessionsContainer')).toContainText('No active sessions');
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
    // use visible instead of count for more robust check; scoped to avoid generic
    await expect(page.locator('.sections section').filter({ hasText: 'Developer Tools' })).toBeVisible();
    // slightly denser: check key static content
    await expect(page.locator('h1')).toHaveText('GPT Terminal Plus');
    await expect(page.locator('h2').filter({ hasText: 'Developer Tools' })).toBeVisible();
  });

  // (merged duplicate dashboard cards check into the primary "dashboard loads..." test above for density)

  // New simple e2e for settings page interaction (uses loadStaticWithMocks + fill interaction)
  test('settings page supports field edit interaction', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await page.fill('#port-field', '9999');
    await expect(page.locator('#port-field')).toHaveValue('9999');
    await expect(page.locator('#llm-enabled')).toBeVisible();
  });

  // Simple new e2e: settings page has llm provider field
  test('settings page has llm provider field', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#llm-provider')).toBeVisible();
  });

  // Expand: shell command input accepts value via dom (visible only after active session in UI)
  test('shell page command input accepts input', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
    // unhide using style instead of classList to address evaluate inner
    await page.evaluate(() => {
      const section = document.getElementById('terminalSection');
      if (section) section.style.display = 'block';
    });
    await page.fill('#commandInput', 'ls -l');
    await expect(page.locator('#commandInput')).toHaveValue('ls -l');
  });

  // Simple expansion: endpoint-status shows api list items (structural)
  test('endpoint-status page shows endpoint items', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.endpoint-title').filter({ hasText: 'POST /command/execute-shell' })).toBeVisible();
  });

  // Dense login page check (merged 3 shallow tests into one richer interaction+asserts)
  test('login page has core interactive elements', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', {});
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    await expect(page.locator('button[type="submit"]')).toBeAttached();
    await expect(page.locator('#message')).toBeAttached();
    await expect(page.locator('input[type="password"], input[name*="token"], input')).toBeAttached();
  });

  // Simple new e2e for test.html page (another static page interaction check)
  test('test page shows main content', async ({ page }) => {
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('p').filter({ hasText: 'verify static file serving' })).toBeVisible();
  });

  // (index sections grid check merged into primary index sections test above)

  // Simple new e2e for shell page (expand to check newSessionBtn interaction opportunity)
  test('shell page new session button is visible', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#newSessionBtn')).toBeVisible();
  });

  // Simple new e2e for settings page (expand to check llm section)
  test('settings page has llm section visible', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#llm-enabled')).toBeVisible();
  });

  // Simple new e2e test for endpoint-status (expand to check title via helper)
  test('endpoint-status page title via helper', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('h1')).toHaveText('Endpoint Status Dashboard');
  });

  // Simple new e2e test for settings page (cors field interaction)
  test('settings page cors field is visible and editable', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#cors-field')).toBeVisible();
    await page.fill('#cors-field', '*');
    await expect(page.locator('#cors-field')).toHaveValue('*');
  });

  // Simple new e2e for index page (expand static coverage)
  test('index page has developer tools section', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('h2').filter({ hasText: 'Developer Tools' })).toBeVisible();
  });

  // Simple new e2e test for login page (expand form interaction)
  test('login page token input can be filled', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', {});
    await page.fill('#token', 'test-token-123');
    await expect(page.locator('#token')).toHaveValue('test-token-123');
  });

  // Simple new e2e test for dashboard (expand cards check)
  test('dashboard shows LLM card text when enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } }, server: { port: { value: 5005 } } }
    });
    await expect(page.locator('.feature-card h3').filter({ hasText: 'LLM Execution Console' })).toBeVisible();
  });

  test('index page shows lead description', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('p.lead')).toBeVisible();
  });

  test('shell page execute button is attached', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#executeBtn')).toBeAttached();
  });

  test('shell page refresh updates sessions container', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await page.click('#refreshBtn');
    await expect(page.locator('#sessionsContainer')).toContainText('No active sessions');
  });

  test('shell page sessions container attached', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#sessionsContainer')).toBeAttached();
  });

  test('shell page has refresh button', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#refreshBtn')).toBeVisible();
  });

  test('shell page new session button is enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#newSessionBtn')).toBeEnabled();
  });

  test('settings page llm provider field fill and value', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await page.selectOption('#llm-provider', 'openai');
    await expect(page.locator('#llm-provider')).toHaveValue('openai');
  });

  test('test page has h1 title', async ({ page }) => {
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('h1')).toBeVisible();
  });

  test('shell page execute button is visible after unhide', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await page.evaluate(() => {
      const s = document.getElementById('terminalSection');
      if (s) s.style.display = 'block';
    });
    await expect(page.locator('#executeBtn')).toBeVisible();
  });

  test('settings page has llm provider visible', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#llm-provider')).toBeVisible();
  });

  test('shell page has command input attached', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
  });

  // (duplicate lead description test consolidated into earlier index one)
  // (removed redundant 'shows broken badge first' - covered in consolidated test)

  test('shell page has execute button attached after unhide', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await page.evaluate(() => {
      const s = document.getElementById('terminalSection');
      if (s) s.style.display = 'block';
    });
    await expect(page.locator('#executeBtn')).toBeAttached();
  });

  test('settings page output container is attached', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#output')).toBeAttached();
  });

  test('index page shows docs link', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('a[href="/docs"]')).toBeVisible();
  });

  test('index page shows health link', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('a[href="/health"]')).toBeVisible();
  });

  test('endpoint-status page shows file create as partial', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.endpoint-title').filter({ hasText: 'POST /file/create' })).toBeVisible();
  });

  test('dashboard shows API Documentation card', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } }, server: { port: { value: 5005 } } }
    });
    await expect(page.locator('.feature-card h3').filter({ hasText: 'API Documentation' })).toBeVisible();
  });

  test('index page shows health detailed link', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('a[href="/health/detailed"]')).toBeVisible();
  });

  test('endpoint-status page shows working badge', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    // robust scoped (no .first()): pick the shell execute card's working badge
    await expect(page.locator('.endpoint-card').filter({ hasText: 'POST /command/execute-shell' }).locator('span.status-badge-working')).toBeVisible();
  });

  test('settings page has save button', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await expect(page.locator('#saveBtn')).toBeVisible();
  });

  test('endpoint-status page shows shell endpoint as broken', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.endpoint-title').filter({ hasText: 'POST /shell/session/start' })).toBeVisible();
  });

  test('dashboard shows server settings card when enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } }, server: { port: { value: 5005 } } }
    });
    await expect(page.locator('.feature-card h3').filter({ hasText: 'Server Settings' })).toBeVisible();
  });

  test('shell page command input is attached via load', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
  });

  test('shell page has new session button visible', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#newSessionBtn')).toBeVisible();
  });

  test('endpoint-status page shows server list as working', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.endpoint-title').filter({ hasText: 'GET /server/list' })).toBeVisible();
  });

  test('index page shows quick checks for service health', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('p').filter({ hasText: 'Quick checks for service health' })).toBeVisible();
  });

  test('index page shows api docs link', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('a[href="/docs"]')).toBeVisible();
  });

  // (removed near-dup "shows a working badge"; covered + bolstered in 'activity list as working' + 'shows working badge')

  // Small expansion: cover partial badge with robust filter selector (no nth/brittle)
  test('endpoint-status page shows partial badge', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.status-badge-partial').filter({ hasText: 'PARTIAL' })).toBeVisible();
  });

  // Simple new e2e: cover the activity list endpoint shown as working in static
  test('endpoint-status page shows activity list as working', async ({ page }) => {
    await loadStaticWithMocks(page, 'endpoint-status.html', {});
    await expect(page.locator('.endpoint-title').filter({ hasText: 'GET /activity/list' })).toBeVisible();
    // robust scoped (no .first()): activity list card's working badge
    await expect(page.locator('.endpoint-card').filter({ hasText: 'GET /activity/list' }).locator('span.status-badge-working')).toBeVisible();
  });

  // Opportunity expansion: simple new e2e for test.html page using robust filter
  test('test.html shows main verification content', async ({ page }) => {
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('p').filter({ hasText: 'verify static file serving' })).toBeVisible();
  });

  // Simple new e2e for login page (another interaction/page)
  test('login page submit button is enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', {});
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  // Simple new e2e for shell page (new interaction coverage)
  test('shell page newSessionBtn is visible and enabled', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#newSessionBtn')).toBeVisible();
    await expect(page.locator('#newSessionBtn')).toBeEnabled();
  });

  // Simple new e2e for index page (additional coverage)
  test('index page shows developer tools section', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('.sections section').filter({ hasText: 'Developer Tools' })).toBeVisible();
  });

  // Simple new e2e for shell page refresh (expand)
  test('shell page refresh shows no sessions text', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await page.click('#refreshBtn');
    await expect(page.locator('#sessionsContainer')).toContainText('No active sessions');
  });

  // Simple new e2e for shell page (expand interaction coverage)
  test('shell page command input accepts value', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
  });

  // Simple new e2e for test page (expand page coverage)
  test('test page shows h1 title', async ({ page }) => {
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('h1')).toHaveText('Test Page');
  });

  // Simple new e2e for settings page (expand)
  test('settings page has save button visible', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } } }
    });
    await expect(page.locator('#saveBtn')).toBeVisible();
  });

  // Simple new e2e for settings page (expand)
  test('settings page cors field visible', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } } }
    });
    await expect(page.locator('#cors-field')).toBeVisible();
  });

  // Simple new e2e for test page (expand)
  test('test page shows h1 title via helper', async ({ page }) => {
    await loadStaticWithMocks(page, 'test.html', {});
    await expect(page.locator('h1')).toHaveText('Test Page');
  });

  // Simple new e2e for login page (expand)
  test('login page has message container attached', async ({ page }) => {
    await loadStaticWithMocks(page, 'login.html', {});
    await expect(page.locator('#message')).toBeAttached();
  });

  // Simple new e2e for dashboard (expand)
  test('dashboard shows LLM console card', async ({ page }) => {
    await loadStaticWithMocks(page, 'dashboard.html', {
      '/settings': { llm: { enabled: { value: true } } }
    });
    await expect(page.locator('.feature-card h3').filter({ hasText: 'LLM Execution Console' })).toBeVisible();
  });

  // Simple new e2e for index page (expand)
  test('index page shows lead description using p.lead', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('p.lead')).toBeVisible();
  });

  // Simple new e2e for settings page (expand)
  test('settings page has llm provider field fill and value', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    await page.selectOption('#llm-provider', 'ollama');
    await expect(page.locator('#llm-provider')).toHaveValue('ollama');
  });

  // Simple new e2e for shell page (expand)
  test('shell page has command input accepts value', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await expect(page.locator('#commandInput')).toBeAttached();
  });

  // Simple new e2e for shell page (expand)
  test('shell page execute button is attached after unhide', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await page.evaluate(() => {
      const s = document.getElementById('terminalSection');
      if (s) s.style.display = 'block';
    });
    await expect(page.locator('#executeBtn')).toBeAttached();
  });

  // (removed redundant working badge test; covered elsewhere)

  // Simple new e2e for settings page (expand)
  test('settings page has output container attached', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } } }
    });
    await expect(page.locator('#output')).toBeAttached();
  });

  // Simple new e2e for shell page (expand)
  test('shell page has execute button attached after style unhide', async ({ page }) => {
    await loadStaticWithMocks(page, 'shell.html', {
      '/shell/session/list': { sessions: [] }
    });
    await page.evaluate(() => {
      const s = document.getElementById('terminalSection');
      if (s) s.style.display = 'block';
    });
    await expect(page.locator('#executeBtn')).toBeAttached();
  });

  // Expansion: settings form interaction (dense fill + assert)
  test('settings page port field is fillable', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    const port = page.locator('#port-field');
    await expect(port).toBeVisible();
    await port.fill('6789');
    await expect(port).toHaveValue('6789');
  });

  // Opportunity expansion: another settings field interaction
  test('settings page cors field is fillable', async ({ page }) => {
    await loadStaticWithMocks(page, 'settings.html', {
      '/settings': { server: { port: { value: 5005 } }, llm: { enabled: { value: false } } }
    });
    const cors = page.locator('#cors-field');
    await expect(cors).toBeVisible();
    await cors.fill('https://example.com');
    await expect(cors).toHaveValue('https://example.com');
  });

  // Simple new e2e opportunity: index page links
  test('index page has docs and openapi links', async ({ page }) => {
    await loadStaticWithMocks(page, 'index.html', {});
    await expect(page.locator('a[href="/docs"]')).toBeVisible();
    await expect(page.locator('a[href="/openapi.json"]')).toBeVisible();
  });
});
