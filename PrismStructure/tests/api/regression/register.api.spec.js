const { test, expect } = require('../../../fixtures/api-fixtures');
const {
  expectRegisterSuccess,
  expectLoginSuccess,
} = require('../../../api/api-assertions');

test.describe('API register @regression', () => {
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
