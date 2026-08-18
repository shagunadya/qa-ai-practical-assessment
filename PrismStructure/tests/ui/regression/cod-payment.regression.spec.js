const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-08 UI-AC2 COD payment selected @regression', () => {
  test('Cash on Delivery selected before Confirm @regression', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    seededCredentials,
    apiClient,
  }) => {
    const loginResponse = await apiClient.login(
      seededCredentials.email,
      seededCredentials.password,
    );
    expect(loginResponse.ok()).toBeTruthy();

    const { products } = await apiClient.fetchInStockProducts(1);
    expect(products.length).toBeGreaterThan(0);

    await loginPage.open();
    await loginPage.login(
      seededCredentials.email,
      seededCredentials.password,
    );
    await expect(loginPage.accountMenu).toBeVisible({ timeout: 15000 });

    await cartPage.clearLineItems();
    await loginPage.ensureLoggedIn(
      seededCredentials.email,
      seededCredentials.password,
    );
    await cartPage.clearLineItems();

    await productsPage.addProductToCart(products[0].name);
    await cartPage.open();
    await cartPage.proceedToCheckout();
    await loginPage.ensureLoggedIn(
      seededCredentials.email,
      seededCredentials.password,
    );

    const profileResponse = await apiClient.getProfile();
    expect(profileResponse.ok()).toBeTruthy();
    const profile = await profileResponse.json();
    const billingAddress = uiData.mapProfileToUiBilling(profile.address);

    await checkoutPage.prepareCashOnDeliveryPayment(billingAddress);

    expect(await checkoutPage.isCashOnDeliverySelected()).toBeTruthy();
    await expect(checkoutPage.confirmOrderButton).toBeVisible();
  });
});
