/**
 * Static UI test data — synthetic values only.
 * Credentials load from env when set; otherwise use public demo defaults.
 */

const registration = {
  firstName: 'John',
  lastName: 'Doe',
  password: 'SuperSecure@123',
};

const seededUser = {
  email: process.env.TOOLSHOP_UI_EMAIL || 'customer@practicesoftwaretesting.com',
  password: process.env.TOOLSHOP_UI_PASSWORD || 'welcome01',
  displayName: 'Jane Doe',
};

const invalidLogin = {
  email: seededUser.email,
  password: 'wrongpassword',
};

const duplicateRegistration = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: seededUser.email,
  password: registration.password,
};

const products = {
  productA: 'Combination Pliers',
  productB: 'Pliers',
  productSingle: 'Combination Pliers',
};

const cart = {
  initialQuantity: 1,
  updatedQuantity: 2,
};

const checkout = {
  paymentMethodLabel: 'Cash on Delivery',
  billingAddress: {
    street: 'Synthetic Street',
    city: 'Testville',
    state: 'Florida',
    country: 'United States',
    postalCode: '1234AA',
  },
};

const invoice = {
  confirmClicks: 2,
  numberPattern: /INV-\d+/,
};

function buildRegistrationUser(suffix = Date.now()) {
  return {
    firstName: registration.firstName,
    lastName: registration.lastName,
    email: `john.doe.${suffix}@example.com`,
    password: registration.password,
  };
}

module.exports = {
  registration,
  seededUser,
  invalidLogin,
  duplicateRegistration,
  products,
  cart,
  checkout,
  invoice,
  buildRegistrationUser,
};
