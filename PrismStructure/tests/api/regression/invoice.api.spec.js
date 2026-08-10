const { test, expect } = require('../../../fixtures/api-fixtures');
const apiData = require('../../../data/api-test-data');
const {
  expectInvoiceCreated,
  expectInvoiceListed,
} = require('../../../api/api-assertions');

test.describe('API invoice COD @regression', () => {
  test('generate cash-on-delivery invoice from cart @regression', async ({
    cartWithProducts,
  }) => {
    const { client, cart, products, quantity } = cartWithProducts;

    const profileResponse = await client.getProfile();
    expect(profileResponse.ok()).toBeTruthy();
    const profile = await profileResponse.json();
    const billingOverrides = apiData.mapProfileAddressToBilling(profile.address);
    const invoicePayload = apiData.buildInvoicePayload(cart.id, billingOverrides);

    expect(invoicePayload.cart_id).toBe(cart.id);
    expect(invoicePayload.payment_method).toBe(apiData.invoice.paymentMethod);

    const invoiceResponse = await client.createInvoice(cart.id, billingOverrides);
    const invoice = await expectInvoiceCreated(invoiceResponse, {
      requestPayload: invoicePayload,
      products,
      quantity,
    });

    const listResponse = await client.getInvoices();
    await expectInvoiceListed(listResponse, invoice);
  });
});
