const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-01 Registration login profile @smoke', () => {
  test('register new user login and verify profile @smoke', async ({
    registerPage,
    loginPage,
    profilePage,
  }) => {
    const user = uiData.buildRegistrationUser();

    await registerPage.open();
    await registerPage.register(user);

    await loginPage.open();
    await loginPage.login(user.email, user.password);

    await expect(
      loginPage.page.getByRole('heading', { name: /my account/i }),
    ).toBeVisible();

    await profilePage.openViaMenu();
    await expect(profilePage.profileField(user.firstName)).toBeVisible();
    await expect(profilePage.profileField(user.lastName)).toBeVisible();
    await expect(
      profilePage.page.getByRole('textbox', { name: /email address/i }),
    ).toHaveValue(user.email);
  });
});
