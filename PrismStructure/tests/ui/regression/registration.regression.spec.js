const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-09 Registration verification @regression', () => {
  test('new user registration succeeds and credentials work @regression', async ({
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

    if (!(await loginPage.accountMenu.isVisible())) {
      await loginPage.open();
      await loginPage.login(user.email, user.password);
    }

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
  });
});
