const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/auth/register';
  }

  get form() {
    return this.page.getByTestId('register-form');
  }

  get submitButton() {
    return this.page.getByTestId('register-submit');
  }

  async open() {
    await this.goto(this.path);
    await this.form.waitFor({ state: 'visible' });
  }

  async fillField(testId, value) {
    const field = this.page.getByTestId(testId);
    const input = field.locator('input, textarea, select').first();
    if (await input.count()) {
      await input.fill(value);
      return;
    }
    await field.fill(value);
  }

  /**
   * @param {{ firstName: string, lastName: string, email: string, password: string }} user
   */
  async register(user) {
    await this.fillField('first-name', user.firstName);
    await this.fillField('last-name', user.lastName);
    await this.fillField('email', user.email);
    await this.fillField('password', user.password);
    await this.submitButton.click();
  }
}

module.exports = { RegisterPage };
