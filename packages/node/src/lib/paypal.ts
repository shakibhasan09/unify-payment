import {
  link,
  paypalAuthResponse,
  paypalOptions,
  PayPalOrderResponse,
  paypalPayload,
} from "../types/paypal";
import { UnifyFetch } from "../utils/fetch";

export class Paypal extends UnifyFetch {
  constructor(private options: paypalOptions) {
    super();
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

  async getAccessToken() {
    const url = `${this.getApiBaseUrl()}/v1/oauth2/token`;

    const auth = btoa(`${this.getClientId()}:${this.getClientSecret()}`);

    const [response] = await this.jsonFetch<paypalAuthResponse>(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    return response.access_token;
  }
}

export class UnifyPaypal extends UnifyFetch {
  constructor(private paypal: Paypal) {
    super();
  }

  async getCheckoutUrl(payload: paypalPayload) {
    const accessToken = await this.paypal.getAccessToken();

    const [res] = await this.jsonFetch<PayPalOrderResponse>(
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
