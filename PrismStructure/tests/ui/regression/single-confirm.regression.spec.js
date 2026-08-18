const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-06 UI-AC2 Single confirm edge @regression', () => {
  test('one Confirm does not finalize invoice in My Invoices @regression', async ({
    registerPage,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    invoicesPage,
    apiClient,
  }) => {
    test.setTimeout(120000);

    const user = uiData.buildRegistrationUser();

    const { products } = await apiClient.fetchInStockProducts(1);
    expect(products.length).toBeGreaterThan(0);

    await registerPage.open();
    await registerPage.register(user);
    await loginPage.open();
    await loginPage.login(user.email, user.password);

    const loginResponse = await apiClient.login(user.email, user.password);
    expect(loginResponse.ok()).toBeTruthy();
    const profile = await (await apiClient.getProfile()).json();
    const billingAddress = uiData.mapProfileToUiBilling(profile.address, user);

    await productsPage.addProductToCart(products[0].name);
    await cartPage.open();
    await expect(cartPage.lineItemRows).toHaveCount(1, { timeout: 15000 });
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCashOnDeliveryCheckout(billingAddress);
    await checkoutPage.clickConfirmOnce();

    await expect(checkoutPage.confirmOrderButton).toBeVisible();
    await invoicesPage.openViaMenu();
    await expect(invoicesPage.invoiceRows).toHaveCount(0);
  });
});
