const { BasePage } = require('./BasePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/account/profile';
  }

  get profileNav() {
    return this.page.getByTestId('nav-profile');
  }

  get profileNavLink() {
    return this.profileNav.or(
      this.page.getByRole('link', { name: /profile|account/i }),
    );
  }

  async openViaMenu() {
    await this.openAccountMenu();
    await this.profileNavLink.click();
    await this.page.waitForURL(/account/);
  }

  async open() {
    await this.goto(this.path);
  }

  profileField(text) {
    return this.page.getByText(text, { exact: false });
  }
}

module.exports = { ProfilePage };
