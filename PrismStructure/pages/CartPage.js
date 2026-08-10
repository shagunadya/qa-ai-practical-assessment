const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/cart';
  }

  get proceedToCheckoutButton() {
    return this.page.getByTestId('proceed-1');
  }

  get emptyCartMessage() {
    return this.page.getByText(/your cart is empty/i);
  }

  get cartTotal() {
    return this.page.getByTestId('cart-total');
  }

  get lineItemNames() {
    return this.page.getByTestId('product-name');
  }

  async open() {
    await this.goto(this.path);
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
    await this.page.waitForTimeout(500);
  }

  async getLineItemCount() {
    return this.lineItemNames.count();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}

module.exports = { CartPage };
