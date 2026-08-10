const { test, expect } = require('@playwright/test');
const apiData = require('../../data/api-test-data');
const { ToolshopApiClient } = require('../../api/ToolshopApiClient');

test.describe('API register @regression', () => {
  test('POST users register creates new user @regression', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const body = apiData.buildRegistrationBody();

    const response = await client.register(body);
    expect(response.ok()).toBeTruthy();

    const loginResponse = await client.login(body.email, body.password);
    expect(loginResponse.ok()).toBeTruthy();
  });
});
