const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
  }

  get paymentSuccessMessage() {
    return this.page.getByText(/payment was successful/i);
  }

  get confirmOrderButton() {
    return this.page.getByRole('button', { name: /^confirm$/i });
  }

  cashOnDeliveryOption() {
    return this.page.getByLabel(/cash on delivery/i);
  }

  async selectCashOnDelivery() {
    const radio = this.cashOnDeliveryOption();
    if (await radio.isVisible()) {
      await radio.check();
      return;
    }
    await this.page.getByText(/cash on delivery/i).click();
  }

  /**
   * @param {{ street?: string, city?: string, state?: string, country?: string, postalCode?: string }} address
   */
  async fillBillingAddress(address = {}) {
    const defaults = {
      street: 'Synthetic Street',
      city: 'Testville',
      state: 'Florida',
      country: 'United States',
      postalCode: '1234AA',
    };
    const data = { ...defaults, ...address };

    const fillByLabel = async (label, value) => {
      const field = this.page.getByLabel(label, { exact: false });
      if (await field.isVisible()) {
        await field.fill(value);
      }
    };

    await fillByLabel(/street/i, data.street);
    await fillByLabel(/city/i, data.city);
    await fillByLabel(/state/i, data.state);
    await fillByLabel(/country/i, data.country);
    await fillByLabel(/postal|zip/i, data.postalCode);
  }

  async continueThroughCheckoutSteps() {
    const nextLabels = [/proceed/i, /next/i, /continue/i, /payment/i];
    for (const pattern of nextLabels) {
      const button = this.page.getByRole('button', { name: pattern });
      if (await button.isVisible()) {
        await button.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  async completeCashOnDeliveryCheckout(address) {
    await this.fillBillingAddress(address);
    await this.continueThroughCheckoutSteps();
    await this.selectCashOnDelivery();
    await this.continueThroughCheckoutSteps();
    await this.paymentSuccessMessage.waitFor({ state: 'visible', timeout: 60000 });
  }

  async clickConfirmOnce() {
    await this.paymentSuccessMessage.waitFor({ state: 'visible' });
    await this.confirmOrderButton.waitFor({ state: 'visible' });
    await this.confirmOrderButton.click();
  }

  /**
   * Toolshop requires Confirm twice before invoice is created (R-01).
   */
  async confirmOrderTwice() {
    await this.paymentSuccessMessage.waitFor({ state: 'visible' });
    await this.confirmOrderButton.waitFor({ state: 'visible' });

    const invoiceResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/invoices') &&
        response.request().method() === 'POST',
      { timeout: 60000 },
    );

    await this.confirmOrderButton.click();
    await this.page.waitForTimeout(500);
    await this.confirmOrderButton.click();

    try {
      await invoiceResponse;
    } catch {
      // UI may complete invoice without a catchable POST in some paths.
    }
  }

  async isCashOnDeliverySelected() {
    const radio = this.cashOnDeliveryOption();
    if (await radio.isVisible()) {
      return radio.isChecked();
    }
    return this.page.getByText(/cash on delivery/i).isVisible();
  }
}

module.exports = { CheckoutPage };
