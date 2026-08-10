const { test: base, expect } = require('@playwright/test');
const apiData = require('../data/api-test-data');
const { ToolshopApiClient } = require('../api/ToolshopApiClient');
const {
  expectRegisterSuccess,
  expectLoginSuccess,
  expectProductsSuccess,
  expectCartCreated,
  expectCartItemAdded,
  expectCartRetrieved,
  expectCartContainsProducts,
} = require('../api/api-assertions');

const test = base.extend({
  apiClient: async ({ request }, use) => {
    const client = new ToolshopApiClient(request);
    await use(client);
  },

  registrationBody: async ({}, use) => {
    await use({
      ...apiData.buildRegistrationBody(),
      address: {
        street: apiData.registrationAddress.street,
        city: apiData.registrationAddress.city,
        country: apiData.registrationAddress.country,
      },
      phone: '5551234567',
      dob: '1970-01-01',
    });
  },

  registeredUser: async ({ apiClient, registrationBody }, use) => {
    const registerResponse = await apiClient.register(registrationBody);
    await expectRegisterSuccess(registerResponse, registrationBody);

    const loginResponse = await apiClient.login(
      registrationBody.email,
      registrationBody.password,
    );
    await expectLoginSuccess(loginResponse, apiClient);

    await use({
      client: apiClient,
      body: registrationBody,
      token: apiClient.token,
    });

    apiClient.clearToken();
  },

  cartWithProducts: async ({ registeredUser }, use) => {
    const { client } = registeredUser;
    const quantity = apiData.cart.initialQuantity;

    const cartResponse = await client.createCart();
    const cart = await expectCartCreated(cartResponse);

    const { response: productsResponse, products } =
      await client.fetchInStockProducts(1);
    await expectProductsSuccess(productsResponse, 1);

    const addResponse = await client.addToCart(
      cart.id,
      products[0].id,
      quantity,
    );
    await expectCartItemAdded(addResponse);

    const verifyResponse = await client.getCart(cart.id);
    const verifiedCart = await expectCartRetrieved(verifyResponse);
    expectCartContainsProducts(verifiedCart, products, quantity);

    await use({
      client,
      cart,
      products,
      quantity,
    });
  },
});

module.exports = { test, expect };
