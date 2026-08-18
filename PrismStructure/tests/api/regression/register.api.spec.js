const { test, expect } = require('../../../fixtures/api-fixtures');
const {
  expectRegisterSuccess,
  expectLoginSuccess,
} = require('../../../api/api-assertions');

test.describe('API-AC1 Register user @regression', () => {
  test('POST users register creates new user @regression', async ({
    apiClient,
    registrationBody,
  }) => {
    const registerResponse = await apiClient.register(registrationBody);
    await expectRegisterSuccess(registerResponse, registrationBody);

    const loginResponse = await apiClient.login(
      registrationBody.email,
      registrationBody.password,
    );
    await expectLoginSuccess(loginResponse, apiClient);
  });
});
