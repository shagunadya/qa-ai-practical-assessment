const { test } = require('../../../fixtures/api-fixtures');
const apiData = require('../../../data/api-test-data');
const {
  expectProductsSuccess,
  expectCartCreated,
  expectCartItemAdded,
  expectCartRetrieved,
  expectCartContainsProducts,
} = require('../../../api/api-assertions');

test.describe('API-AC1 Cart lifecycle @regression', () => {
  test('create cart add products and verify cart @regression', async ({
    registeredUser,
  }) => {
    const { client } = registeredUser;

    const cartResponse = await client.createCart();
    const cart = await expectCartCreated(cartResponse);

    const { response: productsResponse, products } =
      await client.fetchInStockProducts(2);
    await expectProductsSuccess(productsResponse, 2);

    for (const product of products) {
      const addResponse = await client.addToCart(
        cart.id,
        product.id,
        apiData.cart.initialQuantity,
      );
      await expectCartItemAdded(addResponse);
    }

    const verifyResponse = await client.getCart(cart.id);
    const verifiedCart = await expectCartRetrieved(verifyResponse);
    expectCartContainsProducts(
      verifiedCart,
      products,
      apiData.cart.initialQuantity,
    );
  });
});
