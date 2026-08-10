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

const registrationAddress = {
  street: 'Test street 98',
  city: 'Vienna',
  country: 'Austria',
};

const invoice = {
  paymentMethod: 'cash-on-delivery',
  paymentDetails: {},
  billing: {
    billing_street: registrationAddress.street,
    billing_city: registrationAddress.city,
    billing_state: 'N/A',
    billing_country: registrationAddress.country,
    billing_postal_code: '1010',
  },
};

function buildRegistrationBody(suffix = Date.now()) {
  return {
    first_name: registration.firstName,
    last_name: registration.lastName,
    email: `john.doe.${suffix}@example.com`,
    password: `Qa!Test${suffix}#9`,
  };
}

function buildInvoicePayload(cartId, overrides = {}) {
  return {
    cart_id: cartId,
    payment_method: invoice.paymentMethod,
    payment_details: invoice.paymentDetails,
    ...invoice.billing,
    ...overrides,
  };
}

function mapProfileAddressToBilling(address = {}) {
  return {
    billing_street: address.street,
    billing_city: address.city,
    billing_state: address.state == null ? ' ' : address.state,
    billing_country: address.country,
    billing_postal_code: address.postal_code == null ? ' ' : address.postal_code,
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
  registrationAddress,
  buildRegistrationBody,
  buildInvoicePayload,
  mapProfileAddressToBilling,
};
