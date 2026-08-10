const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-04 Duplicate registration @regression', () => {
  test('Negative: registration rejected for duplicate email @regression', async ({
    registerPage,
    page,
  }) => {
    const user = uiData.duplicateRegistration;

    await registerPage.open();
    await registerPage.attemptRegister(user);

    await expect(registerPage.errorMessage).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(registerPage.form).toBeVisible();
  });
});
