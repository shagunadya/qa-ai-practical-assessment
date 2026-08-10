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
    return this.productNames.filter({ hasText: productName });
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
    await this.openProductDetail(productName);
    await this.addToCartButton.click();
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
