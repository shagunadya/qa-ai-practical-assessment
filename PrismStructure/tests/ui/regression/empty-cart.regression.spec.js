const { test, expect } = require('../../fixtures/test-fixtures');

test.describe('TC-M-05 Empty cart checkout @regression', () => {
  test('checkout blocked when cart is empty @regression', async ({
    loginPage,
    cartPage,
    seededCredentials,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login(
      seededCredentials.email,
      seededCredentials.password,
    );

    await cartPage.open();
    await expect(cartPage.emptyCartMessage).toBeVisible({ timeout: 15000 });

    const proceed = cartPage.proceedToCheckoutButton;
    if (await proceed.isVisible()) {
      await expect(proceed).toBeDisabled();
    } else {
      await expect(page).toHaveURL(/cart/);
      await expect(page.getByText(/payment was successful/i)).not.toBeVisible();
    }
  });
});
