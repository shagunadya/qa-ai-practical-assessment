const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-06 Single confirm edge @regression', () => {
  test('one Confirm does not finalize invoice in My Invoices @regression', async ({
    registerPage,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    invoicesPage,
  }) => {
    const user = uiData.buildRegistrationUser();

    await registerPage.open();
    await registerPage.register(user);
    await loginPage.open();
    await loginPage.login(user.email, user.password);

    await productsPage.addProductToCart(uiData.products.productSingle);
    await cartPage.open();
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCashOnDeliveryCheckout(
      uiData.checkout.billingAddress,
    );
    await checkoutPage.clickConfirmOnce();

    await expect(checkoutPage.confirmOrderButton).toBeVisible();
    await invoicesPage.openViaMenu();
    await expect(invoicesPage.invoiceRows).toHaveCount(0);
  });
});
