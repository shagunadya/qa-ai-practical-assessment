const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-02 UI-AC2 COD checkout double confirm @smoke', () => {
  test('multi-product cart qty update COD checkout and My Invoices @smoke', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    invoicesPage,
    seededCredentials,
    apiClient,
  }) => {
    test.setTimeout(120000);

    const loginResponse = await apiClient.login(
      seededCredentials.email,
      seededCredentials.password,
    );
    expect(loginResponse.ok()).toBeTruthy();

    const { products: inStockProducts } = await apiClient.fetchInStockProducts(2);
    expect(inStockProducts.length).toBeGreaterThanOrEqual(2);
    const [productA, productB] = inStockProducts.map((product) => product.name);

    await loginPage.open();
    await loginPage.login(seededCredentials.email, seededCredentials.password);
    await expect(loginPage.accountMenu).toBeVisible({ timeout: 15000 });

    await cartPage.clearLineItems();
    await loginPage.ensureLoggedIn(
      seededCredentials.email,
      seededCredentials.password,
    );
    await cartPage.clearLineItems();

    await loginPage.ensureLoggedIn(
      seededCredentials.email,
      seededCredentials.password,
    );

    await productsPage.open();
    await productsPage.addProductsToCart([productA, productB]);

    await cartPage.open();
    await expect(cartPage.lineItemRows).toHaveCount(2, { timeout: 15000 });

    await cartPage.updateQuantity(productA, uiData.cart.updatedQuantity);
    expect(await cartPage.getLineItemQuantity(productA)).toBe(
      uiData.cart.updatedQuantity,
    );

    const cartTotal = await cartPage.getCartTotalAmount();
    expect(cartTotal).toBeGreaterThan(0);

    await cartPage.proceedToCheckout();
    await loginPage.ensureLoggedIn(
      seededCredentials.email,
      seededCredentials.password,
    );
    await checkoutPage.completeCashOnDeliveryCheckout(
      uiData.checkout.billingAddress,
    );

    const confirmResult = await checkoutPage.confirmOrderTwice();
    expect(
      confirmResult.status,
      `Invoice create failed: ${JSON.stringify(confirmResult.body)}`,
    ).toBe(201);

    const invoiceNumber = confirmResult.body.invoice_number;

    const openInvoicesList = async () => {
      await loginPage.ensureLoggedIn(
        seededCredentials.email,
        seededCredentials.password,
      );
      await invoicesPage.openViaMenu();
    };

    await expect
      .poll(
        async () => {
          await openInvoicesList();
          return (await invoicesPage.collectInvoiceNumbers()).includes(
            invoiceNumber,
          );
        },
        { timeout: 60000 },
      )
      .toBe(true);

    const invoiceDetails = await invoicesPage.getInvoiceRowDetails(invoiceNumber);
    expect(invoiceNumber).toBe(confirmResult.body.invoice_number);
    expect(invoiceDetails.totalAmount).toBeCloseTo(confirmResult.body.total, 2);

    await invoicesPage.openInvoiceDetails(invoiceNumber);
    await expect(invoicesPage.page).toHaveURL(/\/account\/invoices\//);
    await expect(invoicesPage.invoiceNumberField).toHaveValue(invoiceNumber);
    await expect(invoicesPage.invoiceDetailProduct(productA)).toBeVisible();
    await expect(invoicesPage.invoiceDetailProduct(productB)).toBeVisible();

    const detailTotal = await invoicesPage.getDetailPageTotal();
    expect(detailTotal).toBeCloseTo(invoiceDetails.totalAmount, 2);
  });
});
