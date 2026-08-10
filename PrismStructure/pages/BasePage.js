/**
 * Shared navigation helpers for Toolshop UI pages.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  get cartLink() {
    return this.page
      .getByTestId('nav-cart')
      .or(this.page.getByRole('link', { name: /^cart$/i }));
  }

  get accountMenu() {
    return this.page.getByTestId('nav-menu');
  }

  get alertMessage() {
    return this.page.getByRole('alert');
  }

  async openCart() {
    if (await this.cartLink.isVisible()) {
      await this.cartLink.click();
      await this.page.waitForURL(/\/(cart|checkout)/);
      return;
    }
    await this.goto('/checkout');
  }

  async openAccountMenu() {
    await this.accountMenu.click();
  }
}

module.exports = { BasePage };
