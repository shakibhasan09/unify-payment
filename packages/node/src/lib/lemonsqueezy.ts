import { timingSafeEqual } from "node:crypto";
import {
  ILemonSqueezyCheckoutOptions,
  ILemonSqueezyWebhookEeventResponse,
  TGetCheckoutUrl,
  TLemonSqueezyWebhookEvents,
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
    const [res] = await this.jsonFetch<TGetCheckoutUrl>(
      `${this.getApiBaseUrl()}/checkouts`,
      {
        method: "POST",
        body: JSON.stringify({ data: options }),
        headers: this.getApiRequestHeaders(),
      }
    );

    if ("errors" in res) {
      throw new Error(res.errors[0].detail);
    }

    return res.data.attributes.url;
  }

  async verifySignature(payload: {
    signature: string;
    secret: string;
    body: string;
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

      const expected = Buffer.from(new Uint8Array(hmac));
      const provided = Buffer.from(payload.signature, "hex");

      if (
        provided.length !== expected.length ||
        !timingSafeEqual(provided, expected)
      ) {
        throw new Error("Invalid signature");
      }

      const event = JSON.parse(payload.body) as ILemonSqueezyWebhookEeventResponse;

      return {
        event,
        type: event.meta?.event_name as TLemonSqueezyWebhookEvents,
      };
    } catch (err) {
      return {
        error: err as Error,
      };
    }
  }
}
