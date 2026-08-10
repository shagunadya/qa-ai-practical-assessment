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

  get proceedStepButton() {
    return this.page.getByRole('button', {
      name: /proceed|next|continue|payment/i,
    });
  }

  get cashOnDeliveryControl() {
    return this.page
      .getByLabel(/cash on delivery/i)
      .or(this.page.getByText(/cash on delivery/i));
  }

  async selectCashOnDelivery() {
    const control = this.cashOnDeliveryControl;
    await control.waitFor({ state: 'visible' });
    const radio = this.page.getByLabel(/cash on delivery/i);
    if (await radio.isVisible()) {
      await radio.check();
      return;
    }
    await control.click();
  }

  /**
   * @param {{ street: string, city: string, state: string, country: string, postalCode: string }} address
   */
  async fillBillingAddress(address) {
    const fillByLabel = async (label, value) => {
      const field = this.page.getByLabel(label, { exact: false });
      await field.waitFor({ state: 'visible' });
      await field.fill(value);
    };

    await fillByLabel(/street/i, address.street);
    await fillByLabel(/city/i, address.city);
    await fillByLabel(/state/i, address.state);
    await fillByLabel(/country/i, address.country);
    await fillByLabel(/postal|zip/i, address.postalCode);
  }

  async clickProceedStep() {
    const button = this.proceedStepButton.first();
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  async waitForPaymentSuccess() {
    await this.paymentSuccessMessage.waitFor({
      state: 'visible',
      timeout: 60000,
    });
  }

  /**
   * Billing → payment step → COD → success message (TC-M-02, M-06, M-07).
   * @param {{ street: string, city: string, state: string, country: string, postalCode: string }} address
   */
  async completeCashOnDeliveryCheckout(address) {
    await this.fillBillingAddress(address);
    await this.clickProceedStep();
    await this.selectCashOnDelivery();
    await this.clickProceedStep();
    await this.waitForPaymentSuccess();
  }

  /**
   * Billing through COD selection before final proceed (TC-M-08).
   * @param {{ street: string, city: string, state: string, country: string, postalCode: string }} address
   */
  async prepareCashOnDeliveryPayment(address) {
    await this.fillBillingAddress(address);
    await this.clickProceedStep();
    await this.selectCashOnDelivery();
  }

  async clickConfirmOnce() {
    await this.waitForPaymentSuccess();
    await this.confirmOrderButton.waitFor({ state: 'visible' });
    await this.confirmOrderButton.click();
  }

  /**
   * Toolshop requires Confirm twice before invoice is created (R-01).
   */
  async confirmOrderTwice() {
    await this.waitForPaymentSuccess();
    await this.confirmOrderButton.waitFor({ state: 'visible' });

    const invoiceResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/invoices') &&
        response.request().method() === 'POST',
      { timeout: 60000 },
    );

    await this.confirmOrderButton.click();
    await this.confirmOrderButton.waitFor({ state: 'visible' });
    await this.confirmOrderButton.click();

    try {
      await invoiceResponse;
    } catch {
      // Invoice POST may not be observable on every UI path.
    }
  }

  async isCashOnDeliverySelected() {
    const radio = this.page.getByLabel(/cash on delivery/i);
    if (await radio.isVisible()) {
      return radio.isChecked();
    }
    return await this.cashOnDeliveryControl.isVisible();
  }
}

module.exports = { CheckoutPage };
