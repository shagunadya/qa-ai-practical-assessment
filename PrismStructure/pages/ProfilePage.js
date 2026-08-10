const { BasePage } = require('./BasePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/account/profile';
  }

  get profileNav() {
    return this.page.getByTestId('nav-profile');
  }

  async openViaMenu() {
    await this.openAccountMenu();
    const profileLink = this.profileNav;
    if (await profileLink.isVisible()) {
      await profileLink.click();
    } else {
      await this.page.getByRole('link', { name: /profile|account/i }).click();
    }
    await this.page.waitForURL(/account/);
  }

  async open() {
    await this.goto(this.path);
  }

  profileText(text) {
    return this.page.getByText(text, { exact: false });
  }
}

module.exports = { ProfilePage };
