const { test } = require('../../../fixtures/api-fixtures');
const apiData = require('../../../data/api-test-data');
const {
  expectProductsSuccess,
  expectCartCreated,
  expectCartItemAdded,
  expectCartRetrieved,
  expectCartContainsProducts,
} = require('../../../api/api-assertions');

test.describe('API cart lifecycle @smoke', () => {
  test('authenticate create cart add product and verify contents @smoke', async ({
    registeredUser,
  }) => {
    const { client } = registeredUser;

    const cartResponse = await client.createCart();
    const cart = await expectCartCreated(cartResponse);

    const { response: productsResponse, products } =
      await client.fetchInStockProducts(1);
    await expectProductsSuccess(productsResponse, 1);

    const addResponse = await client.addToCart(
      cart.id,
      products[0].id,
      apiData.cart.initialQuantity,
    );
    await expectCartItemAdded(addResponse);

    const verifyResponse = await client.getCart(cart.id);
    const verifiedCart = await expectCartRetrieved(verifyResponse);
    expectCartContainsProducts(
      verifiedCart,
      [products[0]],
      apiData.cart.initialQuantity,
    );
  });
});
