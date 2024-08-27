import { CheckoutCreateParams } from "../types/lemonsqueezy";
import {
  LemonSqueezyWebhookEevent,
  LemonSqueezyWebhookEvents,
} from "../types/lemonsqueezy.hook";
import { UnifyFetch } from "../utils/fetch";

export class LemonSqueezy {
  constructor(private apiKey: string) {}

  getApiBaseUrl() {
    return "https://api.lemonsqueezy.com/v1";
  }

  getApiRequestHeaders() {
    return {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }
}

type GetCheckoutUrlType =
  | { data: { attributes: { url: string } } }
  | { errors: [{ detail: string }] };

export class UnifyLemonSqueezy extends UnifyFetch {
  constructor(private lemonSqueezy: LemonSqueezy) {
    super();
  }

  async getCheckoutUrl(body: CheckoutCreateParams) {
    const [res] = await this.jsonFetch<GetCheckoutUrlType>("/checkouts", {
      method: "POST",
      body: JSON.stringify(body),
      headers: this.lemonSqueezy.getApiRequestHeaders(),
    });

    if ("errors" in res) {
      throw new Error(res.errors[0].detail);
    }

    return res.data.attributes.url;
  }

  webhook = new UnifyLemonSqueezyWebhook(this.lemonSqueezy);
}

type LemonSqueezyWebhookEventResponse =
  | { error: Error }
  | {
      event: LemonSqueezyWebhookEevent;
      type: LemonSqueezyWebhookEvents;
    };

export class UnifyLemonSqueezyWebhook {
  constructor(private lemonsqueezy: LemonSqueezy) {}

  async verifySignature(payload: {
    signature: string;
    secret: string;
    body: string;
    x_event: string;
  }): Promise<LemonSqueezyWebhookEventResponse> {
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
        event: JSON.parse(payload.body) as LemonSqueezyWebhookEevent,
        type: payload.x_event as LemonSqueezyWebhookEvents,
      };
    } catch (err) {
      return {
        error: err as Error,
      };
    }
  }
}
