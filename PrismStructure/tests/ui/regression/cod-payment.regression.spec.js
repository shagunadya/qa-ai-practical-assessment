const { test, expect } = require('../../fixtures/test-fixtures');
const uiData = require('../../data/ui-test-data');

test.describe('TC-M-08 COD payment selected @regression', () => {
  test('Cash on Delivery selected before Confirm @regression', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    seededCredentials,
  }) => {
    await loginPage.open();
    await loginPage.login(
      seededCredentials.email,
      seededCredentials.password,
    );

    await productsPage.addProductToCart(uiData.products.productSingle);
    await cartPage.open();
    await cartPage.proceedToCheckout();

    await checkoutPage.prepareCashOnDeliveryPayment(
      uiData.checkout.billingAddress,
    );
    expect(await checkoutPage.isCashOnDeliverySelected()).toBeTruthy();

    await checkoutPage.clickProceedStep();
    await checkoutPage.waitForPaymentSuccess();

    expect(await checkoutPage.isCashOnDeliverySelected()).toBeTruthy();
    await expect(checkoutPage.confirmOrderButton).toBeVisible();
  });
});
