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

  get signInButton() {
    return this.submitButton.or(
      this.page.getByRole('button', { name: /^login$/i }),
    );
  }

  get errorMessage() {
    return this.alertMessage.or(
      this.page.getByText(/invalid email or password/i),
    );
  }

  async open() {
    await this.goto(this.path);
    await this.form.waitFor({ state: 'visible' });
  }

  async submitCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
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

  /**
   * Re-authenticate when checkout or direct navigation drops the UI session.
   */
  async ensureLoggedIn(email, password) {
    if (await this.accountMenu.isVisible()) {
      return;
    }

    await this.open();
    await this.login(email, password);
    await this.accountMenu.waitFor({ state: 'visible', timeout: 15000 });
  }

  signedInAs(displayName) {
    return this.page
      .getByRole('button', { name: displayName })
      .or(this.accountMenu);
  }
}

module.exports = { LoginPage };
