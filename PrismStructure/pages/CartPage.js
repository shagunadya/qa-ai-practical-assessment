const { BasePage } = require('./BasePage');

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
    while ((await this.lineItemRows.count()) > 0) {
      await this.lineItemRows.first().locator('button').click();
    }
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
}

module.exports = { CartPage };
