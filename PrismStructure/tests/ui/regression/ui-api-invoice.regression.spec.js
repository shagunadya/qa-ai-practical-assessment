const { test, expect } = require('../../fixtures/test-fixtures');
const uiData = require('../../data/ui-test-data');

test.describe('TC-M-07 UI API invoice match @regression', () => {
  test('My Invoices entry matches API GET invoices @regression', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    invoicesPage,
    apiClient,
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
    await checkoutPage.completeCashOnDeliveryCheckout(
      uiData.checkout.billingAddress,
    );
    await checkoutPage.confirmOrderTwice();

    await invoicesPage.openViaMenu();
    const invoiceNumber = await invoicesPage.getLatestInvoiceNumber();

    const loginResponse = await apiClient.login(
      seededCredentials.email,
      seededCredentials.password,
    );
    expect(loginResponse.ok()).toBeTruthy();

    const invoicesResponse = await apiClient.getInvoices();
    expect(invoicesResponse.ok()).toBeTruthy();

    const body = await invoicesResponse.json();
    const invoices = body.data || body;
    const match = invoices.find(
      (entry) => entry.invoice_number === invoiceNumber,
    );

    expect(match).toBeTruthy();
    expect(match.invoice_number).toBe(invoiceNumber);
  });
});
