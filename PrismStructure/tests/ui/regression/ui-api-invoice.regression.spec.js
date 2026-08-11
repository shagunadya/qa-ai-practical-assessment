const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-07 UI API invoice match @regression', () => {
  test('My Invoices entry matches API GET invoices @regression', async ({
    registerPage,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    invoicesPage,
    apiClient,
  }) => {
    const user = uiData.buildRegistrationUser();

    await registerPage.open();
    await registerPage.register(user);

    if (!(await loginPage.accountMenu.isVisible())) {
      await loginPage.open();
      await loginPage.login(user.email, user.password);
    }

    await productsPage.addProductToCart(uiData.products.productSingle);
    await cartPage.open();
    const cartTotal = await cartPage.getCartTotalAmount();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCashOnDeliveryCheckout(
      uiData.checkout.billingAddress,
    );
    await checkoutPage.confirmOrderTwice();

    await invoicesPage.openViaMenu();
    const invoiceDetails = await invoicesPage.findInvoiceByTotal(cartTotal);
    expect(invoiceDetails).toBeTruthy();

    const { invoiceNumber } = invoiceDetails;

    const loginResponse = await apiClient.login(user.email, user.password);
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
    expect(match.total).toBeGreaterThan(0);
    expect(invoiceDetails.totalAmount).toBeCloseTo(match.total, 2);
    expect(invoiceDetails.totalAmount).toBeCloseTo(cartTotal, 2);
  });
});
