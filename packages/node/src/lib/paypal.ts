import {
  link,
  paypalAuthResponse,
  paypalOptions,
  PayPalOrderResponse,
  paypalPayload,
} from "../types/paypal";

export class Paypal {
  constructor(private options: paypalOptions) {
    this.options.sandbox = options.sandbox || false;
  }

  getApiBaseUrl() {
    if (this.options.sandbox) {
      return "https://api-m.sandbox.paypal.com";
    }

    return "https://api.paypal.com";
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

  private async fetch<T extends {}>(
    url: string,
    params: {
      method?: string;
      headers: HeadersInit;
      body: BodyInit;
    }
  ) {
    const req = await fetch(url, {
      method: params?.method || "GET",
      headers: params.headers,
      body: params?.body,
    });

    const res = await req.json();

    return res as T;
  }

  async getAccessToken() {
    const url = `${this.paypal.getApiBaseUrl()}/v1/oauth2/token`;

    const auth = btoa(
      `${this.paypal.getClientId()}:${this.paypal.getClientSecret()}`
    );

    const response = await this.fetch<paypalAuthResponse>(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    return response.access_token;
  }

  async getCheckoutUrl(payload: paypalPayload) {
    const accessToken = await this.getAccessToken();

    const res = await this.fetch<PayPalOrderResponse>(
      this.paypal.getApiCheckoutUrl(),
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const url = res.links.find((link) => link.rel === "approve")?.href;

    if (!url) {
      throw new Error("Failed to get checkout url");
    }

    return url;
  }
}
