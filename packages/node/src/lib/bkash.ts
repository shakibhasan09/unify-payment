import {
  IBkashAccessTokenResponse,
  IBkashCheckoutOptions,
  IBkashCheckoutResponse,
  IBkashErrorResponse,
} from "../types/bkash";
import { UnifyFetch } from "../utils/fetch";

type BkashPayloadProps = {
  apiUrl: string;
  username: string;
  password: string;
  app_key: string;
  app_secret: string;
};

export class Bkash extends UnifyFetch {
  constructor(private options: BkashPayloadProps) {
    super();
  }

  getApiBaseUrl() {
    return this.options.apiUrl;
  }

  getApiRequestHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: this.options.username,
      password: this.options.password,
    };
  }

  getAppKey() {
    return this.options.app_key;
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
}

export class UnifyBkash extends UnifyFetch {
  constructor(private bkash: Bkash) {
    super();
  }

  async getCheckoutUrl(options: IBkashCheckoutOptions) {
    const accessToken = await this.bkash.getAccessToken();

    const [res] = await this.jsonFetch<
      IBkashCheckoutResponse | IBkashErrorResponse
    >(`${this.bkash.getApiBaseUrl()}/tokenized/checkout/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-App-Key": this.bkash.getAppKey(),
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
