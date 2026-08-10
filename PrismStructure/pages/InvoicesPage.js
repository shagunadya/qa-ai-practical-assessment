const { BasePage } = require('./BasePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/account/invoices';
  }

  get myInvoicesNav() {
    return this.page.getByTestId('nav-my-invoices');
  }

  get invoiceRows() {
    return this.page.locator('table tbody tr');
  }

  get invoiceNumberPattern() {
    return /INV-\d+/;
  }

  async open() {
    await this.goto(this.path);
  }

  async openViaMenu() {
    await this.openAccountMenu();
    await this.myInvoicesNav.click();
    await this.page.waitForURL(/invoice/);
  }

  invoiceRowByNumber(invoiceNumber) {
    return this.page.getByRole('row').filter({ hasText: invoiceNumber });
  }

  async getLatestInvoiceNumber() {
    await this.invoiceRows.first().waitFor({ state: 'visible', timeout: 30000 });
    const row = this.invoiceRows.first();
    const text = await row.innerText();
    const match = text.match(this.invoiceNumberPattern);
    return match ? match[0] : text.trim().split(/\s+/)[0];
  }

  async getInvoiceRowCount() {
    return this.invoiceRows.count();
  }
}

module.exports = { InvoicesPage };
