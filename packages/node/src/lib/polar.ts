import type {
  IPolarOptions,
  IPolarCheckoutCreatePayload,
  IPolarCheckoutResponse,
} from "../types/polar";
import { UnifyFetch } from "../utils/fetch";

export class Polar extends UnifyFetch {
  private accessToken: string;
  private sandbox: boolean;

  constructor(options: IPolarOptions) {
    super();
    this.accessToken = options.accessToken;
    this.sandbox = options.sandbox ?? false;
  }

  private getApiBaseUrl() {
    return this.sandbox
      ? "https://sandbox-api.polar.sh/v1"
      : "https://api.polar.sh/v1";
  }

  private getApiRequestHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  async getCheckoutUrl(payload: IPolarCheckoutCreatePayload): Promise<string> {
    const [res] = await this.jsonFetch<IPolarCheckoutResponse>(
      `${this.getApiBaseUrl()}/checkouts/`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: this.getApiRequestHeaders(),
      }
    );

    if (!res.url) {
      throw new Error("Failed to create Polar checkout session");
    }

    return res.url;
  }

  async verifySignature(payload: {
    body: string;
    signature: string;
    secret: string;
    webhookId: string;
    timestamp: string;
  }): Promise<{ type: string; event: unknown } | { error: Error }> {
    try {
      const message = `${payload.webhookId}.${payload.timestamp}.${payload.body}`;
      const encoder = new TextEncoder();

      // Standard Webhooks uses base64-encoded secret (strip "whsec_" prefix if present)
      const secretStr = payload.secret.startsWith("whsec_")
        ? payload.secret.slice(6)
        : payload.secret;
      const secretBytes = Uint8Array.from(atob(secretStr), (c) =>
        c.charCodeAt(0)
      );

      const key = await crypto.subtle.importKey(
        "raw",
        secretBytes,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const hmac = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(message)
      );

      const expectedSignature = btoa(
        String.fromCharCode(...new Uint8Array(hmac))
      );

      // Standard Webhooks signature header may contain multiple signatures
      // Format: "v1,<base64>" or multiple space-separated values
      const signatures = payload.signature.split(" ");
      const isValid = signatures.some((sig) => {
        const value = sig.startsWith("v1,") ? sig.slice(3) : sig;
        return value === expectedSignature;
      });

      if (!isValid) {
        throw new Error("Invalid webhook signature");
      }

      const parsed = JSON.parse(payload.body);

      return {
        type: parsed.type,
        event: parsed.data,
      };
    } catch (err) {
      return { error: err as Error };
    }
  }
}
