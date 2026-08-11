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

  get logoutNav() {
    return this.page
      .getByTestId('nav-logout')
      .or(this.page.getByRole('link', { name: /sign out/i }))
      .or(this.page.getByText(/^sign out$/i));
  }

  get signInNav() {
    return this.page.getByTestId('nav-sign-in');
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

  async logout() {
    await this.openAccountMenu();
    await this.logoutNav.click();
    await this.signInNav.waitFor({ state: 'visible', timeout: 15000 });
  }
}

module.exports = { BasePage };
