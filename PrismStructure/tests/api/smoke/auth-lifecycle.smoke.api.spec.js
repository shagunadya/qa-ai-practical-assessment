const { test, expect } = require('../../../fixtures/api-fixtures');
const {
  expectRegisterSuccess,
  expectLoginSuccess,
} = require('../../../api/api-assertions');

test.describe('API register and login lifecycle @smoke', () => {
  test('register synthetic user authenticate and capture bearer token @smoke', async ({
    apiClient,
    registrationBody,
  }) => {
    const registerResponse = await apiClient.register(registrationBody);
    const registeredUser = await expectRegisterSuccess(
      registerResponse,
      registrationBody,
    );

    expect(apiClient.token).toBeNull();

    const loginResponse = await apiClient.login(
      registrationBody.email,
      registrationBody.password,
    );
    const authBody = await expectLoginSuccess(loginResponse, apiClient);

    expect(authBody.access_token).toBe(apiClient.token);
    expect(registeredUser.email).toBe(registrationBody.email);
    expect(apiClient.authHeaders().Authorization).toBe(
      `Bearer ${authBody.access_token}`,
    );
  });
});
