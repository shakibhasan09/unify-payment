import {
  ISSLCommerzCheckoutResponse,
  ISSLCommerzCreateCheckoutPayload,
  ISSLCommerzOptions,
} from "../types/sslcommerz";
import { UnifyFetch } from "../utils/fetch";

export class SSLCommerz extends UnifyFetch {
  constructor(private options: ISSLCommerzOptions) {
    super();
  }

  private getApiBaseUrl() {
    return this.options.apiUrl;
  }

  private getApiCheckoutUrl() {
    return `${this.getApiBaseUrl()}/gwprocess/v4/api.php`;
  }

  private getApiValidationUrl() {
    return `${this.getApiBaseUrl()}/validator/api/validationserverAPI.php`;
  }

  private getApiRefundUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  private getApiRefundQueryUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  private getApiTransactionQueryBySessionIdUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  private getApiTransactionQueryByTransactionIdUrl() {
    return `${this.getApiBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  private getApiHeaders() {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  private urlFormEncode(payload: Record<string, string | number>) {
    return Object.entries(payload)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
  }

  async getCheckoutUrl(payload: ISSLCommerzCreateCheckoutPayload) {
    const [res] = await this.jsonFetch<ISSLCommerzCheckoutResponse>(
      this.getApiCheckoutUrl(),
      {
        method: "POST",
        body: this.urlFormEncode(payload),
        headers: this.getApiHeaders(),
      }
    );

    if (res.status === "FAILED") {
      throw new Error(res.failedreason);
    }

    return res.redirectGatewayURL;
  }
}
