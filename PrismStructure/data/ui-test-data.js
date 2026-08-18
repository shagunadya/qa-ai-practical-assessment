/**
 * Static UI test data — synthetic values only.
 * Credentials load from env when set; otherwise use public demo defaults.
 */

const registration = {
  firstName: 'John',
  lastName: 'Doe',
  password: 'SuperSecure@123',
  dob: '1970-01-01',
  country: 'United States of America (the)',
  postalCode: '1234AA',
  houseNumber: '42',
  street: 'Synthetic Street',
  city: 'Testville',
  state: 'Florida',
  phone: '5551234567',
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
  password: 'Qa!DuplicateTest#9',
  dob: registration.dob,
  country: registration.country,
  postalCode: registration.postalCode,
  houseNumber: registration.houseNumber,
  street: registration.street,
  city: registration.city,
  state: registration.state,
  phone: registration.phone,
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
  /** Jane Doe seeded profile (NL) — avoids invoice API 422 on shared demo user */
  billingAddress: {
    street: 'Kanhaistraat',
    city: 'Scherpenzeel',
    state: 'Groningen',
    country: 'Netherlands',
    postalCode: '1122AB',
    houseNumber: '1',
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
    password: `Qa!Test${suffix}#9`,
    dob: registration.dob,
    country: registration.country,
    postalCode: registration.postalCode,
    houseNumber: registration.houseNumber,
    street: registration.street,
    city: registration.city,
    state: registration.state,
    phone: registration.phone,
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
