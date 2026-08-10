const { BasePage } = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/';
  }

  get searchInput() {
    return this.page.getByTestId('search-query');
  }

  get searchSubmit() {
    return this.page.getByTestId('search-submit');
  }

  get productNames() {
    return this.page.getByTestId('product-name');
  }

  async open() {
    await this.goto(this.path);
    await this.productNames.first().waitFor({ state: 'visible', timeout: 30000 });
  }

  async searchByName(productName) {
    await this.searchInput.fill(productName);
    await this.searchSubmit.click();
    await this.productNames.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  productCardByName(productName) {
    return this.page.getByRole('link').filter({ hasText: productName });
  }

  async openProductDetail(productName) {
    await this.searchByName(productName);
    await this.productNames.filter({ hasText: productName }).first().click();
    await this.page.waitForURL(/product/);
  }

  async addProductToCart(productName) {
    await this.openProductDetail(productName);
    const addButton = this.page.getByTestId('add-to-cart');
    if (await addButton.isVisible()) {
      await addButton.click();
      return;
    }
    await this.page.getByRole('button', { name: /add to cart/i }).click();
  }
}

module.exports = { ProductsPage };
