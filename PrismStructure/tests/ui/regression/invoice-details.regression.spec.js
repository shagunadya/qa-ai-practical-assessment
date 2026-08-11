const { test, expect } = require('../../../fixtures/test-fixtures');
const uiData = require('../../../data/ui-test-data');

test.describe('TC-M-11 Invoice detail verification @regression', () => {
  test('invoice detail page shows number products and total @regression', async ({
    loginPage,
    invoicesPage,
    seededCredentials,
  }) => {
    await loginPage.open();
    await loginPage.login(seededCredentials.email, seededCredentials.password);
    await expect(loginPage.accountMenu).toBeVisible();

    await invoicesPage.open();
    await expect(invoicesPage.invoiceRows.first()).toBeVisible({ timeout: 30000 });

    const invoiceNumber = await invoicesPage.getNewestInvoiceNumber();
    expect(invoiceNumber).toMatch(uiData.invoice.numberPattern);

    const rowDetails = await invoicesPage.getInvoiceRowDetails(invoiceNumber);
    expect(rowDetails.totalText).toBeTruthy();
    expect(rowDetails.totalAmount).toBeGreaterThan(0);

    await invoicesPage.openInvoiceDetails(invoiceNumber);
    await expect(invoicesPage.page).toHaveURL(/\/account\/invoices\//);
    await expect(invoicesPage.invoiceNumberField).toHaveValue(invoiceNumber);
    await expect(invoicesPage.invoiceTotalField).toHaveValue(
      /^\$?\s*[\d,]+(?:\.\d{2})?$/,
    );

    const detailTotalText = await invoicesPage.invoiceTotalField.inputValue();
    const detailAmounts = await invoicesPage.getDetailPageAmounts();
    expect(detailAmounts.length).toBeGreaterThan(0);
    expect(
      detailAmounts.some(
        (amount) => Math.abs(amount - rowDetails.totalAmount) <= 0.02,
      ),
    ).toBe(true);
    expect(detailTotalText).toMatch(/\$?\s*[\d,]+(?:\.\d{2})?/);

    const productRows = invoicesPage.page.locator('table tbody tr');
    await expect(productRows.first()).toBeVisible();
    expect(await productRows.count()).toBeGreaterThan(0);
  });
});
