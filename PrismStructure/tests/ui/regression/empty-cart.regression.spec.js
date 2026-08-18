const { test, expect } = require('../../../fixtures/test-fixtures');

test.describe('TC-M-05 UI-AC2 Empty cart checkout @regression', () => {
  test('Negative: checkout blocked when cart is empty @regression', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    page,
    seededCredentials,
  }) => {
    await loginPage.open();
    await loginPage.login(
      seededCredentials.email,
      seededCredentials.password,
    );

    await productsPage.open();
    await cartPage.open();
    await cartPage.clearLineItems();

    await expect(cartPage.lineItemRows).toHaveCount(0);

    const proceed = cartPage.proceedToCheckoutButton;
    if (await proceed.isVisible()) {
      await expect(proceed).toBeDisabled();
    } else if (await cartPage.emptyCartMessage.isVisible()) {
      await expect(cartPage.emptyCartMessage).toBeVisible();
    }

    await expect(checkoutPage.confirmOrderButton).not.toBeVisible();
    await expect(page.getByLabel(/payment method/i)).not.toBeVisible();
  });
});
