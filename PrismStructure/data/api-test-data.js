const uiData = require('./ui-test-data');

const endpoints = {
  register: '/users/register',
  login: '/users/login',
  products: '/products',
  carts: '/carts',
  invoices: '/invoices',
};

const seededUser = {
  email: process.env.TOOLSHOP_API_EMAIL || uiData.seededUser.email,
  password: process.env.TOOLSHOP_API_PASSWORD || uiData.seededUser.password,
};

const invalidLogin = {
  email: seededUser.email,
  password: uiData.invalidLogin.password,
};

const registration = {
  firstName: uiData.registration.firstName,
  lastName: uiData.registration.lastName,
  password: uiData.registration.password,
};

const duplicateRegistration = {
  firstName: uiData.duplicateRegistration.firstName,
  lastName: uiData.duplicateRegistration.lastName,
  email: uiData.duplicateRegistration.email,
  password: uiData.duplicateRegistration.password,
};

const cart = {
  initialQuantity: uiData.cart.initialQuantity,
  updatedQuantity: uiData.cart.updatedQuantity,
};

const invoice = {
  paymentMethod: 'cash-on-delivery',
  paymentDetails: {},
  billing: {
    billing_street: uiData.checkout.billingAddress.street,
    billing_city: uiData.checkout.billingAddress.city,
    billing_state: 'Test State',
    billing_country: 'TS',
    billing_postal_code: uiData.checkout.billingAddress.postalCode,
  },
};

function buildRegistrationBody(suffix = Date.now()) {
  return {
    first_name: registration.firstName,
    last_name: registration.lastName,
    email: `john.doe.${suffix}@example.com`,
    password: registration.password,
  };
}

module.exports = {
  endpoints,
  seededUser,
  invalidLogin,
  registration,
  duplicateRegistration,
  cart,
  invoice,
  buildRegistrationBody,
};
