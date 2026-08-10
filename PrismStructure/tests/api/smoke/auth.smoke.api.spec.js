const { test, expect } = require('@playwright/test');
const apiData = require('../../data/api-test-data');
const { ToolshopApiClient } = require('../../api/ToolshopApiClient');

test.describe('API login token @smoke', () => {
  test('POST users login returns bearer access token @smoke', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const response = await client.login(
      apiData.seededUser.email,
      apiData.seededUser.password,
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.access_token).toBeTruthy();
    expect(body.token_type).toMatch(/bearer/i);
    expect(client.token).toBe(body.access_token);
  });
});
