/**
 * Shared navigation and navigation helpers for Toolshop UI pages.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  get cartLink() {
    return this.page.getByTestId('nav-cart');
  }

  get accountMenu() {
    return this.page.getByTestId('nav-menu');
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForURL(/\/(cart|checkout)/);
  }

  async openAccountMenu() {
    await this.accountMenu.click();
  }
}

module.exports = { BasePage };
