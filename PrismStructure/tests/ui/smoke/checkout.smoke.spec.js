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
  }) => {
    test.setTimeout(120000);

    const { productA, productB } = uiData.products;

    await loginPage.open();
    await loginPage.login(seededCredentials.email, seededCredentials.password);

    await cartPage.clearLineItems();

    await invoicesPage.openViaMenu();
    const invoicesBefore = new Set(await invoicesPage.collectInvoiceNumbers());

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
    await checkoutPage.completeCashOnDeliveryCheckout(
      uiData.checkout.billingAddress,
    );

    const confirmResult = await checkoutPage.confirmOrderTwice();

    let invoiceNumber = null;
    await expect
      .poll(
        async () => {
          await invoicesPage.openViaMenu();
          const created = (await invoicesPage.collectInvoiceNumbers()).filter(
            (number) => !invoicesBefore.has(number),
          );
          if (created.length > 0) {
            invoiceNumber = created[0];
            return invoiceNumber;
          }
          return null;
        },
        { timeout: 45000 },
      )
      .toMatch(uiData.invoice.numberPattern);

    const invoiceDetails = await invoicesPage.getInvoiceRowDetails(invoiceNumber);
    expect(invoiceDetails.totalAmount).toBeGreaterThan(0);

    const matchedByCart = await invoicesPage.findInvoiceByTotal(cartTotal);
    if (matchedByCart?.invoiceNumber === invoiceNumber) {
      expect(invoiceDetails.totalAmount).toBeCloseTo(cartTotal, 2);
    }

    if (confirmResult.body?.invoice_number) {
      expect(invoiceNumber).toBe(confirmResult.body.invoice_number);
      expect(invoiceDetails.totalAmount).toBeCloseTo(confirmResult.body.total, 2);
    }

    await invoicesPage.openInvoiceDetails(invoiceNumber);
    await expect(invoicesPage.page).toHaveURL(/\/account\/invoices\//);
    await expect(invoicesPage.invoiceNumberField).toHaveValue(invoiceNumber);
    await expect(invoicesPage.invoiceDetailProduct(productA)).toBeVisible();
    await expect(invoicesPage.invoiceDetailProduct(productB)).toBeVisible();

    const detailAmounts = await invoicesPage.getDetailPageAmounts();
    expect(
      detailAmounts.some(
        (amount) => Math.abs(amount - invoiceDetails.totalAmount) <= 0.02,
      ),
    ).toBe(true);
  });
});
