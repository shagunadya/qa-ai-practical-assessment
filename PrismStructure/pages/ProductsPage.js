const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/';
  }

  get searchInput() {
    return this.page
      .getByTestId('search-query')
      .or(this.page.getByRole('textbox', { name: /^search$/i }));
  }

  get searchSubmit() {
    return this.page
      .getByTestId('search-submit')
      .or(this.page.getByRole('button', { name: /^search$/i }));
  }

  get productNames() {
    return this.page
      .getByTestId('product-name')
      .or(this.page.getByRole('heading', { level: 5 }));
  }

  get addToCartButton() {
    return this.page
      .getByTestId('add-to-cart')
      .or(this.page.getByRole('button', { name: /add to cart/i }));
  }

  async open() {
    await this.goto(this.path);
    await this.productNames.first().waitFor({ state: 'visible', timeout: 30000 });
  }

  productNameLocator(productName) {
    return this.page.getByRole('heading', { name: productName, exact: true });
  }

  async searchByName(productName) {
    await this.searchInput.fill(productName);
    await this.searchSubmit.click();
    await this.productNameLocator(productName)
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async openProductDetail(productName) {
    await this.searchByName(productName);
    await this.productNameLocator(productName).first().click();
    await this.page.waitForURL(/product/);
  }

  async addProductToCart(productName) {
    await this.open();
    await this.openProductDetail(productName);
    await this.clickAddToCartAndWait();
  }

  async clickAddToCartAndWait() {
    const lineItemAdd = this.page.waitForResponse(
      (response) => {
        const { pathname } = new URL(response.url());
        return (
          response.request().method() === 'POST' &&
          /\/carts\/[^/]+$/.test(pathname) &&
          response.ok()
        );
      },
      { timeout: 15000 },
    );
    await expect(this.addToCartButton).toBeEnabled({ timeout: 15000 });
    await this.addToCartButton.click();
    await lineItemAdd;
  }

  /**
   * @param {string[]} productNames
   */
  async addProductsToCart(productNames) {
    for (const name of productNames) {
      await this.addProductToCart(name);
    }
  }
}

module.exports = { ProductsPage };
