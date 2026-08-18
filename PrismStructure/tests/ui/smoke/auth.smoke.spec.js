const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-01 UI-AC1 Registration login profile @smoke', () => {
  test('register new user login verify profile and logout @smoke', async ({
    page,
    registerPage,
    loginPage,
    profilePage,
  }) => {
    const user = uiData.buildRegistrationUser();

    await registerPage.open();
    await registerPage.register(user);
    await expect(page).not.toHaveURL(/\/auth\/register/);
    await expect(registerPage.form).not.toBeVisible();

    await loginPage.open();
    await loginPage.login(user.email, user.password);

    await expect(
      loginPage.page.getByRole('heading', { name: /my account/i }),
    ).toBeVisible();
    await expect(loginPage.accountMenu).toContainText(user.firstName);

    await profilePage.openViaMenu();
    await expect(profilePage.profileField(user.firstName)).toBeVisible();
    await expect(profilePage.profileField(user.lastName)).toBeVisible();
    await expect(
      profilePage.page.getByRole('textbox', { name: /email address/i }),
    ).toHaveValue(user.email);

    await loginPage.logout();
    await expect(loginPage.signInNav).toBeVisible();
    await expect(page).toHaveURL(/\/(|auth\/login)/);
  });
});
