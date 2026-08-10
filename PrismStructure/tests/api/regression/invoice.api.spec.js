const { test, expect } = require('@playwright/test');
const apiData = require('../../data/api-test-data');
const { ToolshopApiClient } = require('../../api/ToolshopApiClient');

test.describe('API invoice COD @regression', () => {
  test('generate cash-on-delivery invoice from cart @regression', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const registerBody = apiData.buildRegistrationBody();

    await client.register(registerBody);
    await client.login(registerBody.email, registerBody.password);

    const products = client.pickInStockProducts(
      await (await client.getProducts()).json(),
      1,
    );

    const cart = await (await client.createCart()).json();
    await client.addToCart(
      cart.id,
      products[0].id,
      apiData.cart.initialQuantity,
    );

    const invoiceResponse = await client.createInvoice(cart.id);
    expect(invoiceResponse.ok()).toBeTruthy();

    const invoice = await invoiceResponse.json();
    expect(invoice.invoice_number).toMatch(/INV-/);
    expect(invoice.payment_method).toBe(apiData.invoice.paymentMethod);

    const listResponse = await client.getInvoices();
    const listBody = await listResponse.json();
    const invoices = listBody.data || listBody;
    const found = invoices.some(
      (entry) => entry.invoice_number === invoice.invoice_number,
    );
    expect(found).toBeTruthy();
  });
});
