const { test, expect } = require('@playwright/test');
const apiData = require('../../data/api-test-data');
const { ToolshopApiClient } = require('../../api/ToolshopApiClient');

test.describe('API cart lifecycle @regression', () => {
  test('create cart add products and verify cart @regression', async ({
    request,
  }) => {
    const client = new ToolshopApiClient(request);
    const registerBody = apiData.buildRegistrationBody();

    await client.register(registerBody);
    await client.login(registerBody.email, registerBody.password);

    const productsResponse = await client.getProducts();
    const products = client.pickInStockProducts(
      await productsResponse.json(),
      2,
    );

    const cartResponse = await client.createCart();
    expect(cartResponse.ok()).toBeTruthy();
    const cart = await cartResponse.json();

    for (const product of products) {
      const addResponse = await client.addToCart(
        cart.id,
        product.id,
        apiData.cart.initialQuantity,
      );
      expect(addResponse.ok()).toBeTruthy();
    }

    const verifyResponse = await client.getCart(cart.id);
    expect(verifyResponse.ok()).toBeTruthy();
    const verified = await verifyResponse.json();
    const lineItems = verified.cart_items || verified.items || [];

    expect(lineItems.length).toBeGreaterThanOrEqual(2);
  });
});
