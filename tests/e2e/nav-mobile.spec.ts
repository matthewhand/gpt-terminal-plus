import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Regression for the mobile nav overflow: the 8-item primary nav used to wrap
 * to several rows below ~480px. nav.js now injects a hamburger toggle that
 * collapses the links into a full-width column on narrow viewports.
 */
const navJs = fs.readFileSync(path.resolve('public/assets/nav.js'), 'utf8');
const baseCss = fs.readFileSync(path.resolve('public/assets/base.css'), 'utf8');

async function mount(page: import('@playwright/test').Page) {
  await page.setContent(
    `<!DOCTYPE html><html><head><style>${baseCss}</style></head><body><h1>x</h1></body></html>`
  );
  await page.addScriptTag({ content: navJs });
}

test('mobile hamburger toggles the nav links and aria-expanded', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await mount(page);

  const toggle = page.locator('.app-nav__toggle');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#app-nav-links')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  await expect(page.locator('#app-nav-links')).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  // Toggling again collapses it.
  await toggle.click();
  await expect(page.locator('#app-nav-links')).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('desktop shows the nav links inline with no hamburger', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await mount(page);

  await expect(page.locator('.app-nav__toggle')).toBeHidden();
  await expect(page.locator('#app-nav-links')).toBeVisible();
});
