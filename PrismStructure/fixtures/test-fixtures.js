const { test: base, expect } = require('@playwright/test');
const pages = require('../pages');
const uiData = require('../data/ui-test-data');
const { ToolshopApiClient } = require('../api/ToolshopApiClient');

const test = base.extend({
  registerPage: async ({ page }, use) => {
    await use(new pages.RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new pages.LoginPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new pages.ProfilePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new pages.ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new pages.CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new pages.CheckoutPage(page));
  },
  invoicesPage: async ({ page }, use) => {
    await use(new pages.InvoicesPage(page));
  },
  seededCredentials: async ({}, use) => {
    await use({
      email: uiData.seededUser.email,
      password: uiData.seededUser.password,
      displayName: uiData.seededUser.displayName,
    });
  },
  apiClient: async ({ request }, use) => {
    const client = new ToolshopApiClient(request);
    await use(client);
  },
});

module.exports = { test, expect };
