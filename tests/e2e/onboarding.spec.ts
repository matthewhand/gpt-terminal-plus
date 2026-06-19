import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * First-run onboarding on the dashboard: when the browser has no token (or the
 * server rejects it) the welcome banner guides the user to /login; once a token
 * is present and accepted, the banner stays hidden.
 */
const html = fs.readFileSync(path.resolve(__dirname, '../../public/dashboard.html'), 'utf8');

async function mount(
  page: import('@playwright/test').Page,
  opts: { token?: string; settingsStatus?: number; dismissed?: boolean }
) {
  await page.goto('about:blank');
  await page.evaluate((o) => {
    (window as any).fetch = async (input: any) => {
      const u = (typeof input === 'string' ? input : input?.url || '').toString();
      if (u.includes('/settings')) {
        return new Response(JSON.stringify({ llm: { enabled: { value: true } } }), {
          status: o.settingsStatus || 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('{}', { status: 200 });
    };
    const store: Record<string, string> = {};
    if (o.token) store['gpt-terminal-token'] = o.token;
    if (o.dismissed) store['gpt-terminal-onboarding-dismissed'] = '1';
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k: string) => store[k] || null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
      },
      configurable: true,
    });
  }, opts);
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.feature-card', { timeout: 3000 }).catch(() => {});
}

test('shows onboarding banner when no token is stored', async ({ page }) => {
  await mount(page, {});
  await expect(page.locator('#onboarding')).toBeVisible();
  await expect(page.locator('#onboarding a.cta')).toHaveAttribute('href', '/login.html');
});

test('shows onboarding banner when the token is rejected (401)', async ({ page }) => {
  await mount(page, { token: 'bad-token', settingsStatus: 401 });
  await expect(page.locator('#onboarding')).toBeVisible();
});

test('hides onboarding banner when an accepted token is present', async ({ page }) => {
  await mount(page, { token: 'good-token', settingsStatus: 200 });
  await expect(page.locator('#onboarding')).toBeHidden();
});

test('stays dismissed once the user dismisses it', async ({ page }) => {
  await mount(page, { dismissed: true });
  await expect(page.locator('#onboarding')).toBeHidden();
});
