import {
  ILemonSqueezyCheckoutOptions,
  TGetCheckoutUrl,
  TWebhookEventResponse,
} from "../types/lemonsqueezy";
import { UnifyFetch } from "../utils/fetch";

export class LemonSqueezy extends UnifyFetch {
  constructor(private apiKey: string) {
    super();
  }

  private getApiBaseUrl() {
    return "https://api.lemonsqueezy.com/v1";
  }

  private getApiRequestHeaders() {
    return {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async getCheckoutUrl(options: ILemonSqueezyCheckoutOptions) {
    const [res] = await this.jsonFetch<TGetCheckoutUrl>("/checkouts", {
      method: "POST",
      body: JSON.stringify(options),
      headers: this.getApiRequestHeaders(),
    });

    if ("errors" in res) {
      throw new Error(res.errors[0].detail);
    }

    return res.data.attributes.url;
  }

  async verifySignature(payload: {
    signature: string;
    secret: string;
    body: string;
    x_event: string;
  }): Promise<TWebhookEventResponse> {
    try {
      const encoder = new TextEncoder();

      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(payload.secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const hmac = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(payload.body)
      );

      const digest = Array.from(new Uint8Array(hmac))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (digest !== payload.signature) {
        throw new Error("Invalid signature");
      }

      return {
        event: JSON.parse(payload.body),
        type: payload.x_event as any,
      };
    } catch (err) {
      return {
        error: err as Error,
      };
    }
  }
}
