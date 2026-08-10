const { test, expect } = require('@playwright/test');
const apiData = require('../../../data/api-test-data');
const { ToolshopApiClient } = require('../../../api/ToolshopApiClient');
const { expectLoginSuccess } = require('../../../api/api-assertions');

test.describe('API login token @smoke', () => {
  test('POST users login returns bearer access token @smoke', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const response = await client.login(
      apiData.seededUser.email,
      apiData.seededUser.password,
    );

    await expectLoginSuccess(response, client);
  });
});
