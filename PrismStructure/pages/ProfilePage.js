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
    return this.page.getByTestId('nav-my-profile');
  }

  async openViaMenu() {
    const accountProfileButton = this.page.getByRole('button', {
      name: /^profile$/i,
    });
    if (await accountProfileButton.isVisible()) {
      await accountProfileButton.click();
      await this.page.waitForURL(/profile/);
      return;
    }

    await this.openAccountMenu();
    await this.profileNavLink.click();
    await this.page.waitForURL(/profile/);
  }

  async open() {
    await this.goto(this.path);
  }

  profileField(text) {
    return this.page
      .getByText(text, { exact: false })
      .or(this.page.locator(`input[value="${text}"]`));
  }
}

module.exports = { ProfilePage };
