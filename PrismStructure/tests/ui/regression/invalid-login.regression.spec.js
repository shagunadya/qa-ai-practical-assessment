const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-03 Invalid login @regression', () => {
  test('Negative: login rejected with incorrect password @regression', async ({
    loginPage,
    page,
  }) => {
    const { email, password } = uiData.invalidLogin;

    await loginPage.open();
    await loginPage.attemptLogin(email, password);

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
    await expect(loginPage.errorMessage).toContainText(
      /invalid email or password/i,
    );
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(
      loginPage.signedInAs(uiData.seededUser.displayName),
    ).not.toBeVisible();
  });
});
