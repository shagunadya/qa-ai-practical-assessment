const { test, expect } = require('@playwright/test');
const apiData = require('../../data/api-test-data');
const { ToolshopApiClient } = require('../../api/ToolshopApiClient');

test.describe('API duplicate register @regression', () => {
  test('POST users register returns conflict for duplicate email @regression', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const response = await client.register({
      first_name: apiData.duplicateRegistration.firstName,
      last_name: apiData.duplicateRegistration.lastName,
      email: apiData.duplicateRegistration.email,
      password: apiData.duplicateRegistration.password,
    });

    expect(response.status()).toBe(409);
  });
});
