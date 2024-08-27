import {
  IBkashAccessTokenResponse,
  IBkashCheckoutOptions,
  IBkashCheckoutResponse,
  IBkashErrorResponse,
  IBkashPayloadProps,
} from "../types/bkash";
import { UnifyFetch } from "../utils/fetch";

export class Bkash extends UnifyFetch {
  constructor(private options: IBkashPayloadProps) {
    super();
  }

  private getAppKey() {
    return this.options.app_key;
  }

  private getApiBaseUrl() {
    return this.options.apiUrl;
  }

  private getApiRequestHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: this.options.username,
      password: this.options.password,
    };
  }

  async getAccessToken() {
    const [res] = await this.jsonFetch<
      IBkashAccessTokenResponse | IBkashErrorResponse
    >(`${this.getApiBaseUrl()}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: this.getApiRequestHeaders(),
      body: JSON.stringify({
        app_key: this.options.app_key,
        app_secret: this.options.app_secret,
      }),
    });

    if ("errorMessage" in res) {
      throw new Error(res.errorMessage);
    }

    return res.id_token;
  }

  async getCheckoutUrl(options: IBkashCheckoutOptions) {
    const accessToken = await this.getAccessToken();

    const [res] = await this.jsonFetch<
      IBkashCheckoutResponse | IBkashErrorResponse
    >(`${this.getApiBaseUrl()}/tokenized/checkout/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-App-Key": this.getAppKey(),
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(options),
    });

    if ("errorMessage" in res) {
      throw new Error(res.errorMessage);
    }

    return res.bkashURL;
  }
}
