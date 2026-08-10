const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-02 COD checkout double confirm @smoke', () => {
  test('multi-product cart qty update COD checkout and My Invoices @smoke', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    invoicesPage,
    seededCredentials,
  }) => {
    const { productA, productB } = uiData.products;

    await loginPage.open();
    await loginPage.login(seededCredentials.email, seededCredentials.password);

    await productsPage.open();
    await productsPage.addProductsToCart([productA, productB]);

    await cartPage.open();
    await expect(cartPage.lineItemRows).toHaveCount(2, { timeout: 15000 });

    await cartPage.updateQuantity(productA, uiData.cart.updatedQuantity);
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCashOnDeliveryCheckout(
      uiData.checkout.billingAddress,
    );
    await checkoutPage.confirmOrderTwice();

    await invoicesPage.openViaMenu();
    const invoiceNumber = await invoicesPage.getLatestInvoiceNumber();
    expect(invoiceNumber).toMatch(uiData.invoice.numberPattern);
    await expect(invoicesPage.invoiceRowByNumber(invoiceNumber)).toBeVisible();
  });
});
