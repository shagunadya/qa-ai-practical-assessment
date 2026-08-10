const { test, expect } = require('@playwright/test');
const { ToolshopApiClient } = require('../../../api/ToolshopApiClient');

test.describe('API products catalog @smoke', () => {
  test('GET products returns in-stock items @smoke', async ({ request }) => {
    const client = new ToolshopApiClient(request);
    const response = await client.getProducts();

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const products = client.pickInStockProducts(body, 3);

    expect(products.length).toBeGreaterThanOrEqual(2);
    products.forEach((product) => {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.in_stock).toBe(true);
    });
  });
});
