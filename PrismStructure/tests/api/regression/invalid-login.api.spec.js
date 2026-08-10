const { test, expect } = require('@playwright/test');
const apiData = require('../../../data/api-test-data');
const { ToolshopApiClient } = require('../../../api/ToolshopApiClient');

test.describe('API invalid login @regression', () => {
  test('POST users login rejects wrong password @regression', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const response = await client.login(
      apiData.invalidLogin.email,
      apiData.invalidLogin.password,
    );

    expect(response.status()).toBe(401);
    expect(client.token).toBeNull();
  });
});
