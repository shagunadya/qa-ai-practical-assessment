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

  get errorMessage() {
    return this.alertMessage.or(
      this.page.getByText(/email.*(already|taken|registered|exists)/i),
    );
  }

  async open() {
    await this.goto(this.path);
    await this.form.waitFor({ state: 'visible' });
  }

  fieldByTestId(testId) {
    return this.page.getByTestId(testId);
  }

  async fillField(testId, value) {
    const field = this.fieldByTestId(testId);
    const input = field.locator('input, textarea, select').first();
    if (await input.count()) {
      await input.fill(value);
      return;
    }
    await field.fill(value);
  }

  async fillRegistrationForm(user) {
    await this.fillField('first-name', user.firstName);
    await this.fillField('last-name', user.lastName);
    await this.page.getByRole('textbox', { name: /date of birth/i }).fill(user.dob);
    await this.page.getByRole('combobox', { name: /country/i }).selectOption(user.country);
    await this.page.getByRole('textbox', { name: /postal code/i }).fill(user.postalCode);
    await this.page.getByRole('textbox', { name: /house number/i }).fill(user.houseNumber);
    await this.page.getByRole('textbox', { name: /^street$/i }).fill(user.street);
    await this.page.getByRole('textbox', { name: /^city$/i }).fill(user.city);
    await this.page.getByRole('textbox', { name: /^state$/i }).fill(user.state);
    await this.page.getByRole('textbox', { name: /^phone$/i }).fill(user.phone);
    await this.fillField('email', user.email);
    await this.fillField('password', user.password);
  }

  async submitRegistration() {
    await this.submitButton.click();
  }

  /**
   * @param {{
   *   firstName: string,
   *   lastName: string,
   *   email: string,
   *   password: string,
   *   dob: string,
   *   country: string,
   *   postalCode: string,
   *   houseNumber: string,
   *   street: string,
   *   city: string,
   *   state: string,
   *   phone: string,
   * }} user
   */
  async register(user) {
    await this.fillRegistrationForm(user);
    await this.submitRegistration();
    await this.page.waitForURL(
      (url) => !url.pathname.includes('/auth/register'),
      { timeout: 30000 },
    );
  }

  async attemptRegister(user) {
    await this.fillRegistrationForm(user);
    await this.submitRegistration();
  }
}

module.exports = { RegisterPage };
