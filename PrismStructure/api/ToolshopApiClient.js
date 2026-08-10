const apiData = require('../data/api-test-data');

class ToolshopApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} [baseURL]
   */
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL =
      baseURL ||
      process.env.API_BASE_URL ||
      'https://api.practicesoftwaretesting.com';
    this.token = null;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  clearToken() {
    this.token = null;
  }

  async register(body) {
    return this.request.post(
      `${this.baseURL}${apiData.endpoints.register}`,
      { data: body },
    );
  }

  async login(email, password) {
    const response = await this.request.post(
      `${this.baseURL}${apiData.endpoints.login}`,
      { data: { email, password } },
    );

    if (response.ok()) {
      const body = await response.json();
      this.token = body.access_token;
    }

    return response;
  }

  async getProducts() {
    return this.request.get(`${this.baseURL}${apiData.endpoints.products}`);
  }

  async createCart() {
    return this.request.post(`${this.baseURL}${apiData.endpoints.carts}`, {
      headers: this.authHeaders(),
    });
  }

  async addToCart(cartId, productId, quantity) {
    return this.request.post(
      `${this.baseURL}${apiData.endpoints.carts}/${cartId}`,
      {
        headers: this.authHeaders(),
        data: { product_id: productId, quantity },
      },
    );
  }

  async getCart(cartId) {
    return this.request.get(
      `${this.baseURL}${apiData.endpoints.carts}/${cartId}`,
      { headers: this.authHeaders() },
    );
  }

  async createInvoice(cartId, billingOverrides = {}) {
    const payload = apiData.buildInvoicePayload(cartId, billingOverrides);

    return this.request.post(`${this.baseURL}${apiData.endpoints.invoices}`, {
      headers: this.authHeaders(),
      data: payload,
    });
  }

  async getProfile() {
    return this.request.get(`${this.baseURL}/users/me`, {
      headers: this.authHeaders(),
    });
  }

  async getInvoices() {
    return this.request.get(`${this.baseURL}${apiData.endpoints.invoices}`, {
      headers: this.authHeaders(),
    });
  }

  pickInStockProducts(catalogBody, count = 2) {
    const items = catalogBody.data || catalogBody;
    const inStock = items.filter((item) => item.in_stock);
    return inStock.slice(0, count);
  }

  /**
   * @param {number} [count=2]
   */
  async fetchInStockProducts(count = 2) {
    const response = await this.getProducts();
    const body = await response.json();

    return {
      response,
      products: this.pickInStockProducts(body, count),
    };
  }
}

module.exports = { ToolshopApiClient };
