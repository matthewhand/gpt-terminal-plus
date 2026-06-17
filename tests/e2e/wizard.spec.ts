import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Wizard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock APIs globally for all tests
    // Mock server test connection success
    await page.route('**/api/server/test', async route => {
      await route.fulfill({ json: { success: true, message: 'Connection successful' } });
    });

    // Mock server registration/config save
    await page.route('**/api/server/register', async route => {
      const json = await route.request().postDataJSON();
      // Mock ServerManager update
      console.log('ServerManager mocked: new config added', json);
      await route.fulfill({ json: { success: true, id: 'mock-server-id' } });
    });

    // Mock LLM completions for suggest
    await page.route('**/api/chat/completions', async route => {
      const json = await route.request().postDataJSON();
      if (json.messages[0].content.includes('suggest server')) {
        await route.fulfill({
          json: {
            choices: [{ message: { content: JSON.stringify({ host: 'example.com', port: 22, user: 'testuser' }) } }]
          }
        });
      } else if (json.messages[0].content.includes('test completion')) {
        await route.fulfill({
          json: {
            choices: [{ message: { content: 'Hello from Ollama!' } }]
          }
        });
      }
    });

    // Mock settings update
    await page.route('**/api/config/override', async route => {
      const json = await route.request().postDataJSON();
      console.log('Settings updated:', json);
      await route.fulfill({ json: { success: true } });
    });

    // Mock settings fetch
    await page.route('**/api/settings', async route => {
      await route.fulfill({
        json: {
          llm: { enabled: true, provider: 'ollama', baseUrl: 'http://localhost:11434' },
          cors: 'http://localhost:*'
        }
      });
    });

    // Mock auth token if needed
    await page.route('**/api/auth/token', async route => {
      await route.fulfill({ json: { token: 'mock-token' } });
    });
  });

  test('1. Server-setup flow', async ({ page }) => {
    await page.goto('/setup/server');

    // Select SSH type
    await page.click('select#server-type');
    await page.click('option[value="ssh"]');

    // LLM suggest
    await page.click('button:has-text("Suggest Config")');
    await expect(page.locator('#host')).toHaveValue('example.com');
    await expect(page.locator('#port')).toHaveValue('22');
    await expect(page.locator('#user')).toHaveValue('testuser');

    // Fill details (override if needed)
    await page.fill('#host', 'localhost');
    await page.fill('#port', '2222');
    await page.fill('#user', 'devuser');

    // Mock key upload (use a sample key file)
    const keyPath = path.join(__dirname, 'mock-key.pem'); // Assume a mock file exists or create inline
    await page.setInputFiles('#private-key', keyPath);

    // Test connection
    await page.click('button:has-text("Test Connection")');
    await expect(page.locator('.success-modal')).toBeVisible();
    await expect(page.locator('.success-modal')).toContainText('Connection successful');

    // Save
    await page.click('button:has-text("Save")');
    await expect(page).toHaveURL(/\/server\/list/);

    // Check mock log for config
    // Since console.log in mock, but for assert, perhaps add expect on response or use test.info()
    // For now, assume success from redirect
  });

  test('2. LLM-setup flow', async ({ page }) => {
    await page.goto('/setup/llm'); // Assume path

    // Enable LLM
    await page.check('#enable-llm');

    // Select Ollama
    await page.click('select#llm-provider');
    await page.click('option[value="ollama"]');

    // Fill baseUrl
    await page.fill('#base-url', 'http://localhost:11434');

    // Test completion (SSE preview)
    await page.click('button:has-text("Test Completion")');
    await expect(page.locator('.sse-preview')).toContainText('Hello from Ollama!');

    // Save
    await page.click('button:has-text("Save")');
    // Assert config update via fetch mock log or response
    // Mock handles /settings fetch on save
  });

  test('3. Settings editor', async ({ page }) => {
    await page.goto('/settings.html');

    // Load
    await expect(page.locator('#cors-field')).toHaveValue('http://localhost:*'); // Initial from mock

    // Edit non-readOnly field e.g. CORS
    await page.fill('#cors-field', 'http://example.com:*');

    // Save
    await page.click('button:has-text("Save")');

    // Assert /config/override call (mock logs it)
    // Reload shows update
    await page.reload();
    await expect(page.locator('#cors-field')).toHaveValue('http://example.com:*');
  });

  test('4. Cross-wizard auth', async ({ page }) => {
    // Start without token, expect prompt on first page
    await page.goto('/setup/server');
    await expect(page.locator('.auth-prompt')).toBeVisible();
    await page.fill('#token-input', 'mock-token');
    await page.click('button:has-text("Authenticate")');

    // Check storage
    await expect(await page.evaluate(() => localStorage.getItem('authToken'))).toBe('mock-token');

    // Navigate to another wizard
    await page.goto('/setup/llm');
    // No prompt, already auth'd
    await expect(page.locator('.auth-prompt')).not.toBeVisible();

    // Check token persists
    await expect(await page.evaluate(() => localStorage.getItem('authToken'))).toBe('mock-token');
  });
});