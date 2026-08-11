const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-10 Logout verification @regression', () => {
  test('logout ends session and blocks profile access @regression', async ({
    page,
    registerPage,
    loginPage,
    profilePage,
  }) => {
    const user = uiData.buildRegistrationUser();

    await registerPage.open();
    await registerPage.register(user);

    if (!(await loginPage.accountMenu.isVisible())) {
      await loginPage.open();
      await loginPage.login(user.email, user.password);
    }

    await expect(loginPage.accountMenu).toContainText(user.firstName);

    await loginPage.logout();
    await expect(loginPage.signInNav).toBeVisible();
    await expect(page).toHaveURL(/\/(|auth\/login)/);

    await profilePage.open();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.form).toBeVisible();
  });
});
