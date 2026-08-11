const { BasePage } = require('./BasePage');
const { parseMoney } = require('../utils/money');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/checkout';
  }

  get proceedToCheckoutButton() {
    return this.page
      .getByTestId('proceed-1')
      .or(this.page.getByRole('button', { name: /proceed to checkout/i }));
  }

  get emptyCartMessage() {
    return this.page.getByText(/your cart is empty/i);
  }

  get cartTotal() {
    return this.page.getByTestId('cart-total');
  }

  get lineItemRows() {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('spinbutton'),
    });
  }

  get lineItemNames() {
    return this.lineItemRows.locator('td').first();
  }

  async clearLineItems() {
    await this.open();
    let remaining = await this.lineItemRows.count();
    while (remaining > 0) {
      await this.lineItemRows.first().getByRole('button').click();
      remaining = await this.lineItemRows.count();
    }
  }

  async emptyCart() {
    await this.clearLineItems();
    await this.emptyCartMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async open() {
    await this.openCart();
  }

  lineItemRow(productName) {
    return this.page.getByRole('row').filter({ hasText: productName });
  }

  quantityInputForProduct(productName) {
    return this.lineItemRow(productName).getByRole('spinbutton');
  }

  async updateQuantity(productName, quantity) {
    const qtyInput = this.quantityInputForProduct(productName);
    await qtyInput.fill(String(quantity));
    await qtyInput.blur();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async getCartTotalAmount() {
    await this.cartTotal.waitFor({ state: 'visible', timeout: 15000 });
    const text = await this.cartTotal.innerText();
    return parseMoney(text);
  }

  async getLineItemQuantity(productName) {
    const value = await this.quantityInputForProduct(productName).inputValue();
    return Number(value);
  }
}

module.exports = { CartPage };
