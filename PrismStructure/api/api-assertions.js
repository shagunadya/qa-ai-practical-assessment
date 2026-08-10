const { expect } = require('@playwright/test');

/**
 * @param {import('@playwright/test').APIResponse} response
 * @param {number} status
 */
async function expectStatus(response, status) {
  expect(response.status()).toBe(status);
}

/**
 * @param {import('@playwright/test').APIResponse} response
 * @param {{ first_name: string, last_name: string, email: string }} requestBody
 */
async function expectRegisterSuccess(response, requestBody) {
  await expectStatus(response, 201);

  const body = await response.json();
  expect(body.id).toBeTruthy();
  expect(body.email).toBe(requestBody.email);
  expect(body.first_name).toBe(requestBody.first_name);
  expect(body.last_name).toBe(requestBody.last_name);

  return body;
}

/**
 * @param {import('@playwright/test').APIResponse} response
 * @param {import('./ToolshopApiClient').ToolshopApiClient} client
 */
async function expectLoginSuccess(response, client) {
  await expectStatus(response, 200);

  const body = await response.json();
  expect(body.access_token).toBeTruthy();
  expect(body.token_type).toMatch(/bearer/i);
  expect(typeof body.expires_in).toBe('number');
  expect(body.expires_in).toBeGreaterThan(0);
  expect(client.token).toBe(body.access_token);

  return body;
}

function getCartLineItems(cartBody) {
  return cartBody.cart_items || cartBody.items || [];
}

function getInvoiceLineItems(invoiceBody) {
  return invoiceBody.invoicelines || invoiceBody.invoice_lines || [];
}

/**
 * @param {import('@playwright/test').APIResponse} response
 * @param {number} [minInStock=1]
 */
async function expectProductsSuccess(response, minInStock = 1) {
  await expectStatus(response, 200);

  const body = await response.json();
  const products = body.data || body;
  const inStock = products.filter((product) => product.in_stock);

  expect(inStock.length).toBeGreaterThanOrEqual(minInStock);
  inStock.slice(0, minInStock).forEach((product) => {
    expect(product.id).toBeTruthy();
    expect(product.name).toBeTruthy();
    expect(product.in_stock).toBe(true);
  });

  return { body, inStock };
}

/**
 * @param {import('@playwright/test').APIResponse} response
 */
async function expectCartCreated(response) {
  await expectStatus(response, 201);

  const body = await response.json();
  expect(body.id).toBeTruthy();

  return body;
}

/**
 * @param {import('@playwright/test').APIResponse} response
 */
async function expectCartItemAdded(response) {
  await expectStatus(response, 200);

  const body = await response.json();
  expect(body.result).toMatch(/item added|updated/i);

  return body;
}

/**
 * @param {import('@playwright/test').APIResponse} response
 */
async function expectCartRetrieved(response) {
  await expectStatus(response, 200);
  return response.json();
}

/**
 * @param {object} cartBody
 * @param {Array<{ id: string }>} products
 * @param {number} quantity
 */
function expectCartContainsProducts(cartBody, products, quantity) {
  const lineItems = getCartLineItems(cartBody);

  expect(lineItems.length).toBe(products.length);

  products.forEach((product) => {
    const lineItem = lineItems.find(
      (item) =>
        item.product_id === product.id || item.product?.id === product.id,
    );

    expect(lineItem).toBeTruthy();
    expect(lineItem.quantity).toBe(quantity);
  });
}

/**
 * @param {import('@playwright/test').APIResponse} response
 * @param {{
 *   requestPayload: object,
 *   products: Array<{ id: string }>,
 *   quantity: number,
 * }} context
 */
async function expectInvoiceCreated(response, context) {
  const status = response.status();
  if (status !== 201) {
    const errorBody = await response.text();
    expect(status, `Invoice request failed: ${errorBody}`).toBe(201);
  }

  const body = await response.json();
  expect(body.id).toBeTruthy();
  expect(body.invoice_number).toMatch(/^INV-/);
  expect(body.invoice_date).toBeTruthy();
  expect(body.user_id).toBeTruthy();
  expect(typeof body.subtotal).toBe('number');
  expect(typeof body.total).toBe('number');
  expect(body.total).toBeGreaterThan(0);
  expect(body.billing_street).toBe(context.requestPayload.billing_street);
  expect(body.billing_city).toBe(context.requestPayload.billing_city);
  expect(body.billing_state).toBe(context.requestPayload.billing_state);
  expect(body.billing_country).toBe(context.requestPayload.billing_country);
  expect(body.billing_postal_code).toBe(
    context.requestPayload.billing_postal_code,
  );

  const lineItems = getInvoiceLineItems(body);
  if (lineItems.length > 0) {
    expect(lineItems.length).toBe(context.products.length);

    context.products.forEach((product) => {
      const lineItem = lineItems.find(
        (entry) => entry.product_id === product.id,
      );

      expect(lineItem).toBeTruthy();
      expect(lineItem.quantity).toBe(context.quantity);
      if (lineItem.invoice_id) {
        expect(lineItem.invoice_id).toBe(body.id);
      }
    });
  }

  return body;
}

/**
 * @param {import('@playwright/test').APIResponse} response
 * @param {{ id: string, invoice_number: string }} invoice
 */
async function expectInvoiceListed(response, invoice) {
  await expectStatus(response, 200);

  const listBody = await response.json();
  const entries = listBody.data || listBody;
  const match = entries.find(
    (entry) =>
      entry.invoice_number === invoice.invoice_number || entry.id === invoice.id,
  );

  expect(match).toBeTruthy();
  expect(match.invoice_number).toBe(invoice.invoice_number);
  expect(match.id).toBe(invoice.id);

  return match;
}

module.exports = {
  expectStatus,
  expectRegisterSuccess,
  expectLoginSuccess,
  getCartLineItems,
  getInvoiceLineItems,
  expectProductsSuccess,
  expectCartCreated,
  expectCartItemAdded,
  expectCartRetrieved,
  expectCartContainsProducts,
  expectInvoiceCreated,
  expectInvoiceListed,
};
