const { test, expect } = require('@playwright/test');

/**
 * Foundation wiring check — not business coverage.
 * Verifies Chromium, baseURL, and @smoke grep execution.
 */
test.describe('Foundation @smoke', () => {
  test('UI baseURL responds successfully @smoke', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    expect(response.ok()).toBeTruthy();
  });
});
