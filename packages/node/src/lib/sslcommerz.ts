import {
  SSLCommerzCheckoutResponse,
  SSLCommerzCreateCheckoutPayload,
} from "../types/sslcommerz";

export type SSLCommerzOptions = {
  apiUrl: string;
  store_id: string;
  store_url?: string;
  store_passwd: string;
};

export class SSLCommerz {
  constructor(private options: SSLCommerzOptions) {}

  getApiBaseUrl() {
    return this.options.apiUrl;
  }

  getApiCheckoutUrl() {
    return `${this.getApiBaseUrl()}/gwprocess/v4/api.php`;
  }

  getApiValidationUrl() {
    return `${this.getApiBaseUrl()}/validator/api/validationserverAPI.php`;
  }

  getApiRefundUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  getApiRefundQueryUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  getApiTransactionQueryBySessionIdUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  getApiTransactionQueryByTransactionIdUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  getApiHeaders() {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }
}

export class UnifySSLCommerz {
  constructor(private sslcommerz: SSLCommerz) {}

  private async fetch(
    url: string,
    params?: { method?: string; headers?: HeadersInit; body?: BodyInit }
  ) {
    return await fetch(url, {
      method: params?.method || "GET",
      headers: this.sslcommerz.getApiHeaders(),
      body: params?.body,
    });
  }

  private urlFormEncode(payload: Record<string, string | number>) {
    return Object.entries(payload)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  async getCheckoutUrl(payload: SSLCommerzCreateCheckoutPayload) {
    const req = await this.fetch(this.sslcommerz.getApiCheckoutUrl(), {
      method: "POST",
      body: this.urlFormEncode(payload),
      headers: this.sslcommerz.getApiHeaders(),
    });

    // TODO: handle parsing error
    const res = (await req.json()) as SSLCommerzCheckoutResponse;

    if (res.status === "FAILED") {
      throw new Error(res.failedreason);
    }

    return res.redirectGatewayURL;
  }
}
