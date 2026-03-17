import type {
  IRazorpayOptions,
  IRazorpayPaymentLinkPayload,
  IRazorpayPaymentLinkResponse,
} from "../types/razorpay";
import { UnifyFetch } from "../utils/fetch";

export class Razorpay extends UnifyFetch {
  private keyId: string;
  private keySecret: string;

  constructor(options: IRazorpayOptions) {
    super();
    this.keyId = options.keyId;
    this.keySecret = options.keySecret;
  }

  private getApiBaseUrl() {
    return "https://api.razorpay.com/v1";
  }

  private getApiRequestHeaders() {
    const credentials = btoa(`${this.keyId}:${this.keySecret}`);
    return {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    };
  }

  async getCheckoutUrl(
    payload: IRazorpayPaymentLinkPayload
  ): Promise<string> {
    const [res] = await this.jsonFetch<IRazorpayPaymentLinkResponse>(
      `${this.getApiBaseUrl()}/payment_links`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: this.getApiRequestHeaders(),
      }
    );

    if (!res.short_url) {
      throw new Error("Failed to create Razorpay payment link");
    }

    return res.short_url;
  }

  async verifySignature(payload: {
    body: string;
    signature: string;
    secret: string;
  }): Promise<{ type: string; event: unknown } | { error: Error }> {
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

      const expectedSignature = Array.from(new Uint8Array(hmac))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (expectedSignature !== payload.signature) {
        throw new Error("Invalid webhook signature");
      }

      const parsed = JSON.parse(payload.body);

      return {
        type: parsed.event,
        event: parsed.payload,
      };
    } catch (err) {
      return { error: err as Error };
    }
  }
}
