import {
  link,
  paypalOptions,
  PayPalOrderResponse,
  paypalPayload,
} from "../types/paypal";

export class Paypal {
  constructor(private options: paypalOptions) {
    this.options.sandbox = options.sandbox || false;
  }

  getApiBaseUrl() {
    return this.options.sandbox
      ? "https://api-m.sandbox.paypal.com"
      : "https://api.paypal.com"; //TODO: check and update the url
  }

  getClientId() {
    return this.options.clientId;
  }

  getClientSecret() {
    return this.options.clientSecret;
  }

  getApiCheckoutUrl() {
    return `${this.getApiBaseUrl()}/v2/checkout/orders`;
  }
}

export class UnifyPaypal {
  constructor(private paypal: Paypal) {}

  private async fetch(
    url: string,
    params: {
      method?: string;
      headers: HeadersInit;
      body: BodyInit;
    }
  ) {
    return await fetch(url, {
      method: params?.method || "GET",
      headers: params.headers,
      body: params?.body,
    });
  }

  async getAccessToken() {
    const url = `${this.paypal.getApiBaseUrl()}/v1/oauth2/token`;

    const auth = btoa(
      `${this.paypal.getClientId()}:${this.paypal.getClientSecret()}`
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error)); //TODO: handle error
    return response.access_token;
  }

  async getCheckoutUrl(payload: paypalPayload) {
    const accessToken = await this.getAccessToken();
    const res = await this.fetch(this.paypal.getApiCheckoutUrl(), {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const resData = (await res.json()) as PayPalOrderResponse;
    return resData.links.find((link) => link.rel === "approve")?.href;
  }
}
