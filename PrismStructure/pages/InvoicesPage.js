const { BasePage } = require('./BasePage');
const { parseMoney } = require('../utils/money');

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

  detailsLinkForInvoice(invoiceNumber) {
    return this.invoiceRowByNumber(invoiceNumber).getByRole('link', {
      name: /details/i,
    });
  }

  async openInvoiceDetails(invoiceNumber) {
    await this.detailsLinkForInvoice(invoiceNumber).click();
    await this.page.waitForURL(/\/account\/invoices\//);
  }

  /**
   * Find invoice row whose total matches expected cart/order total.
   * @param {number} expectedTotal
   * @param {number} [precision=0.02]
   */
  async findInvoiceByTotal(expectedTotal, precision = 0.02) {
    const count = await this.invoiceRows.count();
    if (count === 0) {
      return null;
    }

    await this.invoiceRows.first().waitFor({ state: 'visible', timeout: 30000 });

    for (let index = 0; index < count; index += 1) {
      const row = this.invoiceRows.nth(index);
      const rowText = await row.innerText();
      const numberMatch = rowText.match(this.invoiceNumberPattern);
      const totalMatch = rowText.match(/\$[\d,]+(?:\.\d{2})?/);

      if (!numberMatch || !totalMatch) {
        continue;
      }

      const totalAmount = parseMoney(totalMatch[0]);
      if (Math.abs(totalAmount - expectedTotal) <= precision) {
        return {
          invoiceNumber: numberMatch[0],
          totalText: totalMatch[0],
          totalAmount,
          rowText,
        };
      }
    }

    return null;
  }

  async getLatestInvoiceNumber() {
    await this.invoiceRows.first().waitFor({ state: 'visible', timeout: 30000 });
    const row = this.invoiceRows.first();
    const text = await row.innerText();
    const match = text.match(this.invoiceNumberPattern);
    return match ? match[0] : text.trim().split(/\s+/)[0];
  }

  /**
   * @param {string} invoiceNumber
   * @returns {Promise<{ invoiceNumber: string, totalText: string | null, totalAmount: number, rowText: string }>}
   */
  async getInvoiceRowDetails(invoiceNumber) {
    const row = this.invoiceRowByNumber(invoiceNumber);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    const rowText = await row.innerText();
    const totalMatch = rowText.match(/\$[\d,]+(?:\.\d{2})?/);

    return {
      invoiceNumber,
      totalText: totalMatch ? totalMatch[0] : null,
      totalAmount: totalMatch ? parseMoney(totalMatch[0]) : NaN,
      rowText,
    };
  }

  async getInvoiceRowCount() {
    if (!(await this.invoiceRows.count())) {
      return 0;
    }

    try {
      await this.invoiceRows.first().waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      return 0;
    }

    return this.invoiceRows.count();
  }

  /**
   * Highest INV-* suffix in the table (newest invoice on shared demo accounts).
   */
  async getNewestInvoiceNumber() {
    const count = await this.invoiceRows.count();
    if (count === 0) {
      return null;
    }

    await this.invoiceRows.first().waitFor({ state: 'visible', timeout: 30000 });
    let newestNumber = null;
    let newestSuffix = -1;

    for (let index = 0; index < count; index += 1) {
      const text = await this.invoiceRows.nth(index).innerText();
      const match = text.match(/INV-(\d+)/);
      if (!match) {
        continue;
      }

      const suffix = Number(match[1]);
      if (suffix > newestSuffix) {
        newestSuffix = suffix;
        newestNumber = match[0];
      }
    }

    return newestNumber;
  }

  async collectInvoiceNumbers() {
    const count = await this.invoiceRows.count();
    const numbers = [];

    for (let index = 0; index < count; index += 1) {
      const text = await this.invoiceRows.nth(index).innerText();
      const match = text.match(this.invoiceNumberPattern);
      if (match) {
        numbers.push(match[0]);
      }
    }

    return numbers;
  }
}

module.exports = { InvoicesPage };
