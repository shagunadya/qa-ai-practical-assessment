const { test, expect } = require('../../fixtures/test-fixtures');
const uiData = require('../../data/ui-test-data');

test.describe('TC-M-01 Registration login profile @smoke', () => {
  test('register new user login and verify profile @smoke', async ({
    registerPage,
    loginPage,
    profilePage,
    page,
  }) => {
    const user = uiData.buildRegistrationUser();

    await registerPage.open();
    await registerPage.register(user);

    await loginPage.open();
    await loginPage.login(user.email, user.password);

    await expect(
      loginPage.accountButton(user.firstName).or(
        page.getByTestId('nav-menu'),
      ),
    ).toBeVisible();

    await profilePage.openViaMenu();
    await expect(profilePage.profileText(user.firstName)).toBeVisible();
    await expect(profilePage.profileText(user.lastName)).toBeVisible();
    await expect(profilePage.profileText(user.email)).toBeVisible();
  });
});
