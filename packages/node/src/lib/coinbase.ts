import type {
  ICoinbaseOptions,
  ICoinbaseChargePayload,
  ICoinbaseChargeResponse,
} from "../types/coinbase";
import { UnifyFetch } from "../utils/fetch";

export class Coinbase extends UnifyFetch {
  private apiKey: string;

  constructor(options: ICoinbaseOptions) {
    super();
    this.apiKey = options.apiKey;
  }

  private getApiBaseUrl() {
    return "https://api.commerce.coinbase.com";
  }

  private getApiRequestHeaders() {
    return {
      "Content-Type": "application/json",
      "X-CC-Api-Key": this.apiKey,
      "X-CC-Version": "2018-03-22",
    };
  }

  async createCharge(
    payload: ICoinbaseChargePayload
  ): Promise<{ id: string; code: string; url: string }> {
    const [res] = await this.jsonFetch<ICoinbaseChargeResponse>(
      `${this.getApiBaseUrl()}/charges`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: this.getApiRequestHeaders(),
      }
    );

    if (!res.data?.hosted_url) {
      throw new Error("Failed to create Coinbase Commerce charge");
    }

    return {
      id: res.data.id,
      code: res.data.code,
      url: res.data.hosted_url,
    };
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
        type: parsed.event?.type,
        event: parsed.event?.data,
      };
    } catch (err) {
      return { error: err as Error };
    }
  }
}
