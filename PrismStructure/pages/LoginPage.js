const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/auth/login';
  }

  get form() {
    return this.page.getByTestId('login-form');
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: /password/i });
  }

  get submitButton() {
    return this.page.getByTestId('login-submit');
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  async open() {
    await this.goto(this.path);
    await this.form.waitFor({ state: 'visible' });
  }

  async submitCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const submit = this.submitButton;
    if (await submit.isVisible()) {
      await submit.click();
    } else {
      await this.page.getByRole('button', { name: /sign in/i }).click();
    }
  }

  async attemptLogin(email, password) {
    await this.submitCredentials(email, password);
  }

  async login(email, password) {
    await this.submitCredentials(email, password);
    await this.page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 30000,
    });
  }

  accountButton(displayName) {
    return this.page.getByRole('button', { name: displayName });
  }
}

module.exports = { LoginPage };
