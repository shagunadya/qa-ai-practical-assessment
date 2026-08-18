const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-07 UI-AC2 UI API invoice match @regression', () => {
  test('My Invoices entry matches API GET invoices @regression', async ({
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

    await registerPage.open();
    await registerPage.register(user);

    if (!(await loginPage.accountMenu.isVisible())) {
      await loginPage.open();
      await loginPage.login(user.email, user.password);
    }

    const loginResponse = await apiClient.login(user.email, user.password);
    expect(loginResponse.ok()).toBeTruthy();
    const profileResponse = await apiClient.getProfile();
    expect(profileResponse.ok()).toBeTruthy();
    const profile = await profileResponse.json();
    const checkoutBilling = uiData.mapProfileToUiBilling(profile.address, user);

    const { products } = await apiClient.fetchInStockProducts(1);
    expect(products.length).toBeGreaterThan(0);

    await productsPage.addProductToCart(products[0].name);
    await cartPage.open();
    await cartPage.proceedToCheckout();
    await loginPage.ensureLoggedIn(user.email, user.password);
    await checkoutPage.completeCashOnDeliveryCheckout(checkoutBilling);

    const confirmResult = await checkoutPage.confirmOrderTwice();
    expect(
      confirmResult.status,
      `Invoice create failed: ${JSON.stringify(confirmResult.body)}`,
    ).toBe(201);

    const invoiceNumber = confirmResult.body.invoice_number;

    await expect
      .poll(
        async () => {
          await loginPage.ensureLoggedIn(user.email, user.password);
          await invoicesPage.openViaMenu();
          return (await invoicesPage.collectInvoiceNumbers()).includes(
            invoiceNumber,
          );
        },
        { timeout: 60000 },
      )
      .toBe(true);

    const invoiceDetails = await invoicesPage.getInvoiceRowDetails(invoiceNumber);
    expect(invoiceDetails.totalAmount).toBeCloseTo(confirmResult.body.total, 2);

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
  });
});
