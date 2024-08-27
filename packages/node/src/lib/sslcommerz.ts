import {
  SSLCommerzCheckoutResponse,
  SSLCommerzCreateCheckoutPayload,
} from "../types/sslcommerz";
import { UnifyFetch } from "../utils/fetch";

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

export class UnifySSLCommerz extends UnifyFetch {
  constructor(private sslcommerz: SSLCommerz) {
    super();
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
    const [res] = await this.jsonFetch<SSLCommerzCheckoutResponse>(
      this.sslcommerz.getApiCheckoutUrl(),
      {
        method: "POST",
        body: this.urlFormEncode(payload),
        headers: this.sslcommerz.getApiHeaders(),
      }
    );

    if (res.status === "FAILED") {
      throw new Error(res.failedreason);
    }

    return res.redirectGatewayURL;
  }
}
